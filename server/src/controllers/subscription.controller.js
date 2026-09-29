import mongoose from "mongoose";

import {
    getSubscriptions,
    getSubscriptionById,
    createSubscription,
    updateSubscription,
    deleteSubscription,
    getUpcomingSubscriptions,
    getSubscriptionStats,
    getOverdueSubscriptions,
    shareSubscription,
    unshareSubscription,
    updateSubscriptionSharingPermission,
    removeSubscriptionMemberAccess,
    getFamilySharedSubscriptions,
} from "../services/subscription.service.js";

// ============================================================================
// SUBSCRIPTION CONTROLLER
// ============================================================================
//
// The controller is responsible for:
// - Reading HTTP request data
// - Validating request parameters
// - Calling subscription services
// - Returning consistent API responses
// ============================================================================

const getUserId = (req) => {
    return req.user?._id || req.user?.id || null;
};

// ============================================================================
// GET ALL SUBSCRIPTIONS
// GET /api/subscriptions
// ============================================================================

export const getAllSubscriptions = async (req, res) => {
    try {
        const { search, status, category } = req.query;

        const subscriptions = await getSubscriptions(getUserId(req), {
            search,
            status,
            category,
        });

        return res.status(200).json({
            success: true,

            count: subscriptions.length,

            data: subscriptions,
        });
    } catch (error) {
        console.error("Get subscriptions error:", error);

        return res.status(error.statusCode || 500).json({
            success: false,

            message: error.message || "Unable to load subscriptions.",
        });
    }
};

// ============================================================================
// GET SINGLE SUBSCRIPTION
// GET /api/subscriptions/:id
// ============================================================================

export const getSingleSubscription = async (req, res) => {
    try {
        const { id } = req.params;

        // ----------------------------------------------------------------
        // Validate MongoDB ID
        // ----------------------------------------------------------------

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,

                message: "Invalid subscription ID.",
            });
        }

        const subscription = await getSubscriptionById(
            id,
            getUserId(req),
        );

        if (!subscription) {
            return res.status(404).json({
                success: false,

                message: "Subscription not found.",
            });
        }

        return res.status(200).json({
            success: true,

            data: subscription,
        });
    } catch (error) {
        console.error("Get subscription error:", error);

        return res.status(error.statusCode || 500).json({
            success: false,

            message: error.message || "Unable to load subscription.",
        });
    }
};

// ============================================================================
// CREATE SUBSCRIPTION
// POST /api/subscriptions
// ============================================================================

export const createNewSubscription = async (req, res) => {
    try {
        const subscription = await createSubscription(
            req.body,
            getUserId(req),
        );

        return res.status(201).json({
            success: true,

            message: "Subscription created successfully.",

            data: subscription,
        });
    } catch (error) {
        console.error("Create subscription error:", error);

        return res.status(error.statusCode || 400).json({
            success: false,

            message: error.message || "Unable to create subscription.",
        });
    }
};

// ============================================================================
// GET UPCOMING SUBSCRIPTIONS
// GET /api/subscriptions/upcoming
// ============================================================================

export const getUpcomingSubscriptionRenewals = async (req, res) => {
    try {
        const subscriptions = await getUpcomingSubscriptions(
            getUserId(req),
            req.query.days || 30,
        );

        return res.status(200).json({
            success: true,
            count: subscriptions.length,
            data: subscriptions,
        });
    } catch (error) {
        console.error("Get upcoming subscriptions error:", error);

        return res.status(error.statusCode || 500).json({
            success: false,
            message:
                error.message || "Unable to load upcoming subscriptions.",
        });
    }
};

// ============================================================================
// GET SUBSCRIPTION STATS
// GET /api/subscriptions/stats
// ============================================================================

export const getSubscriptionSummary = async (req, res) => {
    try {
        const stats = await getSubscriptionStats(getUserId(req));

        return res.status(200).json({
            success: true,
            data: stats,
        });
    } catch (error) {
        console.error("Get subscription stats error:", error);

        return res.status(error.statusCode || 500).json({
            success: false,
            message:
                error.message || "Unable to load subscription stats.",
        });
    }
};

// ============================================================================
// GET OVERDUE SUBSCRIPTIONS
// GET /api/subscriptions/overdue
// ============================================================================

export const getOverdueSubscriptionList = async (req, res) => {
    try {
        const subscriptions = await getOverdueSubscriptions(getUserId(req));

        return res.status(200).json({
            success: true,
            count: subscriptions.length,
            data: subscriptions,
        });
    } catch (error) {
        console.error("Get overdue subscriptions error:", error);

        return res.status(error.statusCode || 500).json({
            success: false,
            message:
                error.message || "Unable to load overdue subscriptions.",
        });
    }
};

// ============================================================================
// SHARE SUBSCRIPTION WITH FAMILY
// POST /api/subscriptions/:id/share
// ============================================================================

export const shareSubscriptionWithFamily = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid subscription ID.",
            });
        }

        const subscription = await shareSubscription(
            id,
            getUserId(req),
            req.body,
        );

        return res.status(200).json({
            success: true,
            message: "Subscription shared successfully.",
            data: subscription,
        });
    } catch (error) {
        console.error("Share subscription error:", error);

        return res.status(error.statusCode || 400).json({
            success: false,
            message: error.message || "Unable to share subscription.",
        });
    }
};

