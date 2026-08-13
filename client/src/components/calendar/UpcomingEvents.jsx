import {
    AlertCircle,
    CalendarDays,
    CheckCircle2,
    ChevronRight,
    Clock3,
    Inbox,
} from "lucide-react";

import {
    formatCalendarDate,
    formatEventTime,
    getEventStatus,
    getEventTitle,
    getEventTypeLabel,
    getUpcomingEvents,
    getOverdueEvents,
} from "./calendarHelpers";


// ============================================================================
// STATUS CONFIG
// ============================================================================

const STATUS_CONFIG = {
    overdue: {
        label: "Overdue",
        icon: AlertCircle,
        container:
            "border-rose-100 bg-rose-50/60",
        iconContainer:
            "bg-rose-100 text-rose-600",
        title:
            "text-rose-900",
        meta:
            "text-rose-600",
    },

    today: {
        label: "Today",
        icon: Clock3,
        container:
            "border-amber-100 bg-amber-50/60",
        iconContainer:
            "bg-amber-100 text-amber-600",
        title:
            "text-amber-900",
        meta:
            "text-amber-600",
    },

    upcoming: {
        label: "Upcoming",
        icon: CalendarDays,
        container:
            "border-slate-200 bg-white",
        iconContainer:
            "bg-indigo-50 text-[#5B4BFF]",
        title:
            "text-slate-900",
        meta:
            "text-slate-500",
    },

    completed: {
        label: "Completed",
        icon: CheckCircle2,
        container:
            "border-emerald-100 bg-emerald-50/50",
        iconContainer:
            "bg-emerald-100 text-emerald-600",
        title:
            "text-emerald-900",
        meta:
            "text-emerald-600",
    },
};


// ============================================================================
// EVENT ITEM
// ============================================================================

const UpcomingEventItem = ({
    event,
    onClick,
}) => {

    const status =
        getEventStatus(event);


    const config =
        STATUS_CONFIG[status] ||
        STATUS_CONFIG.upcoming;


    const StatusIcon =
        config.icon;


    const title =
        getEventTitle(event);


    const eventType =
        getEventTypeLabel(
            event.type
        );


    const date =
        formatCalendarDate(
            event.startDate
        );


    const time =
        event.allDay
            ? "All day"
            : formatEventTime(
                event.startDate
            );


    const handleClick = () => {

        onClick?.(
            event
        );
    };


    return (

        <button
            type="button"
            onClick={handleClick}
            className={`
                group
                flex
                w-full
                items-center
                gap-3
                rounded-2xl
                border
                p-3
                text-left
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:shadow-sm
                ${config.container}
            `}
        >

            {/* ================================================================
                ICON
            ================================================================ */}

            <div
                className={`
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    ${config.iconContainer}
                `}
            >

                <StatusIcon
                    size={17}
                    strokeWidth={2}
                />

            </div>


            {/* ================================================================
                CONTENT
            ================================================================ */}

            <div className="min-w-0 flex-1">

                {/* TITLE */}

                <div className="flex items-center gap-2">

                    <p
                        className={`
                            min-w-0
                            flex-1
                            truncate
                            text-sm
                            font-bold
                            ${config.title}
                            ${
                                status === "completed"
                                    ? "line-through opacity-70"
                                    : ""
                            }
                        `}
                    >
                        {title}
                    </p>


                    {/* PRIORITY */}

                    {event.priority === "high" && (

                        <span
                            title="High priority"
                            className="
                                h-1.5
                                w-1.5
                                shrink-0
                                rounded-full
                                bg-rose-500
                            "
                        />

                    )}

                </div>


                {/* META */}

                <div
                    className={`
                        mt-1
                        flex
                        flex-wrap
                        items-center
                        gap-x-2
                        gap-y-1
                        text-[11px]
                        font-medium
                        ${config.meta}
                    `}
                >

                    <span>
                        {eventType}
                    </span>


                    <span
                        className="
                            h-1
                            w-1
                            rounded-full
                            bg-current
                            opacity-40
                        "
                    />


                    <span>
                        {date}
                    </span>


                    <span
                        className="
                            h-1
                            w-1
                            rounded-full
                            bg-current
                            opacity-40
                        "
                    />


                    <span>
                        {time}
                    </span>

                </div>

            </div>


            {/* ================================================================
                ARROW
            ================================================================ */}

            <ChevronRight
                size={17}
                className="
                    shrink-0
                    text-slate-300
                    transition
                    group-hover:translate-x-0.5
                    group-hover:text-slate-500
                "
            />

        </button>
    );
};


// ============================================================================
// SECTION
// ============================================================================

