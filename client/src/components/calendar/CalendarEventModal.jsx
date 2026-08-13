import {
    AlertCircle,
    CalendarDays,
    CheckCircle2,
    Clock3,
    CreditCard,
    Edit3,
    Repeat2,
    Shield,
    ShieldCheck,
    Trash2,
    Wrench,
    X,
} from "lucide-react";

import {
    useEffect,
    useState,
} from "react";

import {
    formatCalendarDate,
    formatEventTime,
    getEventStatus,
    getEventTitle,
    getEventTypeLabel,
    getPriorityMeta,
} from "./calendarHelpers";


// ============================================================================
// EVENT ICONS
// ============================================================================

const EVENT_ICONS = {
    warranty: Shield,
    insurance: ShieldCheck,
    subscription: Repeat2,
    payment: CreditCard,
    maintenance: Wrench,
    custom: CalendarDays,
};


// ============================================================================
// STATUS CONFIG
// ============================================================================

const STATUS_CONFIG = {

    overdue: {
        label: "Overdue",
        icon: AlertCircle,
        className:
            "bg-rose-50 text-rose-700 border-rose-100",
        iconClass:
            "bg-rose-100 text-rose-600",
    },

    today: {
        label: "Today",
        icon: Clock3,
        className:
            "bg-amber-50 text-amber-700 border-amber-100",
        iconClass:
            "bg-amber-100 text-amber-600",
    },

    upcoming: {
        label: "Upcoming",
        icon: CalendarDays,
        className:
            "bg-indigo-50 text-indigo-700 border-indigo-100",
        iconClass:
            "bg-indigo-100 text-indigo-600",
    },

    completed: {
        label: "Completed",
        icon: CheckCircle2,
        className:
            "bg-emerald-50 text-emerald-700 border-emerald-100",
        iconClass:
            "bg-emerald-100 text-emerald-600",
    },

    cancelled: {
        label: "Cancelled",
        icon: X,
        className:
            "bg-slate-100 text-slate-600 border-slate-200",
        iconClass:
            "bg-slate-200 text-slate-500",
    },

};


// ============================================================================
// DETAIL ITEM
// ============================================================================

const DetailItem = ({
    label,
    value,
}) => {

    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return null;
    }


    return (

        <div
            className="
                rounded-2xl
                border
                border-slate-200
                bg-slate-50
                p-4
            "
        >

            <p
                className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.14em]
                    text-slate-400
                "
            >
                {label}
            </p>


            <p
                className="
                    mt-1.5
                    truncate
                    text-sm
                    font-semibold
                    text-slate-800
                "
                title={String(value)}
            >
                {value}
            </p>

        </div>
    );
};


// ============================================================================
// CALENDAR EVENT MODAL
// ============================================================================