// ============================================================================
// UNSHARE SUBSCRIPTION FROM FAMILY
// DELETE /api/subscriptions/:id/share
// ============================================================================

export const unshareSubscriptionFromFamily = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid subscription ID.",
            });
        }

        const subscription = await unshareSubscription(
            id,
            getUserId(req),
            req.body,
        );

        return res.status(200).json({
            success: true,
            message: "Subscription sharing updated successfully.",
            data: subscription,
        });
    } catch (error) {
        console.error("Unshare subscription error:", error);

        return res.status(error.statusCode || 400).json({
            success: false,
            message:
                error.message || "Unable to update subscription sharing.",
        });
    }
};

// ============================================================================
// UPDATE SUBSCRIPTION MEMBER PERMISSION
// PATCH /api/subscriptions/:id/share/:memberId
// ============================================================================

export const updateSubscriptionMemberPermission = async (req, res) => {
    try {
        const { id, memberId } = req.params;

        if (
            !mongoose.Types.ObjectId.isValid(id) ||
            !mongoose.Types.ObjectId.isValid(memberId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid subscription or member ID.",
            });
        }

        const subscription = await updateSubscriptionSharingPermission(
            id,
            getUserId(req),
            memberId,
            req.body?.access,
        );

        return res.status(200).json({
            success: true,
            message: "Subscription member permission updated successfully.",
            data: subscription,
        });
    } catch (error) {
        console.error("Update subscription member permission error:", error);

        return res.status(error.statusCode || 400).json({
            success: false,
            message:
                error.message ||
                "Unable to update subscription member permission.",
        });
    }
};

// ============================================================================
// REMOVE SUBSCRIPTION MEMBER
// DELETE /api/subscriptions/:id/share/:memberId
// ============================================================================

export const removeSubscriptionMember = async (req, res) => {
    try {
        const { id, memberId } = req.params;

        if (
            !mongoose.Types.ObjectId.isValid(id) ||
            !mongoose.Types.ObjectId.isValid(memberId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid subscription or member ID.",
            });
        }

        const subscription = await removeSubscriptionMemberAccess(
            id,
            getUserId(req),
            memberId,
        );

        return res.status(200).json({
            success: true,
            message: "Subscription member access removed successfully.",
            data: subscription,
        });
    } catch (error) {
        console.error("Remove subscription member error:", error);

        return res.status(error.statusCode || 400).json({
            success: false,
            message:
                error.message ||
                "Unable to remove subscription member access.",
        });
    }
};

// ============================================================================
// GET FAMILY SHARED SUBSCRIPTIONS
// GET /api/subscriptions/family/shared
// ============================================================================

export const getFamilySharedSubscriptionList = async (req, res) => {
    try {
        const subscriptions = await getFamilySharedSubscriptions(getUserId(req));

        return res.status(200).json({
            success: true,
            count: subscriptions.length,
            data: subscriptions,
        });
    } catch (error) {
        console.error("Get family shared subscriptions error:", error);

        return res.status(error.statusCode || 500).json({
            success: false,
            message:
                error.message ||
                "Unable to load family shared subscriptions.",
        });
    }
};

// ============================================================================
// UPDATE SUBSCRIPTION
// PUT /api/subscriptions/:id
// ============================================================================

export const updateExistingSubscription = async (req, res) => {
    try {
        const { id } = req.params;

        // ----------------------------------------------------------------
        // Validate MongoDB ID
        // ----------------------------------------------------------------

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,

                message: "Invalid subscription ID.",
            });
        }

        const subscription = await updateSubscription(
            id,
            req.body,
            getUserId(req),
        );

        if (!subscription) {
            return res.status(404).json({
                success: false,

                message: "Subscription not found.",
            });
        }

        return res.status(200).json({
            success: true,

            message: "Subscription updated successfully.",

            data: subscription,
        });
    } catch (error) {
        console.error("Update subscription error:", error);

        return res.status(error.statusCode || 400).json({
            success: false,

            message: error.message || "Unable to update subscription.",
        });
    }
};

// ============================================================================
// DELETE SUBSCRIPTION
// DELETE /api/subscriptions/:id
// ============================================================================

export const removeSubscription = async (req, res) => {
    try {
        const { id } = req.params;

        // ----------------------------------------------------------------
        // Validate MongoDB ID
        // ----------------------------------------------------------------

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,

                message: "Invalid subscription ID.",
            });
        }

        const subscription = await deleteSubscription(
            id,
            getUserId(req),
        );

        if (!subscription) {
            return res.status(404).json({
                success: false,

                message: "Subscription not found.",
            });
        }

        return res.status(200).json({
            success: true,

            message: "Subscription deleted successfully.",

            data: subscription,
        });
    } catch (error) {
        console.error("Delete subscription error:", error);

        return res.status(error.statusCode || 500).json({
            success: false,

            message: error.message || "Unable to delete subscription.",
        });
    }
};
