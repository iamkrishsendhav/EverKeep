import {
    createCalendarEvent,
    getCalendarEvents,
    getCalendarEventById,
    updateCalendarEvent,
    deleteCalendarEvent,
    completeCalendarEvent,
} from "../services/calendarService.js";


// ============================================================
// CREATE EVENT
// POST /api/calendar
// ============================================================

export const createEvent = async (req, res) => {
    try {

        const event =
            await createCalendarEvent(
                req.body
            );

        return res.status(201).json({
            success: true,
            message:
                "Calendar event created successfully.",
            data: event,
        });

    } catch (error) {

        console.error(
            "Create calendar event error:",
            error
        );

        return res.status(
            error.statusCode || 500
        ).json({
            success: false,
            message:
                error.message ||
                "Failed to create calendar event.",
        });
    }
};


// ============================================================
// GET ALL EVENTS
// GET /api/calendar
// ============================================================

export const getEvents = async (req, res) => {
    try {

        const {
            start,
            end,
            type,
            status,
            asset,
        } = req.query;


        const events =
            await getCalendarEvents({
                start,
                end,
                type,
                status,
                asset,
            });


        return res.status(200).json({
            success: true,
            count: events.length,
            data: events,
        });

    } catch (error) {

        console.error(
            "Get calendar events error:",
            error
        );

        return res.status(
            error.statusCode || 500
        ).json({
            success: false,
            message:
                error.message ||
                "Failed to fetch calendar events.",
        });
    }
};


// ============================================================
// GET SINGLE EVENT
// GET /api/calendar/:id
// ============================================================

export const getEvent = async (req, res) => {
    try {

        const event =
            await getCalendarEventById(
                req.params.id
            );


        return res.status(200).json({
            success: true,
            data: event,
        });

    } catch (error) {

        console.error(
            "Get calendar event error:",
            error
        );

        return res.status(
            error.statusCode || 500
        ).json({
            success: false,
            message:
                error.message ||
                "Failed to fetch calendar event.",
        });
    }
};


// ============================================================
// UPDATE EVENT
// PUT /api/calendar/:id
// ============================================================

export const updateEvent = async (req, res) => {
    try {

        const event =
            await updateCalendarEvent(
                req.params.id,
                req.body
            );


        return res.status(200).json({
            success: true,
            message:
                "Calendar event updated successfully.",
            data: event,
        });

    } catch (error) {

        console.error(
            "Update calendar event error:",
            error
        );

        return res.status(
            error.statusCode || 500
        ).json({
            success: false,
            message:
                error.message ||
                "Failed to update calendar event.",
        });
    }
};


// ============================================================
// DELETE EVENT
// DELETE /api/calendar/:id
// ============================================================

export const deleteEvent = async (req, res) => {
    try {

        const result =
            await deleteCalendarEvent(
                req.params.id
            );


        return res.status(200).json({
            success: true,
            message:
                result.message ||
                "Calendar event deleted successfully.",
        });

    } catch (error) {

        console.error(
            "Delete calendar event error:",
            error
        );

        return res.status(
            error.statusCode || 500
        ).json({
            success: false,
            message:
                error.message ||
                "Failed to delete calendar event.",
        });
    }
};


// ============================================================
// COMPLETE EVENT
// PATCH /api/calendar/:id/complete
// ============================================================

export const completeEvent = async (req, res) => {
    try {

        const event =
            await completeCalendarEvent(
                req.params.id
            );


        return res.status(200).json({
            success: true,
            message:
                "Calendar event marked as completed.",
            data: event,
        });

    } catch (error) {

        console.error(
            "Complete calendar event error:",
            error
        );

        return res.status(
            error.statusCode || 500
        ).json({
            success: false,
            message:
                error.message ||
                "Failed to complete calendar event.",
        });
    }
};