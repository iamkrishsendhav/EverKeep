import express from "express";

import {
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
} from "../controllers/warranty.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";


const router = express.Router();


// ============================================================================
// PROTECTED WARRANTY ROUTES
// ============================================================================
//
// All warranty endpoints require authentication.
//
// Authorization:
//
// Authorization: Bearer <JWT>
//
// ============================================================================


// ============================================================================
// CREATE WARRANTY
// POST /api/warranties
// ============================================================================

router.post(
    "/",
    authMiddleware,
    createNewWarranty
);


// ============================================================================
// GET ALL WARRANTIES
// GET /api/warranties
//
// Optional:
//
// ?search=iphone
// ?expiry=active
// ?expiry=expired
// ?page=1
// ?limit=20
//
// ============================================================================

router.get(
    "/",
    authMiddleware,
    getAllWarranties
);


// ============================================================================
// WARRANTY STATISTICS
// GET /api/warranties/stats
//
// IMPORTANT:
// Must appear before /:id.
//
// ============================================================================

router.get(
    "/stats",
    authMiddleware,
    getWarrantySummary
);


// ============================================================================
// UPCOMING WARRANTIES
// GET /api/warranties/upcoming
//
// Example:
//
// /api/warranties/upcoming?days=30
//
// ============================================================================

router.get(
    "/upcoming",
    authMiddleware,
    getUpcomingWarrantyList
);


// ============================================================================
// EXPIRED WARRANTIES
// GET /api/warranties/expired
// ============================================================================

router.get(
    "/expired",
    authMiddleware,
    getExpiredWarrantyList
);


// ============================================================================
// FAMILY SHARED WARRANTIES
// GET /api/warranties/family/shared
// ============================================================================

router.get(
    "/family/shared",
    authMiddleware,
    getFamilySharedWarrantyList
);


// ============================================================================
// SHARE WARRANTY
// POST /api/warranties/:id/share
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

router.post(
    "/:id/share",
    authMiddleware,
    shareWarrantyWithFamily
);


// ============================================================================
// UNSHARE WARRANTY
// DELETE /api/warranties/:id/share
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
//     Remove all sharing.
//
// ============================================================================

router.delete(
    "/:id/share",
    authMiddleware,
    unshareWarrantyFromFamily
);


// ============================================================================
// WARRANTY ACCESS DETAILS
// GET /api/warranties/:id/access
// ============================================================================

router.get(
    "/:id/access",
    authMiddleware,
    getWarrantyAccess
);


// ============================================================================
// UPDATE FAMILY MEMBER PERMISSION
// PATCH /api/warranties/:id/share/:memberId
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

router.patch(
    "/:id/share/:memberId",
    authMiddleware,
    updateWarrantyMemberPermission
);


// ============================================================================
// REMOVE FAMILY MEMBER ACCESS
// DELETE /api/warranties/:id/share/:memberId
// ============================================================================

router.delete(
    "/:id/share/:memberId",
    authMiddleware,
    removeWarrantyMember
);


// ============================================================================
// GET SINGLE WARRANTY
// GET /api/warranties/:id
//
// IMPORTANT:
// Keep this AFTER all static routes:
// - /stats
// - /upcoming
// - /expired
// - /family/shared
//
// ============================================================================

router.get(
    "/:id",
    authMiddleware,
    getSingleWarranty
);


// ============================================================================
// UPDATE WARRANTY
// PUT /api/warranties/:id
// ============================================================================

router.put(
    "/:id",
    authMiddleware,
    updateExistingWarranty
);


// ============================================================================
// DELETE WARRANTY
// DELETE /api/warranties/:id
// ============================================================================

router.delete(
    "/:id",
    authMiddleware,
    removeWarranty
);


// ============================================================================
// EXPORT
// ============================================================================

export default router;