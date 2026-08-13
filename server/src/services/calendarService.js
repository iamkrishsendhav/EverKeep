import CalendarEvent from "../models/CalendarEvent.js";


// ============================================================
// CREATE EVENT
// ============================================================

export const createCalendarEvent = async (eventData) => {
    const event = await CalendarEvent.create(
        eventData
    );

    return event.populate("asset");
};


// ============================================================
// GET ALL EVENTS
// ============================================================

export const getCalendarEvents = async ({
    start,
    end,
    type,
    status,
    asset,
} = {}) => {

    const query = {};

    // ----------------------------------------------------------
    // DATE RANGE
    // ----------------------------------------------------------

    if (start || end) {
        query.startDate = {};

        if (start) {
            query.startDate.$gte = new Date(start);
        }

        if (end) {
            query.startDate.$lte = new Date(end);
        }
    }


    // ----------------------------------------------------------
    // TYPE
    // ----------------------------------------------------------

    if (type) {
        query.type = type;
    }


    // ----------------------------------------------------------
    // STATUS
    // ----------------------------------------------------------

    if (status) {
        query.status = status;
    }


    // ----------------------------------------------------------
    // ASSET
    // ----------------------------------------------------------

    if (asset) {
        query.asset = asset;
    }


    const events = await CalendarEvent.find(query)
        .populate("asset")
        .sort({
            startDate: 1,
            createdAt: -1,
        });


    return events;
};


// ============================================================
// GET SINGLE EVENT
// ============================================================

export const getCalendarEventById = async (
    id
) => {

    const event =
        await CalendarEvent.findById(id)
            .populate("asset");


    if (!event) {
        const error = new Error(
            "Calendar event not found."
        );

        error.statusCode = 404;

        throw error;
    }


    return event;
};


// ============================================================
// UPDATE EVENT
// ============================================================

export const updateCalendarEvent = async (
    id,
    eventData
) => {

    const event =
        await CalendarEvent.findById(id);


    if (!event) {
        const error = new Error(
            "Calendar event not found."
        );

        error.statusCode = 404;

        throw error;
    }


    // ----------------------------------------------------------
    // UPDATE ONLY PROVIDED FIELDS
    // ----------------------------------------------------------

    Object.keys(eventData).forEach(
        (key) => {

            if (
                eventData[key] !== undefined
            ) {
                event[key] =
                    eventData[key];
            }

        }
    );


    await event.save();


    return event.populate("asset");
};


// ============================================================
// DELETE EVENT
// ============================================================

export const deleteCalendarEvent = async (
    id
) => {

    const event =
        await CalendarEvent.findById(id);


    if (!event) {
        const error = new Error(
            "Calendar event not found."
        );

        error.statusCode = 404;

        throw error;
    }


    await event.deleteOne();


    return {
        success: true,
        message:
            "Calendar event deleted successfully.",
    };
};


// ============================================================
// COMPLETE EVENT
// ============================================================

export const completeCalendarEvent = async (
    id
) => {

    const event =
        await CalendarEvent.findById(id);


    if (!event) {
        const error = new Error(
            "Calendar event not found."
        );

        error.statusCode = 404;

        throw error;
    }


    event.status = "completed";

    await event.save();


    return event.populate("asset");
};