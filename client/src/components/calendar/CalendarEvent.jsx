import {
    Calendar,
    Check,
    ChevronRight,
    CreditCard,
    Repeat2,
    Shield,
    ShieldCheck,
    Wrench,
    Clock3,
    Bell,
    CircleAlert,
} from "lucide-react";

import {
    getEventAssetName,
    getEventStatus,
    getEventStatusMeta,
    getEventTypeLabel,
    getEventTypeMeta,
    getPriorityMeta,
    formatEventTime,
    getEventId,
} from "./calendarHelpers";


// ============================================================================
// EVERKEEP — CALENDAR EVENT
// ============================================================================
//
// Responsibilities:
// - Render a single calendar event
// - Provide compact and normal display modes
// - Show event type
// - Show priority/status indicators
// - Show reminder indicator
// - Handle event click
// - Handle completion action
//
// No API calls.
// No backend logic.
// ============================================================================


// ============================================================================
// ICON MAP
// ============================================================================

const EVENT_ICONS = {
    warranty: Shield,
    insurance: ShieldCheck,
    subscription: Repeat2,
    payment: CreditCard,
    maintenance: Wrench,
    custom: Calendar,
};


// ============================================================================
// TYPE VISUALS
// ============================================================================

const EVENT_TYPE_STYLES = {

    warranty: {
        dot: "bg-indigo-500",
        icon: "text-indigo-600",
        background:
            "bg-indigo-50/80 hover:bg-indigo-100",
        border:
            "border-indigo-100",
    },

    insurance: {
        dot: "bg-emerald-500",
        icon: "text-emerald-600",
        background:
            "bg-emerald-50/80 hover:bg-emerald-100",
        border:
            "border-emerald-100",
    },

    subscription: {
        dot: "bg-violet-500",
        icon: "text-violet-600",
        background:
            "bg-violet-50/80 hover:bg-violet-100",
        border:
            "border-violet-100",
    },

    payment: {
        dot: "bg-amber-500",
        icon: "text-amber-600",
        background:
            "bg-amber-50/80 hover:bg-amber-100",
        border:
            "border-amber-100",
    },

    maintenance: {
        dot: "bg-orange-500",
        icon: "text-orange-600",
        background:
            "bg-orange-50/80 hover:bg-orange-100",
        border:
            "border-orange-100",
    },

    custom: {
        dot: "bg-slate-500",
        icon: "text-slate-600",
        background:
            "bg-slate-50/90 hover:bg-slate-100",
        border:
            "border-slate-200",
    },
};


// ============================================================================
// PRIORITY STYLES
// ============================================================================

const PRIORITY_STYLES = {

    high: {
        dot: "bg-rose-500",
        text: "text-rose-600",
        ring: "ring-rose-100",
    },

    medium: {
        dot: "bg-amber-500",
        text: "text-amber-600",
        ring: "ring-amber-100",
    },

    low: {
        dot: "bg-slate-400",
        text: "text-slate-500",
        ring: "ring-slate-100",
    },
};


// ============================================================================
// STATUS STYLES
// ============================================================================

const STATUS_STYLES = {

    completed: {
        text: "text-emerald-600",
        dot: "bg-emerald-500",
    },

    cancelled: {
        text: "text-slate-400",
        dot: "bg-slate-400",
    },

    overdue: {
        text: "text-rose-600",
        dot: "bg-rose-500",
    },

    today: {
        text: "text-amber-600",
        dot: "bg-amber-500",
    },

    upcoming: {
        text: "text-indigo-600",
        dot: "bg-indigo-500",
    },
};


// ============================================================================
// COMPONENT
// ============================================================================

