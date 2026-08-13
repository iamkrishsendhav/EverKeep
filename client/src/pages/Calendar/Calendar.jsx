import {
    AlertCircle,
    CalendarDays,
    RefreshCw,
} from "lucide-react";

import {
    useMemo,
    useState,
} from "react";

import CalendarHeader from "../../components/calendar/CalendarHeader";
import CalendarToolbar from "../../components/calendar/CalendarToolbar";
import CalendarGrid from "../../components/calendar/CalendarGrid";
import CalendarEmptyState from "../../components/calendar/CalendarEmptyState";
import UpcomingEvents from "../../components/calendar/UpcomingEvents";

import AddEventModal from "../../components/calendar/AddEventModal";
import EditEventModal from "../../components/calendar/EditEventModal";
import DeleteEventModal from "../../components/calendar/DeleteEventModal";
import CalendarEventModal from "../../components/calendar/CalendarEventModal";

import useCalendar from "../../hooks/useCalendar";


// ============================================================================
// LOADING STATE
// ============================================================================

const CalendarLoading = () => {

    return (

        <div
            className="
                rounded-[1.5rem]
                border
                border-slate-200
                bg-white
                p-6
                shadow-[0_12px_40px_rgba(15,23,42,0.05)]
            "
        >

            <div className="space-y-4">

                <div className="grid grid-cols-7 gap-px">

                    {Array.from({
                        length: 42,
                    }).map((_, index) => (

                        <div
                            key={index}
                            className="
                                min-h-[125px]
                                animate-pulse
                                bg-slate-50
                                p-3
                            "
                        >

                            <div
                                className="
                                    h-6
                                    w-6
                                    rounded-lg
                                    bg-slate-200
                                "
                            />

                            <div
                                className="
                                    mt-6
                                    h-2
                                    w-16
                                    rounded-full
                                    bg-slate-200
                                "
                            />

                            <div
                                className="
                                    mt-2
                                    h-2
                                    w-24
                                    rounded-full
                                    bg-slate-100
                                "
                            />

                        </div>

                    ))}

                </div>

            </div>

        </div>
    );
};


// ============================================================================
// ERROR STATE
// ============================================================================

