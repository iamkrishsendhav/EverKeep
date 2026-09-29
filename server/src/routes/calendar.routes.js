import express from "express";

import {
    createEvent,
    getEvents,
    getUpcomingEvents,
    getFamilySharedEvents,
    getCalendarSummary,
    getEvent,
    getEventAccess,
    updateEvent,
    deleteEvent,
    completeEvent,
    shareEventWithFamily,
    unshareEventFromFamily,
    updateMemberPermission,
    removeMemberAccess,
} from "../controllers/calendar.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// ============================================================================
// PROTECTED CALENDAR ROUTES
// ============================================================================
//
// All calendar operations require authentication.
//
// Authorization:
//
// Authorization: Bearer <JWT>
//
// ============================================================================

// ============================================================================
// CALENDAR COLLECTION
// ============================================================================
//
// GET  /api/calendar
// POST /api/calendar
//
// ============================================================================

router
    .route("/")
    .get(authMiddleware, getEvents)
    .post(authMiddleware, createEvent);

// ============================================================================
// CALENDAR STATS
// GET /api/calendar/stats
// ============================================================================
//
// IMPORTANT:
// This route MUST appear before /:id.
//
// ============================================================================

router.get("/stats", authMiddleware, getCalendarSummary);

// ============================================================================
// UPCOMING EVENTS
// GET /api/calendar/upcoming
//
// Example:
//
// /api/calendar/upcoming?days=30
//
// ============================================================================

router.get("/upcoming", authMiddleware, getUpcomingEvents);

// ============================================================================
// FAMILY SHARED EVENTS
// GET /api/calendar/family/shared
// ============================================================================

router.get("/family/shared", authMiddleware, getFamilySharedEvents);

// ============================================================================
// SHARE EVENT
// POST /api/calendar/:id/share
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

router.post("/:id/share", authMiddleware, shareEventWithFamily);

// ============================================================================
// UNSHARE EVENT
// DELETE /api/calendar/:id/share
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

router.delete("/:id/share", authMiddleware, unshareEventFromFamily);

// ============================================================================
// EVENT ACCESS DETAILS
// GET /api/calendar/:id/access
// ============================================================================

router.get("/:id/access", authMiddleware, getEventAccess);

// ============================================================================
// UPDATE MEMBER PERMISSION
// PATCH /api/calendar/:id/share/:memberId
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

router.patch("/:id/share/:memberId", authMiddleware, updateMemberPermission);

// ============================================================================
// REMOVE MEMBER ACCESS
// DELETE /api/calendar/:id/share/:memberId
// ============================================================================

router.delete("/:id/share/:memberId", authMiddleware, removeMemberAccess);

// ============================================================================
// COMPLETE EVENT
// PATCH /api/calendar/:id/complete
// ============================================================================

router.patch("/:id/complete", authMiddleware, completeEvent);

// ============================================================================
// SINGLE CALENDAR EVENT
// ============================================================================
//
// GET    /api/calendar/:id
// PUT    /api/calendar/:id
// DELETE /api/calendar/:id
//
// IMPORTANT:
// This MUST remain after all static/special routes.
//
// ============================================================================

router
    .route("/:id")
    .get(authMiddleware, getEvent)
    .put(authMiddleware, updateEvent)
    .delete(authMiddleware, deleteEvent);

// ============================================================================
// EXPORT
// ============================================================================

export default router;
