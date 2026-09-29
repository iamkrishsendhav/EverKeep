import mongoose from "mongoose";

import {
    createWarranty,
    getWarranties,
    getWarrantyById,
    updateWarranty,
    deleteWarranty,
    getUpcomingWarranties,
    getExpiredWarranties,
    getWarrantyStats,
    shareWarranty,
    unshareWarranty,
    updateWarrantySharingPermission,
    removeWarrantyMemberAccess,
    getFamilySharedWarranties,
    getWarrantyAccessDetails,
} from "../services/warranty.service.js";

// ============================================================================
// WARRANTY CONTROLLER
// ============================================================================
//
// Controller responsibilities:
//
// - Request se data lena
// - Authentication verify karna
// - Basic parameter validation
// - Warranty service ko call karna
// - Consistent API response dena
//
// Business logic → warranty.service.js
// Database logic → Warranty.js
//
// ============================================================================

// ============================================================================
// GET AUTHENTICATED USER ID
// ============================================================================

const getUserId = (req) => {
    return req.user?._id || req.user?.id || null;
};

// ============================================================================
// AUTHENTICATION CHECK
// ============================================================================

const requireUserId = (req) => {
    const userId = getUserId(req);

    if (!userId) {
        const error = new Error("Authentication required.");

        error.statusCode = 401;

        throw error;
    }

    return userId;
};

// ============================================================================
// VALIDATE MONGODB OBJECT ID
// ============================================================================

const validateObjectId = (id, fieldName = "ID") => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error(`Invalid ${fieldName}.`);

        error.statusCode = 400;

        throw error;
    }
};

// ============================================================================
// ERROR RESPONSE HELPER
// ============================================================================

const handleError = (res, error, fallbackMessage) => {
    console.error("Warranty controller error:", error);

    return res.status(error?.statusCode || 500).json({
        success: false,

        message: error?.message || fallbackMessage,
    });
};

// ============================================================================
// CREATE WARRANTY
// POST /api/warranties
// ============================================================================

export const createNewWarranty = async (req, res) => {
    try {
        const userId = requireUserId(req);

        const warranty = await createWarranty(req.body, userId);

        return res.status(201).json({
            success: true,

            message: "Warranty created successfully.",

            data: warranty,
        });
    } catch (error) {
        return handleError(
            res,

            error,

            "Unable to create warranty.",
        );
    }
};

// ============================================================================
// GET ALL WARRANTIES
// GET /api/warranties
// ============================================================================
//
// Query:
//
// ?search=iphone
// ?expiry=active
// ?expiry=expired
// ?page=1
// ?limit=20
//
// ============================================================================

export const getAllWarranties = async (req, res) => {
    try {
        const userId = requireUserId(req);

        const result = await getWarranties(
            userId,

            {
                search: req.query.search,

                expiry: req.query.expiry,

                page: req.query.page,

                limit: req.query.limit,
            },
        );

        return res.status(200).json({
            success: true,

            count: result.warranties.length,

            data: result.warranties,

            pagination: result.pagination,
        });
    } catch (error) {
        return handleError(
            res,

            error,

            "Unable to load warranties.",
        );
    }
};

// ============================================================================
// GET SINGLE WARRANTY
// GET /api/warranties/:id
// ============================================================================

export const getSingleWarranty = async (req, res) => {
    try {
        const userId = requireUserId(req);

        const { id } = req.params;

        validateObjectId(id, "warranty ID");

        const warranty = await getWarrantyById(
            id,

            userId,
        );

        return res.status(200).json({
            success: true,

            data: warranty,
        });
    } catch (error) {
        return handleError(
            res,

            error,

            "Unable to load warranty.",
        );
    }
};

// ============================================================================
// UPDATE WARRANTY
// PUT /api/warranties/:id
// ============================================================================

export const updateExistingWarranty = async (req, res) => {
    try {
        const userId = requireUserId(req);

        const { id } = req.params;

        validateObjectId(id, "warranty ID");

        const warranty = await updateWarranty(
            id,

            req.body,

            userId,
        );

        return res.status(200).json({
            success: true,

            message: "Warranty updated successfully.",

            data: warranty,
        });
    } catch (error) {
        return handleError(
            res,

            error,

            "Unable to update warranty.",
        );
    }
};

// ============================================================================
// DELETE WARRANTY
// DELETE /api/warranties/:id
// ============================================================================

export const removeWarranty = async (req, res) => {
    try {
        const userId = requireUserId(req);

        const { id } = req.params;

        validateObjectId(id, "warranty ID");

        const warranty = await deleteWarranty(
            id,

            userId,
        );

        return res.status(200).json({
            success: true,

            message: "Warranty deleted successfully.",

            data: {
                deletedWarrantyId: warranty._id,
            },
        });
    } catch (error) {
        return handleError(
            res,

            error,

            "Unable to delete warranty.",
        );
    }
};

// ============================================================================
// UPCOMING WARRANTIES
// GET /api/warranties/upcoming
// ============================================================================
//
// Example:
//
// /api/warranties/upcoming?days=30
//
// ============================================================================

export const getUpcomingWarrantyList = async (req, res) => {
    try {
        const userId = requireUserId(req);

        const days = req.query.days ?? 30;

        const warranties = await getUpcomingWarranties(
            userId,

            days,
        );

        return res.status(200).json({
            success: true,

            count: warranties.length,

            data: warranties,
        });
    } catch (error) {
        return handleError(
            res,

            error,

            "Unable to load upcoming warranties.",
        );
    }
};

// ============================================================================
// EXPIRED WARRANTIES
// GET /api/warranties/expired
// ============================================================================