const CalendarError = ({
    message,
    onRetry,
}) => {

    return (

        <div
            className="
                flex
                min-h-[320px]
                items-center
                justify-center
                rounded-[1.5rem]
                border
                border-rose-200
                bg-white
                p-6
                shadow-[0_12px_40px_rgba(15,23,42,0.05)]
            "
        >

            <div
                className="
                    flex
                    max-w-md
                    flex-col
                    items-center
                    text-center
                "
            >

                <div
                    className="
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        rounded-2xl
                        bg-rose-50
                        text-rose-600
                    "
                >

                    <AlertCircle
                        size={25}
                    />

                </div>


                <h2
                    className="
                        mt-4
                        text-lg
                        font-bold
                        text-slate-900
                    "
                >
                    Unable to load calendar
                </h2>


                <p
                    className="
                        mt-2
                        text-sm
                        leading-6
                        text-slate-500
                    "
                >
                    {message ||
                        "Something went wrong while loading your events."}
                </p>


                <button
                    type="button"
                    onClick={onRetry}
                    className="
                        mt-5
                        inline-flex
                        h-10
                        items-center
                        gap-2
                        rounded-xl
                        bg-[#5B4BFF]
                        px-4
                        text-sm
                        font-semibold
                        text-white
                        transition
                        hover:bg-indigo-600
                        focus:outline-none
                        focus:ring-4
                        focus:ring-indigo-100
                    "
                >

                    <RefreshCw
                        size={15}
                    />

                    Try again

                </button>

            </div>

        </div>
    );
};


// ============================================================================
// CALENDAR PAGE
// ============================================================================

const Calendar = () => {

    // =========================================================================
    // CALENDAR DATA
    // =========================================================================

    const {
        events = [],
        loading,
        error,
        fetchEvents,
        addEvent,
        editEvent,
        removeEvent,
        completeEvent,
        actionLoading,
    } = useCalendar();


    // =========================================================================
    // MONTH
    // =========================================================================

    const [
        currentMonth,
        setCurrentMonth,
    ] = useState(
        new Date()
    );


    // =========================================================================
    // VIEW
    // =========================================================================

    const [
        view,
        setView,
    ] = useState("month");


    // =========================================================================
    // FILTERS
    // =========================================================================

    const [
        typeFilter,
        setTypeFilter,
    ] = useState("all");


    const [
        statusFilter,
        setStatusFilter,
    ] = useState("all");


    const [
        priorityFilter,
        setPriorityFilter,
    ] = useState("all");


    // =========================================================================
    // SELECTED DAY
    // =========================================================================

    const [
        selectedDate,
        setSelectedDate,
    ] = useState(null);


    // =========================================================================
    // SELECTED EVENT
    // =========================================================================

    const [
        selectedEvent,
        setSelectedEvent,
    ] = useState(null);


    // =========================================================================
    // EDITING EVENT
    // =========================================================================

    const [
        editingEvent,
        setEditingEvent,
    ] = useState(null);


    // =========================================================================
    // DELETING EVENT
    // =========================================================================

    const [
        deletingEvent,
        setDeletingEvent,
    ] = useState(null);


    // =========================================================================
    // ADD EVENT MODAL
    // =========================================================================

    const [
        showAddModal,
        setShowAddModal,
    ] = useState(false);


    // =========================================================================
    // COMPLETING EVENT
    // =========================================================================

    const [
        completingEventId,
        setCompletingEventId,
    ] = useState(null);


    // =========================================================================
    // FILTERED EVENTS
    // =========================================================================

    const filteredEvents = useMemo(() => {

        return events.filter(
            (event) => {

                // -------------------------------------------------------------
                // TYPE
                // -------------------------------------------------------------

                if (
                    typeFilter !== "all" &&
                    event.type !== typeFilter
                ) {
                    return false;
                }


                // -------------------------------------------------------------
                // PRIORITY
                // -------------------------------------------------------------

                if (
                    priorityFilter !== "all" &&
                    event.priority !==
                        priorityFilter
                ) {
                    return false;
                }


                // -------------------------------------------------------------
                // STATUS
                // -------------------------------------------------------------

                if (
                    statusFilter !== "all"
                ) {

                    const status =
                        getLocalEventStatus(
                            event
                        );

                    if (
                        status !==
                        statusFilter
                    ) {
                        return false;
                    }
                }


                return true;
            }
        );

    }, [
        events,
        typeFilter,
        statusFilter,
        priorityFilter,
    ]);


    // =========================================================================
    // HAS FILTERS
    // =========================================================================

    const hasActiveFilters =
        typeFilter !== "all" ||
        statusFilter !== "all" ||
        priorityFilter !== "all";


    // =========================================================================
    // MONTH NAVIGATION
    // =========================================================================

    const handlePreviousMonth = () => {

        setCurrentMonth(
            (current) => {

                const next =
                    new Date(
                        current
                    );

                next.setMonth(
                    next.getMonth() - 1
                );

                return next;
            }
        );

    };


    const handleNextMonth = () => {

        setCurrentMonth(
            (current) => {

                const next =
                    new Date(
                        current
                    );

                next.setMonth(
                    next.getMonth() + 1
                );

                return next;
            }
        );

    };


    const handleToday = () => {

        setCurrentMonth(
            new Date()
        );

        setSelectedDate(
            new Date()
        );

    };


    // =========================================================================
    // ADD EVENT
    // =========================================================================

    const handleAddEvent = async (
        formData
    ) => {

        await addEvent(
            formData
        );

        setShowAddModal(
            false
        );

    };


    // =========================================================================
    // EDIT EVENT
    // =========================================================================

    const handleEditEvent = async (
        formData
    ) => {

        if (!editingEvent) {
            return;
        }


        await editEvent(
            editingEvent._id ||
            editingEvent.id,
            formData
        );


        setEditingEvent(
            null
        );

    };


    // =========================================================================
    // DELETE EVENT
    // =========================================================================

    const handleDeleteEvent = async () => {

        if (!deletingEvent) {
            return;
        }


        await removeEvent(
            deletingEvent._id ||
            deletingEvent.id
        );


        setDeletingEvent(
            null
        );

    };


    // =========================================================================
    // COMPLETE EVENT
    // =========================================================================

    const handleCompleteEvent = async (
        event
    ) => {

        const id =
            event?._id ||
            event?.id;


        if (!id) {
            return;
        }


        try {

            setCompletingEventId(
                id
            );


            if (
                typeof completeEvent ===
                "function"
            ) {

                await completeEvent(
                    id
                );

            }

            setSelectedEvent(
                null
            );

        } finally {

            setCompletingEventId(
                null
            );

        }

    };


    // =========================================================================
    // CLEAR FILTERS
    // =========================================================================

    const handleClearFilters = () => {

        setTypeFilter(
            "all"
        );

        setStatusFilter(
            "all"
        );

        setPriorityFilter(
            "all"
        );

    };


    // =========================================================================
    // DAY CLICK
    // =========================================================================

    const handleDayClick = (
        day
    ) => {

        setSelectedDate(
            day
        );

    };


    // =========================================================================
    // ADD EVENT FROM DAY
    // =========================================================================

    const handleAddEventFromDay = (
        day
    ) => {

        setSelectedDate(
            day
        );

        setShowAddModal(
            true
        );

    };


    // =========================================================================
    // EVENT CLICK
    // =========================================================================

    const handleEventClick = (
        event
    ) => {

        setSelectedEvent(
            event
        );

    };


    // =========================================================================
    // EDIT FROM DETAILS
    // =========================================================================

    const handleEditFromDetails = (
        event
    ) => {

        setSelectedEvent(
            null
        );

        setEditingEvent(
            event
        );

    };


    // =========================================================================
    // DELETE FROM DETAILS
    // =========================================================================

    const handleDeleteFromDetails = (
        event
    ) => {

        setSelectedEvent(
            null
        );

        setDeletingEvent(
            event
        );

    };


    // =========================================================================
    // LOADING
    // =========================================================================

    if (
        loading &&
        events.length === 0
    ) {

        return (

            <main className="space-y-5">

                <CalendarLoading />

            </main>
        );
    }


    // =========================================================================
    // ERROR
    // =========================================================================

    if (
        error &&
        events.length === 0
    ) {

        return (

            <main className="space-y-5">

                <CalendarError
                    message={
                        error
                    }
                    onRetry={
                        fetchEvents
                    }
                />

            </main>
        );
    }


    // =========================================================================
    // RENDER
    // =========================================================================

    return (

        <main
            className="
                min-w-0
                space-y-5
            "
        >

            {/* =================================================================
                HEADER
            ================================================================= */}

            <CalendarHeader
                monthDate={
                    currentMonth
                }
                events={
                    filteredEvents
                }
                onPreviousMonth={
                    handlePreviousMonth
                }
                onNextMonth={
                    handleNextMonth
                }
                onToday={
                    handleToday
                }
                onAddEvent={() =>
                    setShowAddModal(
                        true
                    )
                }
            />


            {/* =================================================================
                TOOLBAR
            ================================================================= */}

            <CalendarToolbar
                view={
                    view
                }
                onViewChange={
                    setView
                }

                type={
                    typeFilter
                }
                onTypeChange={
                    setTypeFilter
                }

                status={
                    statusFilter
                }
                onStatusChange={
                    setStatusFilter
                }

                priority={
                    priorityFilter
                }
                onPriorityChange={
                    setPriorityFilter
                }

                onClearFilters={
                    handleClearFilters
                }
            />


            {/* =================================================================
                FILTERED RESULT INFO
            ================================================================= */}

            {hasActiveFilters && (

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        gap-3
                        rounded-xl
                        border
                        border-indigo-100
                        bg-indigo-50/60
                        px-4
                        py-3
                    "
                >

                    <div className="flex items-center gap-2">

                        <CalendarDays
                            size={15}
                            className="text-indigo-500"
                        />


                        <p
                            className="
                                text-xs
                                font-semibold
                                text-indigo-700
                            "
                        >
                            Showing{" "}
                            {
                                filteredEvents.length
                            }{" "}
                            matching{" "}
                            {
                                filteredEvents.length ===
                                1
                                    ? "event"
                                    : "events"
                            }
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={
                            handleClearFilters
                        }
                        className="
                            text-xs
                            font-bold
                            text-indigo-600
                            hover:text-indigo-800
                        "
                    >
                        Clear filters
                    </button>

                </div>

            )}


            {/* =================================================================
                CALENDAR / AGENDA
            ================================================================= */}

            {view === "month" ? (

                filteredEvents.length > 0 ? (

                    <CalendarGrid
                        monthDate={
                            currentMonth
                        }
                        events={
                            filteredEvents
                        }
                        selectedDate={
                            selectedDate
                        }
                        onDayClick={
                            handleDayClick
                        }
                        onEventClick={
                            handleEventClick
                        }
                        onAddEvent={
                            handleAddEventFromDay
                        }
                        onCompleteEvent={
                            handleCompleteEvent
                        }
                    />

                ) : (

                    <CalendarEmptyState
                        title={
                            hasActiveFilters
                                ? "No matching events"
                                : "Your calendar is clear"
                        }
                        description={
                            hasActiveFilters
                                ? "Try changing your filters to see more events."
                                : "There are no events scheduled for this period."
                        }
                        filtered={
                            hasActiveFilters
                        }
                        onAction={() =>
                            setShowAddModal(
                                true
                            )
                        }
                    />

                )

            ) : (

                <UpcomingEvents
                    events={
                        filteredEvents
                    }
                    limit={10}
                    onEventClick={
                        handleEventClick
                    }
                />

            )}


            {/* =================================================================
                UPCOMING EVENTS
            ================================================================= */}

            {view === "month" &&
                filteredEvents.length > 0 && (

                    <UpcomingEvents
                        events={
                            filteredEvents
                        }
                        limit={5}
                        onEventClick={
                            handleEventClick
                        }
                    />

                )}


            {/* =================================================================
                ADD EVENT MODAL
            ================================================================= */}

            <AddEventModal
                open={
                    showAddModal
                }
                selectedDate={
                    selectedDate
                }
                onClose={() =>
                    setShowAddModal(
                        false
                    )
                }
                onCreated={
                    handleAddEvent
                }
                submitting={
                    actionLoading
                }
            />


            {/* =================================================================
                EVENT DETAILS
            ================================================================= */}

            <CalendarEventModal
                open={
                    Boolean(
                        selectedEvent
                    )
                }
                event={
                    selectedEvent
                }
                onClose={() =>
                    setSelectedEvent(
                        null
                    )
                }
                onEdit={
                    handleEditFromDetails
                }
                onDelete={
                    handleDeleteFromDetails
                }
                onComplete={
                    handleCompleteEvent
                }
                completing={
                    Boolean(
                        completingEventId
                    )
                }
            />


            {/* =================================================================
                EDIT EVENT
            ================================================================= */}

            <EditEventModal
                open={
                    Boolean(
                        editingEvent
                    )
                }
                event={
                    editingEvent
                }
                onClose={() =>
                    setEditingEvent(
                        null
                    )
                }
                onUpdated={
                    handleEditEvent
                }
            />


            {/* =================================================================
                DELETE EVENT
            ================================================================= */}

            <DeleteEventModal
                open={
                    Boolean(
                        deletingEvent
                    )
                }
                event={
                    deletingEvent
                }
                onClose={() =>
                    setDeletingEvent(
                        null
                    )
                }
                onDeleted={
                    handleDeleteEvent
                }
            />

        </main>
    );
};


// ============================================================================
// LOCAL STATUS CALCULATION
// ============================================================================
//
// Used only for toolbar filtering.
// Keep this defensive because backend data can evolve.
//
// ============================================================================

const getLocalEventStatus = (
    event
) => {

    if (!event) {
        return "upcoming";
    }


    if (
        event.status ===
        "completed"
    ) {
        return "completed";
    }


    if (
        event.status ===
        "cancelled"
    ) {
        return "cancelled";
    }


    const rawDate =
        event.startDate ||
        event.date;


    if (!rawDate) {
        return "upcoming";
    }


    const eventDate =
        new Date(
            rawDate
        );


    if (
        Number.isNaN(
            eventDate.getTime()
        )
    ) {
        return "upcoming";
    }


    const now =
        new Date();


    const startOfToday =
        new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        );


    const startOfEventDay =
        new Date(
            eventDate.getFullYear(),
            eventDate.getMonth(),
            eventDate.getDate()
        );


    const difference =
        startOfEventDay.getTime() -
        startOfToday.getTime();


    if (
        difference < 0
    ) {
        return "overdue";
    }


    if (
        difference === 0
    ) {
        return "today";
    }


    return "upcoming";
};


export default Calendar;