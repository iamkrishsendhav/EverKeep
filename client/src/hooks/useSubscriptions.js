import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    getSubscriptions,
    createSubscription,
    updateSubscription,
    deleteSubscription,
} from "../services/subscription.service";


// ============================================================================
// SUBSCRIPTION HOOK
// ============================================================================
//
// Responsible for:
// - Loading subscriptions
// - Creating subscriptions
// - Updating subscriptions
// - Deleting subscriptions
// - Managing loading/error states
//
// Components should use this hook instead of calling the service directly.
// ============================================================================

const useSubscriptions = () => {

    // =========================================================================
    // STATE
    // =========================================================================

    const [
        subscriptions,
        setSubscriptions,
    ] = useState([]);


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        error,
        setError,
    ] = useState("");


    const [
        actionLoading,
        setActionLoading,
    ] = useState(false);


    // =========================================================================
    // FETCH SUBSCRIPTIONS
    // =========================================================================

    const fetchSubscriptions = useCallback(
        async (params = {}) => {

            try {

                setLoading(true);
                setError("");


                const response =
                    await getSubscriptions(
                        params
                    );


                setSubscriptions(
                    response?.data || []
                );


                return response;

            } catch (error) {

                console.error(
                    "Failed to fetch subscriptions:",
                    error
                );


                setError(
                    error?.response?.data?.message ||
                    error?.message ||
                    "Unable to load subscriptions."
                );

            } finally {

                setLoading(false);

            }
        },
        []
    );


    // =========================================================================
    // ADD SUBSCRIPTION
    // =========================================================================

    const addSubscription = async (
        data
    ) => {

        try {

            setActionLoading(true);
            setError("");


            const response =
                await createSubscription(
                    data
                );


            if (response?.data) {

                setSubscriptions(
                    (previous) => [
                        response.data,
                        ...previous,
                    ]
                );
            }


            return response;

        } catch (error) {

            console.error(
                "Failed to create subscription:",
                error
            );


            setError(
                error?.response?.data?.message ||
                error?.message ||
                "Unable to create subscription."
            );


            throw error;

        } finally {

            setActionLoading(false);

        }
    };


    // =========================================================================
    // UPDATE SUBSCRIPTION
    // =========================================================================

    const editSubscription = async (
        id,
        data
    ) => {

        try {

            setActionLoading(true);
            setError("");


            const response =
                await updateSubscription(
                    id,
                    data
                );


            if (response?.data) {

                setSubscriptions(
                    (previous) =>
                        previous.map(
                            (subscription) =>
                                subscription._id === id
                                    ? response.data
                                    : subscription
                        )
                );
            }


            return response;

        } catch (error) {

            console.error(
                "Failed to update subscription:",
                error
            );


            setError(
                error?.response?.data?.message ||
                error?.message ||
                "Unable to update subscription."
            );


            throw error;

        } finally {

            setActionLoading(false);

        }
    };


    // =========================================================================
    // DELETE SUBSCRIPTION
    // =========================================================================

    const removeSubscription = async (
        id
    ) => {

        try {

            setActionLoading(true);
            setError("");


            await deleteSubscription(
                id
            );


            setSubscriptions(
                (previous) =>
                    previous.filter(
                        (subscription) =>
                            subscription._id !== id
                    )
            );

        } catch (error) {

            console.error(
                "Failed to delete subscription:",
                error
            );


            setError(
                error?.response?.data?.message ||
                error?.message ||
                "Unable to delete subscription."
            );


            throw error;

        } finally {

            setActionLoading(false);

        }
    };


    // =========================================================================
    // INITIAL LOAD
    // =========================================================================

    useEffect(() => {

        fetchSubscriptions();

    }, [fetchSubscriptions]);


    // =========================================================================
    // RETURN
    // =========================================================================

    return {
        subscriptions,

        loading,

        error,

        actionLoading,

        fetchSubscriptions,

        addSubscription,

        editSubscription,

        removeSubscription,
    };
};


export default useSubscriptions;