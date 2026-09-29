import {
    createCalendarEvent,
    getCalendarEvents,
    getCalendarEventById,
    updateCalendarEvent,
    deleteCalendarEvent,
    completeCalendarEvent,
    getUpcomingCalendarEvents,
    getFamilySharedCalendarEvents,
    getCalendarStats,
    shareCalendarEvent,
    unshareCalendarEvent,
    updateCalendarMemberPermission,
    removeCalendarMember,
    getCalendarEventAccessDetails,
} from "../services/calendarService.js";

// ============================================================================
// CALENDAR CONTROLLER
// ============================================================================

// ============================================================================
// GET AUTHENTICATED USER ID
// ============================================================================

const getUserId = (req) => {
    return req.user?._id || req.user?.id || null;
};

// ============================================================================
// REQUIRE AUTHENTICATED USER
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
// COMMON ERROR HANDLER
// ============================================================================

const handleError = (res, error, fallbackMessage) => {
    console.error("Calendar controller error:", error);

    return res.status(error?.statusCode || 500).json({
        success: false,

        message: error?.message || fallbackMessage,
    });
};

// ============================================================================
// CREATE EVENT
// POST /api/calendar
// ============================================================================

export const createEvent = async (req, res) => {
    try {
        const event = await createCalendarEvent(req.body, requireUserId(req));

        return res.status(201).json({
            success: true,

            message: "Calendar event created successfully.",

            data: event,
        });
    } catch (error) {
        return handleError(res, error, "Failed to create calendar event.");
    }
};

// ============================================================================
// GET ALL EVENTS
// GET /api/calendar
// ============================================================================
//
// Query:
//
// ?start=2026-08-01
// ?end=2026-08-31
// ?type=warranty
// ?status=upcoming
// ?asset=ASSET_ID
// ?warranty=WARRANTY_ID
// ?subscription=SUBSCRIPTION_ID
//
// ============================================================================

export const getEvents = async (req, res) => {
    try {
        const { start, end, type, status, asset, warranty, subscription } =
            req.query;

        const events = await getCalendarEvents({
            userId: requireUserId(req),

            start,

            end,

            type,

            status,

            asset,

            warranty,

            subscription,
        });

        return res.status(200).json({
            success: true,

            count: events.length,

            data: events,
        });
    } catch (error) {
        return handleError(res, error, "Failed to fetch calendar events.");
    }
};

// ============================================================================
// GET UPCOMING EVENTS
// GET /api/calendar/upcoming
// ============================================================================
//
// Example:
//
// /api/calendar/upcoming?days=30
//
// ============================================================================

export const getUpcomingEvents = async (req, res) => {
    try {
        const days = req.query.days ?? 30;

        const events = await getUpcomingCalendarEvents(requireUserId(req), days);

        return res.status(200).json({
            success: true,

            count: events.length,

            data: events,
        });
    } catch (error) {
        return handleError(res, error, "Failed to fetch upcoming calendar events.");
    }
};

// ============================================================================
// GET FAMILY SHARED EVENTS
// GET /api/calendar/family/shared
// ============================================================================

export const getFamilySharedEvents = async (req, res) => {
    try {
        const events = await getFamilySharedCalendarEvents(requireUserId(req));

        return res.status(200).json({
            success: true,

            count: events.length,

            data: events,
        });
    } catch (error) {
        return handleError(
            res,
            error,
            "Failed to fetch family shared calendar events.",
        );
    }
};

// ============================================================================
// GET CALENDAR STATS
// GET /api/calendar/stats
// ============================================================================

export const getCalendarSummary = async (req, res) => {
    try {
        const stats = await getCalendarStats(requireUserId(req));

        return res.status(200).json({
            success: true,

            data: stats,
        });
    } catch (error) {
        return handleError(res, error, "Failed to fetch calendar statistics.");
    }
};

// ============================================================================
// GET SINGLE EVENT
// GET /api/calendar/:id
// ============================================================================

export const getEvent = async (req, res) => {
    try {
        const event = await getCalendarEventById(req.params.id, requireUserId(req));

        return res.status(200).json({
            success: true,

            data: event,
        });
    } catch (error) {
        return handleError(res, error, "Failed to fetch calendar event.");
    }
};

