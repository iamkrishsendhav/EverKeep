import api from "../lib/axios";


// ============================================================================
// SUBSCRIPTION SERVICE
// ============================================================================
//
// All subscription-related API calls live here.
//
// Components should never call axios directly.
// ============================================================================


// ============================================================================
// GET ALL SUBSCRIPTIONS
// ============================================================================

export const getSubscriptions = async (
    params = {}
) => {

    const response =
        await api.get(
            "/subscriptions",
            {
                params,
            }
        );

    return response.data;
};


// ============================================================================
// GET SINGLE SUBSCRIPTION
// ============================================================================

export const getSubscription = async (
    id
) => {

    const response =
        await api.get(
            `/subscriptions/${id}`
        );

    return response.data;
};


// ============================================================================
// CREATE SUBSCRIPTION
// ============================================================================

export const createSubscription = async (
    subscriptionData
) => {

    const response =
        await api.post(
            "/subscriptions",
            subscriptionData
        );

    return response.data;
};


// ============================================================================
// UPDATE SUBSCRIPTION
// ============================================================================

export const updateSubscription = async (
    id,
    subscriptionData
) => {

    const response =
        await api.put(
            `/subscriptions/${id}`,
            subscriptionData
        );

    return response.data;
};


// ============================================================================
// DELETE SUBSCRIPTION
// ============================================================================

export const deleteSubscription = async (
    id
) => {

    const response =
        await api.delete(
            `/subscriptions/${id}`
        );

    return response.data;
};


// ============================================================================
// GET UPCOMING SUBSCRIPTIONS
// ============================================================================

export const getUpcomingSubscriptions = async (
    days = 30
) => {

    const response =
        await api.get(
            "/subscriptions/upcoming",
            {
                params: {
                    days,
                },
            }
        );

    return response.data;
};


// ============================================================================
// GET SUBSCRIPTION STATS
// ============================================================================

export const getSubscriptionStats =
    async () => {

        const response =
            await api.get(
                "/subscriptions/stats"
            );

        return response.data;
    };