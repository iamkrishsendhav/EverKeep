import express from "express";

import {
    getAllSubscriptions,
    getSingleSubscription,
    createNewSubscription,
    getUpcomingSubscriptionRenewals,
    getOverdueSubscriptionList,
    getSubscriptionSummary,
    updateExistingSubscription,
    removeSubscription,

    shareSubscriptionWithFamily,
    unshareSubscriptionFromFamily,
    updateSubscriptionMemberPermission,
    removeSubscriptionMember,
    getFamilySharedSubscriptionList,

} from "../controllers/subscription.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";


// ============================================================================
// ROUTER
// ============================================================================

const router = express.Router();


// ============================================================================
// PROTECTED SUBSCRIPTION ROUTES
// ============================================================================
//
// All subscription endpoints require authentication.
//
// Authorization:
//     Bearer <JWT>
//
// ============================================================================


// ============================================================================
// CREATE
// POST /api/subscriptions
// ============================================================================

router.post(
    "/",
    authMiddleware,
    createNewSubscription
);


// ============================================================================
// GET ALL
// GET /api/subscriptions
// ============================================================================

router.get(
    "/",
    authMiddleware,
    getAllSubscriptions
);


// ============================================================================
// STATS
// GET /api/subscriptions/stats
// ============================================================================
//
// IMPORTANT:
// Keep this before /:id.
//
// ============================================================================

router.get(
    "/stats",
    authMiddleware,
    getSubscriptionSummary
);


// ============================================================================
// UPCOMING
// GET /api/subscriptions/upcoming
// ============================================================================
//
// Example:
//
// /api/subscriptions/upcoming?days=30
//
// ============================================================================

router.get(
    "/upcoming",
    authMiddleware,
    getUpcomingSubscriptionRenewals
);


// ============================================================================
// OVERDUE
// GET /api/subscriptions/overdue
// ============================================================================

router.get(
    "/overdue",
    authMiddleware,
    getOverdueSubscriptionList
);


// ============================================================================
// FAMILY SHARED SUBSCRIPTIONS
// GET /api/subscriptions/family/shared
// ============================================================================

router.get(
    "/family/shared",
    authMiddleware,
    getFamilySharedSubscriptionList
);


// ============================================================================
// SHARE SUBSCRIPTION
// POST /api/subscriptions/:id/share
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
// "access": "Edit"
//
// ============================================================================

router.post(
    "/:id/share",
    authMiddleware,
    shareSubscriptionWithFamily
);


// ============================================================================
// UNSHARE SUBSCRIPTION
// DELETE /api/subscriptions/:id/share
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
//     Remove all sharing.
//
// ============================================================================

router.delete(
    "/:id/share",
    authMiddleware,
    unshareSubscriptionFromFamily
);


// ============================================================================
// UPDATE MEMBER PERMISSION
// PATCH /api/subscriptions/:id/share/:memberId
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

router.patch(
    "/:id/share/:memberId",
    authMiddleware,
    updateSubscriptionMemberPermission
);


// ============================================================================
// REMOVE MEMBER ACCESS
// DELETE /api/subscriptions/:id/share/:memberId
// ============================================================================

router.delete(
    "/:id/share/:memberId",
    authMiddleware,
    removeSubscriptionMember
);


// ============================================================================
// GET SINGLE SUBSCRIPTION
// GET /api/subscriptions/:id
// ============================================================================
//
// IMPORTANT:
// This MUST come after all static routes.
//
// ============================================================================

router.get(
    "/:id",
    authMiddleware,
    getSingleSubscription
);


// ============================================================================
// UPDATE
// PUT /api/subscriptions/:id
// ============================================================================

router.put(
    "/:id",
    authMiddleware,
    updateExistingSubscription
);


// ============================================================================
// DELETE
// DELETE /api/subscriptions/:id
// ============================================================================

router.delete(
    "/:id",
    authMiddleware,
    removeSubscription
);


// ============================================================================
// EXPORT
// ============================================================================

export default router;