// ============================================================================
// GET EVENT ACCESS
// GET /api/calendar/:id/access
// ============================================================================

export const getEventAccess = async (req, res) => {
    try {
        const access = await getCalendarEventAccessDetails(
            req.params.id,
            requireUserId(req),
        );

        return res.status(200).json({
            success: true,

            data: access,
        });
    } catch (error) {
        return handleError(res, error, "Failed to fetch calendar event access.");
    }
};

// ============================================================================
// UPDATE EVENT
// PUT /api/calendar/:id
// ============================================================================

export const updateEvent = async (req, res) => {
    try {
        const event = await updateCalendarEvent(
            req.params.id,

            req.body,

            requireUserId(req),
        );

        return res.status(200).json({
            success: true,

            message: "Calendar event updated successfully.",

            data: event,
        });
    } catch (error) {
        return handleError(res, error, "Failed to update calendar event.");
    }
};

// ============================================================================
// DELETE EVENT
// DELETE /api/calendar/:id
// ============================================================================

export const deleteEvent = async (req, res) => {
    try {
        const result = await deleteCalendarEvent(
            req.params.id,

            requireUserId(req),
        );

        return res.status(200).json({
            success: true,

            message: result.message || "Calendar event deleted successfully.",
        });
    } catch (error) {
        return handleError(res, error, "Failed to delete calendar event.");
    }
};

// ============================================================================
// COMPLETE EVENT
// PATCH /api/calendar/:id/complete
// ============================================================================

export const completeEvent = async (req, res) => {
    try {
        const event = await completeCalendarEvent(
            req.params.id,

            requireUserId(req),
        );

        return res.status(200).json({
            success: true,

            message: "Calendar event marked as completed.",

            data: event,
        });
    } catch (error) {
        return handleError(res, error, "Failed to complete calendar event.");
    }
};

// ============================================================================
// SHARE EVENT WITH FAMILY
// POST /api/calendar/:id/share
// ============================================================================

export const shareEventWithFamily = async (req, res) => {
    try {
        const event = await shareCalendarEvent(
            req.params.id,

            requireUserId(req),

            req.body,
        );

        return res.status(200).json({
            success: true,

            message: "Calendar event shared successfully.",

            data: event,
        });
    } catch (error) {
        return handleError(res, error, "Failed to share calendar event.");
    }
};

// ============================================================================
// UNSHARE EVENT
// DELETE /api/calendar/:id/share
// ============================================================================

export const unshareEventFromFamily = async (req, res) => {
    try {
        const event = await unshareCalendarEvent(
            req.params.id,

            requireUserId(req),

            req.body || {},
        );

        return res.status(200).json({
            success: true,

            message: "Calendar event sharing updated successfully.",

            data: event,
        });
    } catch (error) {
        return handleError(res, error, "Failed to update calendar event sharing.");
    }
};

// ============================================================================
// UPDATE MEMBER PERMISSION
// PATCH /api/calendar/:id/share/:memberId
// ============================================================================

export const updateMemberPermission = async (req, res) => {
    try {
        const event = await updateCalendarMemberPermission(
            req.params.id,

            requireUserId(req),

            req.params.memberId,

            req.body?.access,
        );

        return res.status(200).json({
            success: true,

            message: "Calendar member permission updated successfully.",

            data: event,
        });
    } catch (error) {
        return handleError(
            res,
            error,
            "Failed to update calendar member permission.",
        );
    }
};

// ============================================================================
// REMOVE MEMBER ACCESS
// DELETE /api/calendar/:id/share/:memberId
// ============================================================================

export const removeMemberAccess = async (req, res) => {
    try {
        const event = await removeCalendarMember(
            req.params.id,

            requireUserId(req),

            req.params.memberId,
        );

        return res.status(200).json({
            success: true,

            message: "Calendar member access removed successfully.",

            data: event,
        });
    } catch (error) {
        return handleError(res, error, "Failed to remove calendar member access.");
    }
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
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
};