export const getExpiredWarrantyList = async (req, res) => {
    try {
        const userId = requireUserId(req);

        const warranties = await getExpiredWarranties(userId);

        return res.status(200).json({
            success: true,

            count: warranties.length,

            data: warranties,
        });
    } catch (error) {
        return handleError(
            res,

            error,

            "Unable to load expired warranties.",
        );
    }
};

// ============================================================================
// WARRANTY STATISTICS
// GET /api/warranties/stats
// ============================================================================

export const getWarrantySummary = async (req, res) => {
    try {
        const userId = requireUserId(req);

        const stats = await getWarrantyStats(userId);

        return res.status(200).json({
            success: true,

            data: stats,
        });
    } catch (error) {
        return handleError(
            res,

            error,

            "Unable to load warranty statistics.",
        );
    }
};

// ============================================================================
// SHARE WARRANTY
// POST /api/warranties/:id/share
// ============================================================================
//
// Body:
//
// {
//     "memberIds": [
//         "FAMILY_MEMBER_ID"
//     ],
//
//     "access": "View"
// }
//
// OR:
//
// {
//     "memberIds": [
//         "FAMILY_MEMBER_ID"
//     ],
//
//     "access": "Edit"
// }
//
// ============================================================================

export const shareWarrantyWithFamily = async (req, res) => {
    try {
        const userId = requireUserId(req);

        const { id } = req.params;

        validateObjectId(id, "warranty ID");

        const warranty = await shareWarranty(
            id,

            userId,

            req.body,
        );

        return res.status(200).json({
            success: true,

            message: "Warranty shared successfully.",

            data: warranty,
        });
    } catch (error) {
        return handleError(
            res,

            error,

            "Unable to share warranty.",
        );
    }
};

// ============================================================================
// UNSHARE WARRANTY
// DELETE /api/warranties/:id/share
// ============================================================================
//
// Body:
//
// {
//     "memberIds": [
//         "FAMILY_MEMBER_ID"
//     ]
// }
//
// Empty memberIds:
//
// Remove all sharing.
//
// ============================================================================

export const unshareWarrantyFromFamily = async (req, res) => {
    try {
        const userId = requireUserId(req);

        const { id } = req.params;

        validateObjectId(id, "warranty ID");

        const warranty = await unshareWarranty(
            id,

            userId,

            req.body || {},
        );

        return res.status(200).json({
            success: true,

            message: "Warranty sharing updated successfully.",

            data: warranty,
        });
    } catch (error) {
        return handleError(
            res,

            error,

            "Unable to update warranty sharing.",
        );
    }
};

// ============================================================================
// UPDATE MEMBER PERMISSION
// PATCH /api/warranties/:id/share/:memberId
// ============================================================================
//
// Body:
//
// {
//     "access": "View"
// }
//
// OR:
//
// {
//     "access": "Edit"
// }
//
// ============================================================================

export const updateWarrantyMemberPermission = async (req, res) => {
    try {
        const userId = requireUserId(req);

        const { id, memberId } = req.params;

        validateObjectId(id, "warranty ID");

        validateObjectId(memberId, "family member ID");

        const warranty = await updateWarrantySharingPermission(
            id,

            userId,

            memberId,

            req.body?.access,
        );

        return res.status(200).json({
            success: true,

            message: "Warranty member permission updated successfully.",

            data: warranty,
        });
    } catch (error) {
        return handleError(
            res,

            error,

            "Unable to update warranty member permission.",
        );
    }
};

// ============================================================================
// REMOVE MEMBER ACCESS
// DELETE /api/warranties/:id/share/:memberId
// ============================================================================

export const removeWarrantyMember = async (req, res) => {
    try {
        const userId = requireUserId(req);

        const { id, memberId } = req.params;

        validateObjectId(id, "warranty ID");

        validateObjectId(memberId, "family member ID");

        const warranty = await removeWarrantyMemberAccess(
            id,

            userId,

            memberId,
        );

        return res.status(200).json({
            success: true,

            message: "Warranty member access removed successfully.",

            data: warranty,
        });
    } catch (error) {
        return handleError(
            res,

            error,

            "Unable to remove warranty member access.",
        );
    }
};

// ============================================================================
// FAMILY SHARED WARRANTIES
// GET /api/warranties/family/shared
// ============================================================================

export const getFamilySharedWarrantyList = async (req, res) => {
    try {
        const userId = requireUserId(req);

        const warranties = await getFamilySharedWarranties(userId);

        return res.status(200).json({
            success: true,

            count: warranties.length,

            data: warranties,
        });
    } catch (error) {
        return handleError(
            res,

            error,

            "Unable to load family shared warranties.",
        );
    }
};

// ============================================================================
// WARRANTY ACCESS DETAILS
// GET /api/warranties/:id/access
// ============================================================================

export const getWarrantyAccess = async (req, res) => {
    try {
        const userId = requireUserId(req);

        const { id } = req.params;

        validateObjectId(id, "warranty ID");

        const access = await getWarrantyAccessDetails(
            id,

            userId,
        );

        return res.status(200).json({
            success: true,

            data: access,
        });
    } catch (error) {
        return handleError(
            res,

            error,

            "Unable to load warranty access details.",
        );
    }
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
    createNewWarranty,

    getAllWarranties,

    getSingleWarranty,

    updateExistingWarranty,

    removeWarranty,

    getUpcomingWarrantyList,

    getExpiredWarrantyList,

    getWarrantySummary,

    shareWarrantyWithFamily,

    unshareWarrantyFromFamily,

    updateWarrantyMemberPermission,

    removeWarrantyMember,

    getFamilySharedWarrantyList,

    getWarrantyAccess,
};