const CalendarEventModal = ({
    open = true,
    event = null,

    onClose,
    onEdit,
    onDelete,
    onComplete,

    completing = false,
}) => {

    const [actionError, setActionError] =
        useState("");


    // =========================================================================
    // ESCAPE KEY
    // =========================================================================

    useEffect(() => {

        if (!open) {
            return undefined;
        }


        const handleKeyDown = (
            keyboardEvent
        ) => {

            if (
                keyboardEvent.key === "Escape"
            ) {
                onClose?.();
            }

        };


        window.addEventListener(
            "keydown",
            handleKeyDown
        );


        return () => {

            window.removeEventListener(
                "keydown",
                handleKeyDown
            );

        };

    }, [
        open,
        onClose,
    ]);


    // =========================================================================
    // BODY SCROLL LOCK
    // =========================================================================

    useEffect(() => {

        if (!open) {
            return undefined;
        }


        const previousOverflow =
            document.body.style.overflow;


        document.body.style.overflow =
            "hidden";


        return () => {

            document.body.style.overflow =
                previousOverflow;

        };

    }, [open]);


    // =========================================================================
    // RESET ERROR
    // =========================================================================

    useEffect(() => {

        setActionError("");

    }, [event]);


    // =========================================================================
    // SAFETY
    // =========================================================================

    if (
        !open ||
        !event
    ) {
        return null;
    }


    // =========================================================================
    // EVENT DATA
    // =========================================================================

    const title =
        getEventTitle(event);


    const type =
        event.type || "custom";


    const EventIcon =
        EVENT_ICONS[type] ||
        CalendarDays;


    const status =
        getEventStatus(event);


    const statusConfig =
        STATUS_CONFIG[status] ||
        STATUS_CONFIG.upcoming;


    const StatusIcon =
        statusConfig.icon;


    const priority =
        getPriorityMeta(
            event.priority
        );


    const eventDate =
        formatCalendarDate(
            event.startDate
        );


    const eventTime =
        event.allDay
            ? "All day"
            : formatEventTime(
                event.startDate
            );


    // =========================================================================
    // END DATE
    // =========================================================================

    const hasEndDate =
        event.endDate &&
        event.endDate !==
            event.startDate;


    const endDate =
        hasEndDate
            ? formatCalendarDate(
                event.endDate
            )
            : null;


    // =========================================================================
    // HANDLERS
    // =========================================================================

    const handleEdit = () => {

        setActionError("");

        onEdit?.(
            event
        );
    };


    const handleDelete = () => {

        setActionError("");

        onDelete?.(
            event
        );
    };


    const handleComplete = async () => {

        if (
            status === "completed" ||
            status === "cancelled" ||
            completing
        ) {
            return;
        }


        try {

            setActionError("");

            await onComplete?.(
                event
            );

        } catch (error) {

            console.error(
                "Failed to complete event:",
                error
            );


            setActionError(
                error?.response?.data?.message ||
                error?.message ||
                "Unable to complete this event."
            );

        }

    };


    // =========================================================================
    // RENDER
    // =========================================================================

    return (

        <div
            className="
                fixed
                inset-0
                z-[75]
                flex
                items-center
                justify-center
                bg-slate-950/50
                p-4
                backdrop-blur-sm
            "
            onMouseDown={(mouseEvent) => {

                if (
                    mouseEvent.target ===
                    mouseEvent.currentTarget
                ) {
                    onClose?.();
                }

            }}
        >

            {/* =================================================================
                MODAL
            ================================================================= */}

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="calendar-event-title"
                className="
                    flex
                    w-full
                    max-w-2xl
                    max-h-[92vh]
                    flex-col
                    overflow-hidden
                    rounded-[1.75rem]
                    border
                    border-white/70
                    bg-white
                    shadow-[0_30px_100px_rgba(15,23,42,0.30)]
                "
                onMouseDown={(mouseEvent) =>
                    mouseEvent.stopPropagation()
                }
            >

                {/* =============================================================
                    HEADER
                ============================================================= */}

                <header
                    className="
                        flex
                        shrink-0
                        items-start
                        justify-between
                        gap-4
                        border-b
                        border-slate-200
                        px-6
                        py-5
                    "
                >

                    <div
                        className="
                            flex
                            min-w-0
                            items-center
                            gap-3
                        "
                    >

                        {/* EVENT ICON */}

                        <div
                            className={`
                                flex
                                h-12
                                w-12
                                shrink-0
                                items-center
                                justify-center
                                rounded-2xl
                                ${statusConfig.iconClass}
                            `}
                        >

                            <EventIcon
                                size={22}
                                strokeWidth={2}
                            />

                        </div>


                        {/* TITLE */}

                        <div className="min-w-0">

                            <p
                                className="
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-[0.18em]
                                    text-indigo-500
                                "
                            >
                                {getEventTypeLabel(
                                    type
                                )}
                            </p>


                            <h2
                                id="calendar-event-title"
                                className="
                                    mt-1
                                    truncate
                                    text-xl
                                    font-bold
                                    tracking-tight
                                    text-slate-950
                                "
                                title={title}
                            >
                                {title}
                            </h2>

                        </div>

                    </div>


                    {/* CLOSE */}

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close event details"
                        className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-slate-200
                            text-slate-500
                            transition
                            hover:bg-slate-50
                            hover:text-slate-800
                            focus:outline-none
                            focus:ring-4
                            focus:ring-indigo-50
                        "
                    >

                        <X size={17} />

                    </button>

                </header>


                {/* =============================================================
                    CONTENT
                ============================================================= */}

                <div
                    className="
                        min-h-0
                        flex-1
                        overflow-y-auto
                        px-6
                        py-6
                    "
                >

                    {/* STATUS */}

                    <div
                        className="
                            flex
                            flex-wrap
                            items-center
                            gap-2
                        "
                    >

                        <span
                            className={`
                                inline-flex
                                items-center
                                gap-1.5
                                rounded-full
                                border
                                px-3
                                py-1.5
                                text-xs
                                font-bold
                                ${statusConfig.className}
                            `}
                        >

                            <StatusIcon
                                size={13}
                            />

                            {statusConfig.label}

                        </span>


                        <span
                            className="
                                inline-flex
                                items-center
                                rounded-full
                                border
                                border-slate-200
                                bg-white
                                px-3
                                py-1.5
                                text-xs
                                font-semibold
                                text-slate-600
                            "
                        >
                            {priority.label} priority
                        </span>

                    </div>


                    {/* DATE/TIME */}

                    <div
                        className="
                            mt-5
                            grid
                            gap-3
                            sm:grid-cols-2
                        "
                    >

                        <DetailItem
                            label="Date"
                            value={
                                eventDate
                            }
                        />


                        <DetailItem
                            label="Time"
                            value={
                                eventTime
                            }
                        />


                        {hasEndDate && (

                            <DetailItem
                                label="End date"
                                value={
                                    endDate
                                }
                            />

                        )}


                        {event.asset?.name && (

                            <DetailItem
                                label="Linked asset"
                                value={
                                    event.asset.name
                                }
                            />

                        )}

                    </div>


                    {/* DESCRIPTION */}

                    {event.description && (

                        <div className="mt-4">

                            <div
                                className="
                                    rounded-2xl
                                    border
                                    border-slate-200
                                    bg-white
                                    p-4
                                "
                            >

                                <p
                                    className="
                                        text-[10px]
                                        font-bold
                                        uppercase
                                        tracking-[0.14em]
                                        text-slate-400
                                    "
                                >
                                    Description
                                </p>


                                <p
                                    className="
                                        mt-2
                                        whitespace-pre-wrap
                                        text-sm
                                        leading-6
                                        text-slate-600
                                    "
                                >
                                    {
                                        event.description
                                    }
                                </p>

                            </div>

                        </div>

                    )}


                    {/* NOTES */}

                    {event.notes && (

                        <div className="mt-4">

                            <div
                                className="
                                    rounded-2xl
                                    border
                                    border-slate-200
                                    bg-slate-50
                                    p-4
                                "
                            >

                                <p
                                    className="
                                        text-[10px]
                                        font-bold
                                        uppercase
                                        tracking-[0.14em]
                                        text-slate-400
                                    "
                                >
                                    Notes
                                </p>


                                <p
                                    className="
                                        mt-2
                                        whitespace-pre-wrap
                                        text-sm
                                        leading-6
                                        text-slate-600
                                    "
                                >
                                    {event.notes}
                                </p>

                            </div>

                        </div>

                    )}


                    {/* ERROR */}

                    {actionError && (

                        <div
                            role="alert"
                            className="
                                mt-4
                                rounded-2xl
                                border
                                border-rose-200
                                bg-rose-50
                                px-4
                                py-3
                                text-sm
                                text-rose-700
                            "
                        >

                            <p className="font-semibold">
                                Action failed
                            </p>


                            <p className="mt-1 text-xs">
                                {actionError}
                            </p>

                        </div>

                    )}

                </div>


                {/* =============================================================
                    FOOTER ACTIONS
                ============================================================= */}

                <footer
                    className="
                        flex
                        shrink-0
                        flex-col-reverse
                        gap-3
                        border-t
                        border-slate-200
                        px-6
                        py-5
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >

                    {/* DELETE */}

                    <button
                        type="button"
                        onClick={handleDelete}
                        className="
                            inline-flex
                            h-11
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-rose-200
                            bg-rose-50
                            px-4
                            text-sm
                            font-semibold
                            text-rose-600
                            transition
                            hover:border-rose-300
                            hover:bg-rose-100
                            focus:outline-none
                            focus:ring-4
                            focus:ring-rose-50
                        "
                    >

                        <Trash2
                            size={16}
                        />

                        Delete

                    </button>


                    {/* RIGHT ACTIONS */}

                    <div
                        className="
                            flex
                            flex-col
                            gap-2
                            sm:flex-row
                        "
                    >

                        {/* MARK COMPLETE */}

                        {status !== "completed" &&
                            status !== "cancelled" && (

                                <button
                                    type="button"
                                    onClick={
                                        handleComplete
                                    }
                                    disabled={
                                        completing
                                    }
                                    className="
                                        inline-flex
                                        h-11
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        border
                                        border-emerald-200
                                        bg-emerald-50
                                        px-4
                                        text-sm
                                        font-semibold
                                        text-emerald-700
                                        transition
                                        hover:bg-emerald-100
                                        focus:outline-none
                                        focus:ring-4
                                        focus:ring-emerald-50
                                        disabled:pointer-events-none
                                        disabled:opacity-60
                                    "
                                >

                                    <CheckCircle2
                                        size={16}
                                    />

                                    {completing
                                        ? "Updating..."
                                        : "Complete"}

                                </button>

                            )}


                        {/* EDIT */}

                        <button
                            type="button"
                            onClick={
                                handleEdit
                            }
                            className="
                                inline-flex
                                h-11
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-[#5B4BFF]
                                px-5
                                text-sm
                                font-semibold
                                text-white
                                shadow-[0_12px_30px_rgba(91,75,255,0.20)]
                                transition-all
                                hover:-translate-y-0.5
                                hover:bg-indigo-600
                                focus:outline-none
                                focus:ring-4
                                focus:ring-indigo-100
                            "
                        >

                            <Edit3
                                size={16}
                            />

                            Edit event

                        </button>

                    </div>

                </footer>

            </div>

        </div>
    );
};


export default CalendarEventModal;