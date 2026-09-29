import express from "express";

import {
    createAsset,
    getAllAssets,
    getAssetById,
    updateAsset,
    deleteAsset,
    shareAsset,
    unshareAsset,
    updateAssetSharingPermission,
    removeAssetMemberAccess,
    getAssetStats,
    getUpcomingWarrantyAssets,
    getFamilySharedAssets,
    updateExpiredAssets,
} from "../controllers/asset.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// ============================================================================
// PROTECTED ASSET ROUTES
// ============================================================================
//
// All routes require authentication.
//
// Authorization:
//     Bearer <JWT>
//
// ============================================================================

// ============================================================================
// ASSET COLLECTION
// ============================================================================
//
// GET  /api/assets
// POST /api/assets
//
// ============================================================================

router
    .route("/")
    .get(authMiddleware, getAllAssets)
    .post(authMiddleware, createAsset);

// ============================================================================
// ASSET STATISTICS
// ============================================================================
//
// GET /api/assets/stats
//
// IMPORTANT:
// This route MUST appear before /:id.
//
// ============================================================================

router.get("/stats", authMiddleware, getAssetStats);

// ============================================================================
// UPCOMING WARRANTY ASSETS
// ============================================================================
//
// GET /api/assets/warranty/upcoming
//
// Example:
//
// /api/assets/warranty/upcoming?days=30
//
// ============================================================================

router.get("/warranty/upcoming", authMiddleware, getUpcomingWarrantyAssets);

// ============================================================================
// FAMILY SHARED ASSETS
// ============================================================================
//
// GET /api/assets/family/shared
//
// ============================================================================

router.get("/family/shared", authMiddleware, getFamilySharedAssets);

// ============================================================================
// INTERNAL / MAINTENANCE
// ============================================================================
//
// POST /api/assets/system/update-expired
//
// NOTE:
// This endpoint should eventually be protected with a dedicated
// internal/admin authorization mechanism or moved to a cron job.
//
// ============================================================================

router.post("/system/update-expired", authMiddleware, updateExpiredAssets);

// ============================================================================
// ASSET SHARING
// ============================================================================
//
// POST   /api/assets/:id/share
// DELETE /api/assets/:id/share
//
// ============================================================================

router.post("/:id/share", authMiddleware, shareAsset);

router.delete("/:id/share", authMiddleware, unshareAsset);

// ============================================================================
// ASSET ACCESS INFORMATION
// ============================================================================
//
// GET /api/assets/:id/access
//
// ============================================================================

//router.get("/:id/access", authMiddleware, getAssetAccessDetails);

// ============================================================================
// INDIVIDUAL MEMBER ACCESS
// ============================================================================
//
// PATCH  /api/assets/:id/share/:memberId
// DELETE /api/assets/:id/share/:memberId
//
// ============================================================================

router.patch(
    "/:id/share/:memberId",
    authMiddleware,
    updateAssetSharingPermission,
);

router.delete("/:id/share/:memberId", authMiddleware, removeAssetMemberAccess);

// ============================================================================
// SINGLE ASSET
// ============================================================================
//
// GET    /api/assets/:id
// PUT    /api/assets/:id
// DELETE /api/assets/:id
//
// IMPORTANT:
// Keep this AFTER all static routes such as:
//
// /stats
// /warranty/upcoming
// /family/shared
// /system/update-expired
//
// Otherwise Express may interpret "stats" or "family" as an asset ID.
//
// ============================================================================

router
    .route("/:id")
    .get(authMiddleware, getAssetById)
    .put(authMiddleware, updateAsset)
    .delete(authMiddleware, deleteAsset);

// ============================================================================
// EXPORT
// ============================================================================

export default router;
