import api from "../lib/axios";


// ============================================================================
// CALENDAR SERVICE
// ============================================================================
//
// All Calendar API requests live here.
//
// Components / hooks should never call axios directly.
//
// Expected backend endpoints:
//
// GET     /calendar
// GET     /calendar/:id
// POST    /calendar
// PUT     /calendar/:id
// DELETE  /calendar/:id
//
// ============================================================================


// ============================================================================
// GET ALL EVENTS
// ============================================================================

export const getEvents = async () => {

    const response =
        await api.get(
            "/calendar"
        );


    return response.data;
};


// ============================================================================
// GET SINGLE EVENT
// ============================================================================

export const getEvent = async (
    id
) => {

    if (!id) {

        throw new Error(
            "Event ID is required."
        );

    }


    const response =
        await api.get(
            `/calendar/${id}`
        );


    return response.data;
};


// ============================================================================
// CREATE EVENT
// ============================================================================

export const createEvent = async (
    eventData
) => {

    if (!eventData) {

        throw new Error(
            "Event data is required."
        );

    }


    const response =
        await api.post(
            "/calendar",
            eventData
        );


    return response.data;
};


// ============================================================================
// UPDATE EVENT
// ============================================================================

export const updateEvent = async (
    id,
    eventData
) => {

    if (!id) {

        throw new Error(
            "Event ID is required."
        );

    }


    if (!eventData) {

        throw new Error(
            "Event data is required."
        );

    }


    const response =
        await api.put(
            `/calendar/${id}`,
            eventData
        );


    return response.data;
};


// ============================================================================
// DELETE EVENT
// ============================================================================

export const deleteEvent = async (
    id
) => {

    if (!id) {

        throw new Error(
            "Event ID is required."
        );

    }


    const response =
        await api.delete(
            `/calendar/${id}`
        );


    return response.data;
};


// ============================================================================
// COMPLETE EVENT
// ============================================================================
//
// We currently use the same UPDATE endpoint instead of creating a separate
// backend endpoint.
//
// The hook calls:
//
// updateEvent(id, { status: "completed" })
//
// So no extra API endpoint is required right now.
//
// ============================================================================

export const completeEvent = async (
    id
) => {

    if (!id) {

        throw new Error(
            "Event ID is required."
        );

    }


    const response =
        await api.put(
            `/calendar/${id}`,
            {
                status: "completed",
            }
        );


    return response.data;
};