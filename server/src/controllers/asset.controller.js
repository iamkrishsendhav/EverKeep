import assetService from "../services/asset.service.js";

// ============================================================================
// ASSET CONTROLLER
// ============================================================================
//
// Flow:
//
// authMiddleware
//      ↓
// asset.controller.js
//      ↓
// asset.service.js
//      ↓
// Asset.js
//      ↓
// MongoDB
//
// Controller:
// - HTTP request handle karta hai
// - authenticated user identify karta hai
// - service call karta hai
// - response return karta hai
//
// Business logic service mein rahega.
//
// ============================================================================

// ============================================================================
// GET AUTHENTICATED USER ID
// ============================================================================

const getUserId = (req) => {
    return req.user?._id || req.user?.id || null;
};

// ============================================================================
// ERROR RESPONSE HELPER
// ============================================================================

const handleError = (res, error, fallbackMessage) => {
    console.error("Asset controller error:", error);

    return res.status(error?.statusCode || 500).json({
        success: false,

        message: error?.message || fallbackMessage,
    });
};

// ============================================================================
// CREATE ASSET
// POST /api/assets
// ============================================================================

export const createAsset = async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,

                message: "Authentication required.",
            });
        }

        const asset = await assetService.createAsset(
            userId,

            req.body,
        );

        return res.status(201).json({
            success: true,

            message: "Asset created successfully.",

            data: asset,
        });
    } catch (error) {
        return handleError(
            res,

            error,

            "Unable to create asset.",
        );
    }
};

// ============================================================================
// GET ALL ASSETS
// GET /api/assets
// ============================================================================

export const getAllAssets = async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,

                message: "Authentication required.",
            });
        }

        const result = await assetService.getAllAssets(
            userId,

            req.query,
        );

        return res.status(200).json({
            success: true,

            count: result.assets.length,

            data: result.assets,

            pagination: result.pagination,
        });
    } catch (error) {
        return handleError(
            res,

            error,

            "Unable to load assets.",
        );
    }
};

// ============================================================================
// GET SINGLE ASSET
// GET /api/assets/:id
// ============================================================================

export const getAssetById = async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,

                message: "Authentication required.",
            });
        }

        const asset = await assetService.getAssetById(
            userId,

            req.params.id,
        );

        return res.status(200).json({
            success: true,

            data: asset,
        });
    } catch (error) {
        return handleError(
            res,

            error,

            "Unable to load asset.",
        );
    }
};

// ============================================================================
// UPDATE ASSET
// PUT /api/assets/:id
// ============================================================================

export const updateAsset = async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,

                message: "Authentication required.",
            });
        }

        const asset = await assetService.updateAsset(
            userId,

            req.params.id,

            req.body,
        );

        return res.status(200).json({
            success: true,

            message: "Asset updated successfully.",

            data: asset,
        });
    } catch (error) {
        return handleError(
            res,

            error,

            "Unable to update asset.",
        );
    }
};

// ============================================================================
// DELETE ASSET
// DELETE /api/assets/:id
// ============================================================================
//
// Only actual owner can delete.
//
// ============================================================================

export const deleteAsset = async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,

                message: "Authentication required.",
            });
        }

        const result = await assetService.deleteAsset(
            userId,

            req.params.id,
        );

        return res.status(200).json({
            success: true,

            message: result.message,

            data: {
                deletedAssetId: result.deletedAssetId,
            },
        });
    } catch (error) {
        return handleError(
            res,

            error,

            "Unable to delete asset.",
        );
    }
};

// ============================================================================
// SHARE ASSET
// POST /api/assets/:id/share
// ============================================================================

export const shareAsset = async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,

                message: "Authentication required.",
            });
        }

        const asset = await assetService.shareAsset(
            userId,

            req.params.id,

            req.body,
        );

        return res.status(200).json({
            success: true,

            message: "Asset shared successfully.",

            data: asset,
        });
    } catch (error) {
        return handleError(
            res,

            error,

            "Unable to share asset.",
        );
    }
};

// ============================================================================
// UNSHARE ASSET
// DELETE /api/assets/:id/share
// ============================================================================

