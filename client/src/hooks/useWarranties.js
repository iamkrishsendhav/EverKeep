import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    getWarranties,
    createWarranty,
    updateWarranty,
    deleteWarranty,
} from "../services/warranty.service";


// ============================================================
// GET ID
// ============================================================

const getWarrantyId = (warranty) => {

    return (
        warranty?._id ||
        warranty?.id ||
        ""
    );
};


// ============================================================
// EXTRACT DATA
// ============================================================

const extractWarranty = (response) => {

    if (!response) {
        return null;
    }

    // Most common API structure:
    //
    // {
    //   success: true,
    //   data: {...}
    // }

    if (
        response.data &&
        !Array.isArray(response.data)
    ) {
        return response.data;
    }

    return null;
};


// ============================================================
// EXTRACT LIST
// ============================================================

const extractWarrantyList = (response) => {

    if (!response) {
        return [];
    }


    // API:
    //
    // {
    //   success: true,
    //   data: [...]
    // }

    if (Array.isArray(response.data)) {
        return response.data;
    }


    // Axios response where backend
    // directly returns array.

    if (
        Array.isArray(
            response.data?.data
        )
    ) {
        return response.data.data;
    }


    return [];
};


// ============================================================
// HOOK
// ============================================================

const useWarranties = () => {

    // ============================================================
    // STATE
    // ============================================================

    const [
        warranties,
        setWarranties,
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


    const [
        actionError,
        setActionError,
    ] = useState("");


    // ============================================================
    // FETCH
    // ============================================================

    const fetchWarranties = useCallback(
        async () => {

            try {

                setLoading(true);
                setError("");


                const response =
                    await getWarranties();


                const list =
                    extractWarrantyList(
                        response
                    );


                setWarranties(
                    Array.isArray(list)
                        ? list
                        : []
                );


            } catch (error) {

                console.error(
                    "Failed to fetch warranties:",
                    error
                );


                const message =
                    error?.response?.data?.message ||
                    error?.message ||
                    "Unable to load warranties.";


                setError(message);

            } finally {

                setLoading(false);

            }

        },
        []
    );


    // ============================================================
    // CREATE
    // ============================================================

    const addWarranty = useCallback(
        async (data) => {

            try {

                setActionLoading(true);
                setActionError("");
                setError("");


                const response =
                    await createWarranty(
                        data
                    );


                const createdWarranty =
                    extractWarranty(
                        response
                    );


                if (createdWarranty) {

                    setWarranties(
                        (previous) => [

                            createdWarranty,

                            ...previous.filter(
                                (item) =>
                                    getWarrantyId(
                                        item
                                    ) !==
                                    getWarrantyId(
                                        createdWarranty
                                    )
                            ),

                        ]
                    );

                } else {

                    // If backend doesn't return
                    // the created document,
                    // refresh the collection.

                    await fetchWarranties();

                }


                return createdWarranty;

            } catch (error) {

                console.error(
                    "Failed to create warranty:",
                    error
                );


                const message =
                    error?.response?.data?.message ||
                    error?.message ||
                    "Unable to create warranty.";


                setActionError(message);

                throw error;

            } finally {

                setActionLoading(false);

            }

        },
        [fetchWarranties]
    );


    // ============================================================
    // UPDATE
    // ============================================================

    const editWarranty = useCallback(
        async (
            id,
            data
        ) => {

            try {

                setActionLoading(true);
                setActionError("");
                setError("");


                // --------------------------------------------
                // SAFETY
                // --------------------------------------------

                if (!id) {

                    throw new Error(
                        "Warranty ID is required."
                    );

                }


                // --------------------------------------------
                // API
                // --------------------------------------------

                const response =
                    await updateWarranty(
                        id,
                        data
                    );


                const updatedWarranty =
                    extractWarranty(
                        response
                    );


                // --------------------------------------------
                // UPDATE LOCAL STATE
                // --------------------------------------------

                if (updatedWarranty) {

                    const updatedId =
                        getWarrantyId(
                            updatedWarranty
                        );


                    setWarranties(
                        (previous) =>
                            previous.map(
                                (warranty) => {

                                    const currentId =
                                        getWarrantyId(
                                            warranty
                                        );


                                    if (
                                        String(
                                            currentId
                                        ) ===
                                        String(
                                            updatedId ||
                                            id
                                        )
                                    ) {

                                        return {
                                            ...warranty,
                                            ...updatedWarranty,
                                        };

                                    }


                                    return warranty;

                                }
                            )
                    );

                } else {

                    // Backend didn't return
                    // updated document.
                    //
                    // Refresh guarantees that
                    // UI gets latest database state.

                    await fetchWarranties();

                }


                return updatedWarranty;

            } catch (error) {

                console.error(
                    "Failed to update warranty:",
                    error
                );


                const message =
                    error?.response?.data?.message ||
                    error?.message ||
                    "Unable to update warranty.";


                setActionError(message);

                throw error;

            } finally {

                setActionLoading(false);

            }

        },
        [fetchWarranties]
    );


    // ============================================================
    // DELETE
    // ============================================================

    const removeWarranty = useCallback(
        async (id) => {

            try {

                setActionLoading(true);
                setActionError("");
                setError("");


                if (!id) {

                    throw new Error(
                        "Warranty ID is required."
                    );

                }


                // --------------------------------------------
                // API
                // --------------------------------------------

                await deleteWarranty(
                    id
                );


                // --------------------------------------------
                // REMOVE FROM LOCAL STATE
                // --------------------------------------------

                setWarranties(
                    (previous) =>
                        previous.filter(
                            (warranty) =>
                                String(
                                    getWarrantyId(
                                        warranty
                                    )
                                ) !==
                                String(id)
                        )
                );


                return true;

            } catch (error) {

                console.error(
                    "Failed to delete warranty:",
                    error
                );


                const message =
                    error?.response?.data?.message ||
                    error?.message ||
                    "Unable to delete warranty.";


                setActionError(message);

                throw error;

            } finally {

                setActionLoading(false);

            }

        },
        []
    );


    // ============================================================
    // CLEAR ERRORS
    // ============================================================

    const clearErrors = useCallback(() => {

        setError("");
        setActionError("");

    }, []);


    // ============================================================
    // INITIAL LOAD
    // ============================================================

    useEffect(() => {

        fetchWarranties();

    }, [fetchWarranties]);


    // ============================================================
    // RETURN
    // ============================================================

    return {

        warranties,

        loading,

        error,

        actionLoading,

        actionError,

        fetchWarranties,

        addWarranty,

        editWarranty,

        removeWarranty,

        clearErrors,

    };
};


export default useWarranties;