const EventSection = ({
    title,
    description,
    events,
    icon: Icon,
    emptyTitle,
    emptyDescription,
    onEventClick,
}) => {

    return (

        <section className="space-y-3">

            {/* HEADER */}

            <div className="flex items-start justify-between gap-4">

                <div className="flex items-start gap-3">

                    <div
                        className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-slate-100
                            text-slate-500
                        "
                    >

                        <Icon
                            size={16}
                        />

                    </div>


                    <div>

                        <h3
                            className="
                                text-sm
                                font-bold
                                text-slate-900
                            "
                        >
                            {title}
                        </h3>


                        <p
                            className="
                                mt-0.5
                                text-[11px]
                                text-slate-400
                            "
                        >
                            {description}
                        </p>

                    </div>

                </div>


                {events.length > 0 && (

                    <span
                        className="
                            flex
                            h-6
                            min-w-6
                            items-center
                            justify-center
                            rounded-full
                            bg-slate-100
                            px-1.5
                            text-[10px]
                            font-bold
                            text-slate-500
                        "
                    >
                        {events.length}
                    </span>

                )}

            </div>


            {/* EVENTS */}

            {events.length > 0 ? (

                <div className="space-y-2">

                    {events.map(
                        (event) => (

                            <UpcomingEventItem
                                key={
                                    event._id ||
                                    event.id
                                }
                                event={
                                    event
                                }
                                onClick={
                                    onEventClick
                                }
                            />

                        )
                    )}

                </div>

            ) : (

                <div
                    className="
                        rounded-2xl
                        border
                        border-dashed
                        border-slate-200
                        bg-slate-50/60
                        px-4
                        py-5
                        text-center
                    "
                >

                    <p
                        className="
                            text-xs
                            font-semibold
                            text-slate-600
                        "
                    >
                        {emptyTitle}
                    </p>


                    <p
                        className="
                            mt-1
                            text-[11px]
                            leading-5
                            text-slate-400
                        "
                    >
                        {emptyDescription}
                    </p>

                </div>

            )}

        </section>
    );
};


// ============================================================================
// UPCOMING EVENTS
// ============================================================================

const UpcomingEvents = ({
    events = [],
    limit = 5,
    onEventClick,
}) => {

    // =========================================================================
    // SAFETY
    // =========================================================================

    const safeEvents =
        Array.isArray(events)
            ? events
            : [];


    // =========================================================================
    // OVERDUE
    // =========================================================================

    const overdueEvents =
        getOverdueEvents(
            safeEvents
        ).slice(
            0,
            Math.min(
                limit,
                3
            )
        );


    // =========================================================================
    // UPCOMING
    // =========================================================================

    const upcomingEvents =
        getUpcomingEvents(
            safeEvents,
            limit
        );


    // =========================================================================
    // TODAY
    // =========================================================================

    const todayEvents =
        safeEvents
            .filter(
                (event) =>
                    getEventStatus(
                        event
                    ) === "today"
            )
            .slice(
                0,
                3
            );


    // =========================================================================
    // EMPTY STATE
    // =========================================================================

    const hasAnyEvents =
        overdueEvents.length > 0 ||
        todayEvents.length > 0 ||
        upcomingEvents.length > 0;


    if (!hasAnyEvents) {

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

                <div
                    className="
                        flex
                        flex-col
                        items-center
                        justify-center
                        py-8
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
                            bg-slate-100
                            text-slate-400
                        "
                    >

                        <Inbox
                            size={24}
                        />

                    </div>


                    <h3
                        className="
                            mt-4
                            text-sm
                            font-bold
                            text-slate-800
                        "
                    >
                        Your calendar is clear
                    </h3>


                    <p
                        className="
                            mt-1
                            max-w-sm
                            text-xs
                            leading-5
                            text-slate-400
                        "
                    >
                        There are no overdue, today,
                        or upcoming events to show.
                    </p>

                </div>

            </div>
        );
    }


    // =========================================================================
    // RENDER
    // =========================================================================

    return (

        <div
            className="
                rounded-[1.5rem]
                border
                border-slate-200
                bg-white
                p-5
                shadow-[0_12px_40px_rgba(15,23,42,0.05)]
            "
        >

            {/* =================================================================
                MAIN HEADER
            ================================================================= */}

            <div
                className="
                    mb-6
                    flex
                    items-center
                    justify-between
                    gap-4
                "
            >

                <div>

                    <p
                        className="
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-[0.18em]
                            text-indigo-500
                        "
                    >
                        Schedule
                    </p>


                    <h2
                        className="
                            mt-1
                            text-lg
                            font-bold
                            tracking-tight
                            text-slate-950
                        "
                    >
                        Upcoming events
                    </h2>


                    <p
                        className="
                            mt-1
                            text-xs
                            text-slate-500
                        "
                    >
                        Keep track of what needs
                        your attention.
                    </p>

                </div>


                <div
                    className="
                        hidden
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        bg-indigo-50
                        text-[#5B4BFF]
                        sm:flex
                    "
                >

                    <CalendarDays
                        size={18}
                    />

                </div>

            </div>


            {/* =================================================================
                SECTIONS
            ================================================================= */}

            <div className="space-y-7">

                {/* OVERDUE */}

                {overdueEvents.length > 0 && (

                    <EventSection
                        title="Needs attention"
                        description="These events have passed."
                        events={
                            overdueEvents
                        }
                        icon={
                            AlertCircle
                        }
                        emptyTitle="Nothing overdue"
                        emptyDescription="You're all caught up."
                        onEventClick={
                            onEventClick
                        }
                    />

                )}


                {/* TODAY */}

                {todayEvents.length > 0 && (

                    <EventSection
                        title="Today"
                        description="Events scheduled for today."
                        events={
                            todayEvents
                        }
                        icon={
                            Clock3
                        }
                        emptyTitle="Nothing scheduled today"
                        emptyDescription="Your day is clear."
                        onEventClick={
                            onEventClick
                        }
                    />

                )}


                {/* UPCOMING */}

                {upcomingEvents.length > 0 && (

                    <EventSection
                        title="Coming up"
                        description="Your next scheduled events."
                        events={
                            upcomingEvents
                        }
                        icon={
                            CalendarDays
                        }
                        emptyTitle="No upcoming events"
                        emptyDescription="Add an event to stay organized."
                        onEventClick={
                            onEventClick
                        }
                    />

                )}

            </div>

        </div>
    );
};


export default UpcomingEvents;