const CalendarEvent = ({
    event,

    compact = false,

    onClick,
    onComplete,

    className = "",
}) => {

    // =========================================================================
    // SAFETY
    // =========================================================================

    if (!event) {
        return null;
    }


    // =========================================================================
    // EVENT DATA
    // =========================================================================

    const eventId =
        getEventId(event);


    const type =
        event?.type || "custom";


    const priority =
        event?.priority || "medium";


    const eventStatus =
        getEventStatus(
            event
        );


    const title =
        event?.title ||
        "Untitled event";


    const typeLabel =
        getEventTypeLabel(
            type
        );


    const typeMeta =
        getEventTypeMeta(
            type
        );


    const priorityMeta =
        getPriorityMeta(
            priority
        );


    const statusMeta =
        getEventStatusMeta(
            eventStatus
        );


    const assetName =
        getEventAssetName(
            event
        );


    const time =
        event?.allDay
            ? "All day"
            : formatEventTime(
                event?.startDate
            );


    const hasReminder =
        Boolean(
            event?.reminder?.enabled
        );


    const isCompleted =
        eventStatus ===
        "completed";


    const isCancelled =
        eventStatus ===
        "cancelled";


    const typeStyle =
        EVENT_TYPE_STYLES[type] ||
        EVENT_TYPE_STYLES.custom;


    const priorityStyle =
        PRIORITY_STYLES[priority] ||
        PRIORITY_STYLES.medium;


    const statusStyle =
        STATUS_STYLES[eventStatus] ||
        STATUS_STYLES.upcoming;


    const EventIcon =
        EVENT_ICONS[type] ||
        Calendar;


    // =========================================================================
    // HANDLERS
    // =========================================================================

    const handleClick = (
        clickEvent
    ) => {

        clickEvent.stopPropagation();

        onClick?.(
            event
        );
    };


    const handleComplete = (
        completeEvent
    ) => {

        completeEvent.stopPropagation();

        if (
            !isCompleted &&
            !isCancelled
        ) {
            onComplete?.(
                event
            );
        }
    };


    // =========================================================================
    // COMPACT EVENT
    // =========================================================================

    if (compact) {

        return (

            <div
                role="button"
                tabIndex={0}
                title={`${title} • ${typeLabel}`}
                onClick={
                    handleClick
                }
                onKeyDown={(keyboardEvent) => {

                    if (
                        keyboardEvent.key ===
                            "Enter" ||
                        keyboardEvent.key ===
                            " "
                    ) {

                        keyboardEvent.preventDefault();

                        onClick?.(
                            event
                        );
                    }

                }}
                className={`
                    group/event
                    flex
                    w-full
                    min-w-0
                    cursor-pointer
                    items-center
                    gap-1.5
                    rounded-lg
                    border
                    px-2
                    py-1
                    text-left
                    transition-all
                    duration-200

                    ${typeStyle.background}
                    ${typeStyle.border}

                    hover:-translate-y-[1px]
                    hover:shadow-[0_4px_12px_rgba(15,23,42,0.07)]

                    focus:outline-none
                    focus:ring-2
                    focus:ring-indigo-100

                    ${
                        isCompleted
                            ? "opacity-60"
                            : ""
                    }

                    ${
                        isCancelled
                            ? "opacity-45"
                            : ""
                    }

                    ${className}
                `}
            >

                {/* -------------------------------------------------------------
                    TYPE ICON
                ------------------------------------------------------------- */}

                <span
                    className="
                        flex
                        h-4
                        w-4
                        shrink-0
                        items-center
                        justify-center
                    "
                >

                    <EventIcon
                        size={11}
                        strokeWidth={2.3}
                        className={
                            typeStyle.icon
                        }
                    />

                </span>


                {/* -------------------------------------------------------------
                    TITLE
                ------------------------------------------------------------- */}

                <span
                    className={`
                        min-w-0
                        flex-1
                        truncate
                        text-[10px]
                        font-semibold
                        leading-4

                        ${
                            isCompleted
                                ? "text-slate-400 line-through"
                                : isCancelled
                                    ? "text-slate-400 line-through"
                                    : "text-slate-700"
                        }
                    `}
                >
                    {title}
                </span>


                {/* -------------------------------------------------------------
                    REMINDER
                ------------------------------------------------------------- */}

                {hasReminder && (

                    <Bell
                        size={10}
                        strokeWidth={2.2}
                        className="
                            shrink-0
                            text-indigo-400
                        "
                    />

                )}


                {/* -------------------------------------------------------------
                    PRIORITY
                ------------------------------------------------------------- */}

                <span
                    className={`
                        h-1.5
                        w-1.5
                        shrink-0
                        rounded-full
                        ${priorityStyle.dot}
                    `}
                    aria-label={
                        `${priorityMeta.label} priority`
                    }
                />

            </div>
        );
    }


    // =========================================================================
    // NORMAL / AGENDA EVENT
    // =========================================================================

    return (

        <article
            role="button"
            tabIndex={0}
            onClick={
                handleClick
            }
            onKeyDown={(keyboardEvent) => {

                if (
                    keyboardEvent.key ===
                        "Enter" ||
                    keyboardEvent.key ===
                        " "
                ) {

                    keyboardEvent.preventDefault();

                    onClick?.(
                        event
                    );
                }

            }}
            className={`
                group/event
                relative
                flex
                w-full
                cursor-pointer
                items-start
                gap-3
                rounded-2xl
                border
                bg-white
                p-3
                text-left
                shadow-[0_3px_14px_rgba(15,23,42,0.035)]
                transition-all
                duration-200

                hover:-translate-y-[1px]
                hover:shadow-[0_10px_28px_rgba(15,23,42,0.08)]

                focus:outline-none
                focus:ring-4
                focus:ring-indigo-50

                ${
                    isCompleted
                        ? "border-emerald-100 bg-emerald-50/20"
                        : isCancelled
                            ? "border-slate-200 bg-slate-50/60"
                            : "border-slate-200"
                }

                ${className}
            `}
        >

            {/* =================================================================
                LEFT ICON
            ================================================================= */}

            <div
                className={`
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    ${typeMeta.className}
                `}
            >

                <EventIcon
                    size={18}
                    strokeWidth={2}
                />

            </div>


            {/* =================================================================
                CONTENT
            ================================================================= */}

            <div
                className="
                    min-w-0
                    flex-1
                "
            >

                {/* -------------------------------------------------------------
                    TITLE ROW
                ------------------------------------------------------------- */}

                <div
                    className="
                        flex
                        min-w-0
                        items-start
                        justify-between
                        gap-3
                    "
                >

                    <div
                        className="
                            min-w-0
                        "
                    >

                        <h3
                            className={`
                                truncate
                                text-sm
                                font-bold
                                tracking-tight

                                ${
                                    isCompleted ||
                                    isCancelled
                                        ? "text-slate-400 line-through"
                                        : "text-slate-900"
                                }
                            `}
                        >
                            {title}
                        </h3>


                        {/* TYPE */}

                        <p
                            className="
                                mt-0.5
                                text-[11px]
                                font-medium
                                text-slate-400
                            "
                        >
                            {typeLabel}
                        </p>

                    </div>


                    {/* PRIORITY */}

                    <span
                        className={`
                            inline-flex
                            shrink-0
                            items-center
                            gap-1.5
                            rounded-full
                            bg-white
                            px-2
                            py-1
                            text-[10px]
                            font-bold
                            ring-1
                            ${priorityStyle.ring}
                            ${priorityStyle.text}
                        `}
                    >

                        <span
                            className={`
                                h-1.5
                                w-1.5
                                rounded-full
                                ${priorityStyle.dot}
                            `}
                        />

                        {priorityMeta.label}

                    </span>

                </div>


                {/* -------------------------------------------------------------
                    META ROW
                ------------------------------------------------------------- */}

                <div
                    className="
                        mt-2.5
                        flex
                        flex-wrap
                        items-center
                        gap-x-3
                        gap-y-1.5
                    "
                >

                    {/* DATE / TIME */}

                    <span
                        className="
                            inline-flex
                            items-center
                            gap-1.5
                            text-[11px]
                            font-medium
                            text-slate-500
                        "
                    >

                        <Clock3
                            size={12}
                            strokeWidth={2}
                        />

                        {time}

                    </span>


                    {/* ASSET */}

                    {assetName &&
                        assetName !==
                            "No asset linked" && (

                        <span
                            className="
                                min-w-0
                                max-w-[220px]
                                truncate
                                text-[11px]
                                font-medium
                                text-slate-400
                            "
                            title={
                                assetName
                            }
                        >
                            {assetName}
                        </span>

                    )}


                    {/* REMINDER */}

                    {hasReminder && (

                        <span
                            className="
                                inline-flex
                                items-center
                                gap-1
                                text-[11px]
                                font-medium
                                text-indigo-500
                            "
                        >

                            <Bell
                                size={11}
                                strokeWidth={2}
                            />

                            Reminder

                        </span>

                    )}

                </div>


                {/* -------------------------------------------------------------
                    STATUS
                ------------------------------------------------------------- */}

                <div
                    className="
                        mt-2.5
                    "
                >

                    <span
                        className={`
                            inline-flex
                            items-center
                            gap-1.5
                            rounded-full
                            px-2
                            py-1
                            text-[10px]
                            font-semibold
                            ${statusMeta.className}
                        `}
                    >

                        <span
                            className={`
                                h-1.5
                                w-1.5
                                rounded-full
                                ${statusStyle.dot}
                            `}
                        />

                        {statusMeta.label}

                    </span>

                </div>

            </div>


            {/* =================================================================
                COMPLETE / ACTION
            ================================================================= */}

            <div
                className="
                    flex
                    shrink-0
                    items-center
                    gap-1
                "
            >

                {!isCompleted &&
                    !isCancelled &&
                    onComplete && (

                    <button
                        type="button"
                        onClick={
                            handleComplete
                        }
                        aria-label={
                            `Mark ${title} as completed`
                        }
                        title="Mark as completed"
                        className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-lg
                            border
                            border-slate-200
                            bg-white
                            text-slate-400
                            opacity-0
                            transition-all
                            duration-200
                            hover:border-emerald-200
                            hover:bg-emerald-50
                            hover:text-emerald-600
                            group-hover/event:opacity-100
                            focus:opacity-100
                            focus:outline-none
                            focus:ring-4
                            focus:ring-emerald-50
                        "
                    >

                        <Check
                            size={14}
                            strokeWidth={2.4}
                        />

                    </button>

                )}


                {/* VIEW */}

                <span
                    className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-lg
                        text-slate-300
                        transition-colors
                        duration-200
                        group-hover/event:text-indigo-500
                    "
                >

                    <ChevronRight
                        size={16}
                        strokeWidth={2}
                    />

                </span>

            </div>


            {/* =================================================================
                OVERDUE ACCENT
            ================================================================= */}

            {eventStatus ===
                "overdue" && (

                <span
                    aria-hidden="true"
                    className="
                        absolute
                        bottom-3
                        left-0
                        top-3
                        w-0.5
                        rounded-full
                        bg-rose-500
                    "
                />

            )}


            {/* =================================================================
                HIGH PRIORITY ACCENT
            ================================================================= */}

            {priority ===
                "high" &&
                eventStatus !==
                    "overdue" && (

                <span
                    aria-hidden="true"
                    className="
                        absolute
                        bottom-3
                        left-0
                        top-3
                        w-0.5
                        rounded-full
                        bg-rose-400
                    "
                />

            )}

        </article>
    );
};


export default CalendarEvent;