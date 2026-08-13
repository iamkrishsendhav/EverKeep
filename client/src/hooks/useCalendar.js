import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent,
} from "../services/calendar.service";


// ============================================================================
// CALENDAR HOOK
// ============================================================================
//
// Central state manager for Calendar.
//
// Responsibilities:
// - Fetch
// - Create
// - Update
// - Delete
// - Complete
// - Local state synchronization
// - Loading / error management
//
// Components should NOT call calendar.service.js directly.
// ============================================================================

const useCalendar = () => {

    // =========================================================================
    // STATE
    // =========================================================================

    const [
        events,
        setEvents,
    ] = useState([]);


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        error,
        setError,
    ] = useState("");


    const [
        actionLoading,
        setActionLoading,
    ] = useState(false);


    // =========================================================================
    // NORMALIZE API RESPONSE
    // =========================================================================
    //
    // Different APIs sometimes return:
    //
    // { data: [...] }
    // { events: [...] }
    // [...]
    //
    // Keep the hook defensive.
    // =========================================================================

    const extractEvents = useCallback(
        (response) => {

            if (
                Array.isArray(
                    response
                )
            ) {
                return response;
            }


            if (
                Array.isArray(
                    response?.data
                )
            ) {
                return response.data;
            }


            if (
                Array.isArray(
                    response?.events
                )
            ) {
                return response.events;
            }


            if (
                Array.isArray(
                    response?.data?.events
                )
            ) {
                return response.data.events;
            }


            return [];

        },
        []
    );


    // =========================================================================
    // EXTRACT SINGLE EVENT
    // =========================================================================

    const extractEvent = useCallback(
        (response) => {

            if (
                response?.data &&
                !Array.isArray(
                    response.data
                )
            ) {
                return response.data;
            }


            if (
                response?.event
            ) {
                return response.event;
            }


            if (
                response?.data?.event
            ) {
                return response.data.event;
            }


            return response;

        },
        []
    );


    // =========================================================================
    // GET EVENT ID
    // =========================================================================

    const getEventId = useCallback(
        (event) => {

            return (
                event?._id ||
                event?.id ||
                null
            );

        },
        []
    );


    // =========================================================================
    // FETCH EVENTS
    // =========================================================================

    const fetchEvents = useCallback(
        async () => {

            try {

                setLoading(true);
                setError("");


                const response =
                    await getEvents();


                const fetchedEvents =
                    extractEvents(
                        response
                    );


                setEvents(
                    fetchedEvents
                );


                return fetchedEvents;

            } catch (err) {

                console.error(
                    "Failed to fetch calendar events:",
                    err
                );


                const message =
                    err?.response?.data?.message ||
                    err?.message ||
                    "Unable to load calendar events.";


                setError(
                    message
                );


                throw err;

            } finally {

                setLoading(false);

            }

        },
        [
            extractEvents,
        ]
    );


    // =========================================================================
    // CREATE EVENT
    // =========================================================================

    const addEvent = useCallback(
        async (eventData) => {

            try {

                setActionLoading(true);
                setError("");


                const response =
                    await createEvent(
                        eventData
                    );


                const createdEvent =
                    extractEvent(
                        response
                    );


                if (
                    createdEvent &&
                    (
                        createdEvent._id ||
                        createdEvent.id
                    )
                ) {

                    setEvents(
                        (previousEvents) => [

                            createdEvent,

                            ...previousEvents,

                        ]
                    );

                } else {

                    // ---------------------------------------------------------
                    // Defensive fallback
                    // ---------------------------------------------------------

                    await fetchEvents();

                }


                return createdEvent;

            } catch (err) {

                console.error(
                    "Failed to create calendar event:",
                    err
                );


                setError(
                    err?.response?.data?.message ||
                    err?.message ||
                    "Unable to create event."
                );


                throw err;

            } finally {

                setActionLoading(false);

            }

        },
        [
            extractEvent,
            fetchEvents,
        ]
    );


    // =========================================================================
    // UPDATE EVENT
    // =========================================================================

    const editEvent = useCallback(
        async (
            id,
            eventData
        ) => {

            if (!id) {

                throw new Error(
                    "Event ID is required to update an event."
                );

            }


            try {

                setActionLoading(true);
                setError("");


                const response =
                    await updateEvent(
                        id,
                        eventData
                    );


                const updatedEvent =
                    extractEvent(
                        response
                    );


                if (
                    updatedEvent &&
                    (
                        updatedEvent._id ||
                        updatedEvent.id
                    )
                ) {

                    const updatedId =
                        getEventId(
                            updatedEvent
                        );


                    setEvents(
                        (previousEvents) =>
                            previousEvents.map(
                                (event) => {

                                    const currentId =
                                        getEventId(
                                            event
                                        );


                                    return currentId ===
                                        (
                                            updatedId ||
                                            id
                                        )
                                        ? updatedEvent
                                        : event;

                                }
                            )
                    );

                } else {

                    // ---------------------------------------------------------
                    // Defensive fallback
                    // ---------------------------------------------------------

                    await fetchEvents();

                }


                return updatedEvent;

            } catch (err) {

                console.error(
                    "Failed to update calendar event:",
                    err
                );


                setError(
                    err?.response?.data?.message ||
                    err?.message ||
                    "Unable to update event."
                );


                throw err;

            } finally {

                setActionLoading(false);

            }

        },
        [
            extractEvent,
            getEventId,
            fetchEvents,
        ]
    );


    // =========================================================================
    // DELETE EVENT
    // =========================================================================

    const removeEvent = useCallback(
        async (id) => {

            if (!id) {

                throw new Error(
                    "Event ID is required to delete an event."
                );

            }


            try {

                setActionLoading(true);
                setError("");


                await deleteEvent(
                    id
                );


                // -------------------------------------------------------------
                // Optimistic local removal AFTER successful API response
                // -------------------------------------------------------------

                setEvents(
                    (previousEvents) =>
                        previousEvents.filter(
                            (event) =>
                                getEventId(
                                    event
                                ) !== id
                        )
                );


                return true;

            } catch (err) {

                console.error(
                    "Failed to delete calendar event:",
                    err
                );


                setError(
                    err?.response?.data?.message ||
                    err?.message ||
                    "Unable to delete event."
                );


                throw err;

            } finally {

                setActionLoading(false);

            }

        },
        [
            getEventId,
        ]
    );


    // =========================================================================
    // COMPLETE EVENT
    // =========================================================================
    //
    // If the backend exposes a dedicated complete endpoint, you can later
    // replace this implementation with it.
    //
    // For now, completion uses the existing updateEvent API.
    // =========================================================================

    const completeEvent = useCallback(
        async (id) => {

            if (!id) {

                throw new Error(
                    "Event ID is required to complete an event."
                );

            }


            try {

                setActionLoading(true);
                setError("");


                const response =
                    await updateEvent(
                        id,
                        {
                            status: "completed",
                        }
                    );


                const updatedEvent =
                    extractEvent(
                        response
                    );


                if (
                    updatedEvent &&
                    (
                        updatedEvent._id ||
                        updatedEvent.id
                    )
                ) {

                    const updatedId =
                        getEventId(
                            updatedEvent
                        );


                    setEvents(
                        (previousEvents) =>
                            previousEvents.map(
                                (event) => {

                                    const currentId =
                                        getEventId(
                                            event
                                        );


                                    return currentId ===
                                        (
                                            updatedId ||
                                            id
                                        )
                                        ? updatedEvent
                                        : event;

                                }
                            )
                    );

                } else {

                    await fetchEvents();

                }


                return updatedEvent;

            } catch (err) {

                console.error(
                    "Failed to complete calendar event:",
                    err
                );


                setError(
                    err?.response?.data?.message ||
                    err?.message ||
                    "Unable to complete event."
                );


                throw err;

            } finally {

                setActionLoading(false);

            }

        },
        [
            extractEvent,
            getEventId,
            fetchEvents,
        ]
    );


    // =========================================================================
    // CLEAR ERROR
    // =========================================================================

    const clearError = useCallback(
        () => {

            setError("");

        },
        []
    );


    // =========================================================================
    // INITIAL FETCH
    // =========================================================================

    useEffect(() => {

        fetchEvents();

    }, [
        fetchEvents,
    ]);


    // =========================================================================
    // PUBLIC API
    // =========================================================================

    return {

        // Data
        events,

        // States
        loading,
        error,
        actionLoading,

        // Fetch
        fetchEvents,

        // CRUD
        addEvent,
        editEvent,
        removeEvent,

        // Status
        completeEvent,

        // Utilities
        clearError,
    };
};


export default useCalendar;