export const unshareAsset = async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,

                message: "Authentication required.",
            });
        }

        const asset = await assetService.unshareAsset(
            userId,

            req.params.id,

            req.body || {},
        );

        return res.status(200).json({
            success: true,

            message: "Asset sharing updated successfully.",

            data: asset,
        });
    } catch (error) {
        return handleError(
            res,

            error,

            "Unable to update asset sharing.",
        );
    }
};

// ============================================================================
// UPDATE SHARING PERMISSION
// PATCH /api/assets/:id/share/:memberId
// ============================================================================

export const updateAssetSharingPermission = async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,

                message: "Authentication required.",
            });
        }

        const asset = await assetService.updateAssetSharingPermission(
            userId,

            req.params.id,

            req.params.memberId,

            req.body?.access,
        );

        return res.status(200).json({
            success: true,

            message: "Asset sharing permission updated successfully.",

            data: asset,
        });
    } catch (error) {
        return handleError(
            res,

            error,

            "Unable to update asset sharing permission.",
        );
    }
};

// ============================================================================
// REMOVE MEMBER ACCESS
// DELETE /api/assets/:id/share/:memberId
// ============================================================================

export const removeAssetMemberAccess = async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,

                message: "Authentication required.",
            });
        }

        const asset = await assetService.removeAssetMemberAccess(
            userId,

            req.params.id,

            req.params.memberId,
        );

        return res.status(200).json({
            success: true,

            message: "Family member access removed successfully.",

            data: asset,
        });
    } catch (error) {
        return handleError(
            res,

            error,

            "Unable to remove family member access.",
        );
    }
};

// ============================================================================
// GET ASSET ACCESS DETAILS
// GET /api/assets/:id/access
// ============================================================================

export const getAssetAccessDetails = async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,

                message: "Authentication required.",
            });
        }

        const access = await assetService.getAssetAccessDetails(
            userId,

            req.params.id,
        );

        return res.status(200).json({
            success: true,

            data: access,
        });
    } catch (error) {
        return handleError(
            res,

            error,

            "Unable to load asset access details.",
        );
    }
};

// ============================================================================
// GET ASSET STATISTICS
// GET /api/assets/stats
// ============================================================================

export const getAssetStats = async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,

                message: "Authentication required.",
            });
        }

        const stats = await assetService.getAssetStats(userId);

        return res.status(200).json({
            success: true,

            data: stats,
        });
    } catch (error) {
        return handleError(
            res,

            error,

            "Unable to load asset statistics.",
        );
    }
};

// ============================================================================
// UPCOMING WARRANTY ASSETS
// GET /api/assets/warranty/upcoming
// ============================================================================

export const getUpcomingWarrantyAssets = async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,

                message: "Authentication required.",
            });
        }

        const assets = await assetService.getUpcomingWarrantyAssets(
            userId,

            req.query.days,
        );

        return res.status(200).json({
            success: true,

            count: assets.length,

            data: assets,
        });
    } catch (error) {
        return handleError(
            res,

            error,

            "Unable to load upcoming warranty assets.",
        );
    }
};

// ============================================================================
// FAMILY SHARED ASSETS
// GET /api/assets/family/shared
// ============================================================================

export const getFamilySharedAssets = async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,

                message: "Authentication required.",
            });
        }

        const assets = await assetService.getFamilySharedAssets(userId);

        return res.status(200).json({
            success: true,

            count: assets.length,

            data: assets,
        });
    } catch (error) {
        return handleError(
            res,

            error,

            "Unable to load family shared assets.",
        );
    }
};

// ============================================================================
// UPDATE EXPIRED ASSETS
// POST /api/assets/system/update-expired
// ============================================================================

export const updateExpiredAssets = async (req, res) => {
    try {
        const result = await assetService.updateExpiredAssets();

        return res.status(200).json({
            success: true,

            message: "Expired assets updated successfully.",

            data: result,
        });
    } catch (error) {
        return handleError(
            res,

            error,

            "Unable to update expired assets.",
        );
    }
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
    createAsset,

    getAllAssets,

    getAssetById,

    updateAsset,

    deleteAsset,

    shareAsset,

    unshareAsset,

    updateAssetSharingPermission,

    removeAssetMemberAccess,

    getAssetAccessDetails,

    getAssetStats,

    getUpcomingWarrantyAssets,

    getFamilySharedAssets,

    updateExpiredAssets,
};
