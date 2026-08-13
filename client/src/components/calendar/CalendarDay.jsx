import {
    CalendarPlus,
    MoreHorizontal,
} from "lucide-react";

import {
    useMemo,
} from "react";

import CalendarEvent from "./CalendarEvent";

import {
    getEventsForDay,
    isCurrentMonth,
    isToday,
    sortEventsByDate,
} from "./calendarHelpers";


// ============================================================================
// CALENDAR DAY
// ============================================================================
//
// Responsible for rendering a single calendar day.
//
// Handles:
// - Date display
// - Today / selected state
// - Events
// - Event overflow
// - Add event action
// - Day click
//
// No API calls.
// No backend logic.
// ============================================================================


const CalendarDay = ({
    day,
    monthDate,
    events = [],
    selectedDate = null,

    onDayClick,
    onEventClick,
    onAddEvent,
    onCompleteEvent,

    maxEvents = 3,
}) => {

    // =========================================================================
    // DAY VALIDATION
    // =========================================================================
    //
    // Do NOT put an early return before hooks.
    // Hooks must always execute in the same order.
    // =========================================================================

    const safeDay =
        day instanceof Date &&
        !Number.isNaN(
            day.getTime()
        )
            ? day
            : null;


    // =========================================================================
    // DAY STATE
    // =========================================================================

    const currentMonth =
        safeDay
            ? isCurrentMonth(
                safeDay,
                monthDate
            )
            : false;


    const today =
        safeDay
            ? isToday(
                safeDay
            )
            : false;


    const selected =
        safeDay &&
        selectedDate
            ? isSameCalendarDay(
                safeDay,
                selectedDate
            )
            : false;


    // =========================================================================
    // EVENTS
    // =========================================================================

    const dayEvents =
        useMemo(() => {

            if (!safeDay) {
                return [];
            }


            const matchingEvents =
                getEventsForDay(
                    events,
                    safeDay
                );


            return sortEventsByDate(
                matchingEvents
            );

        }, [
            events,
            safeDay,
        ]);


    // =========================================================================
    // VISIBLE EVENTS
    // =========================================================================

    const visibleEvents =
        dayEvents.slice(
            0,
            maxEvents
        );


    const remainingCount =
        Math.max(
            dayEvents.length -
                visibleEvents.length,
            0
        );


    // =========================================================================
    // DAY NUMBER
    // =========================================================================

    const dayNumber =
        safeDay
            ? safeDay.getDate()
            : "";


    // =========================================================================
    // HANDLERS
    // =========================================================================

    const handleDayClick = () => {

        if (
            !safeDay
        ) {
            return;
        }


        onDayClick?.(
            safeDay
        );
    };


    const handleDateClick = (
        event
    ) => {

        event.stopPropagation();

        handleDayClick();
    };


    const handleAddEvent = (
        event
    ) => {

        event.stopPropagation();


        if (
            !safeDay
        ) {
            return;
        }


        onAddEvent?.(
            safeDay
        );
    };


    const handleMoreClick = (
        event
    ) => {

        event.stopPropagation();


        if (
            !safeDay
        ) {
            return;
        }


        onDayClick?.(
            safeDay
        );
    };


    // =========================================================================
    // INVALID DAY
    // =========================================================================

    if (
        !safeDay
    ) {
        return (
            <div
                className="
                    min-h-[108px]
                    border-b
                    border-r
                    border-slate-200/80
                    bg-slate-50
                "
            />
        );
    }


    // =========================================================================
    // RENDER
    // =========================================================================

    return (

        <div
            role="gridcell"
            aria-label={
                safeDay.toDateString()
            }
            aria-selected={
                selected
            }
            onClick={
                handleDayClick
            }
            className={`
                group
                relative
                min-h-[108px]
                border-b
                border-r
                border-slate-200/80
                p-2
                transition-all
                duration-200

                ${
                    !currentMonth
                        ? "bg-slate-50/65"
                        : today
                            ? "bg-indigo-50/25"
                            : selected
                                ? "bg-violet-50/25"
                                : "bg-white"
                }

                hover:bg-slate-50

                ${
                    selected
                        ? "ring-1 ring-inset ring-indigo-200/70"
                        : ""
                }

                sm:min-h-[112px]
                sm:p-2.5
            `}
        >

            {/* =================================================================
                DAY HEADER
            ================================================================= */}

            <div
                className="
                    flex
                    min-h-[28px]
                    items-center
                    justify-between
                    gap-2
                "
            >

                {/* =============================================================
                    DATE BUTTON
                ============================================================= */}

                <button
                    type="button"
                    onClick={
                        handleDateClick
                    }
                    aria-label={
                        `Open ${safeDay.toDateString()}`
                    }
                    className={`
                        relative
                        flex
                        h-7
                        min-w-7
                        items-center
                        justify-center
                        rounded-full
                        px-1.5
                        text-xs
                        font-bold
                        tracking-tight
                        outline-none
                        transition-all
                        duration-200
                        focus:outline-none
                        focus:ring-4
                        focus:ring-indigo-100

                        ${
                            today
                                ? `
                                    bg-[#5B4BFF]
                                    text-white
                                    shadow-[0_5px_14px_rgba(91,75,255,0.25)]
                                `
                                : selected
                                    ? `
                                        bg-indigo-100
                                        text-indigo-700
                                    `
                                    : currentMonth
                                        ? `
                                            text-slate-700
                                            hover:bg-slate-100
                                            hover:text-slate-950
                                        `
                                        : `
                                            text-slate-300
                                            hover:bg-slate-100
                                        `
                        }
                    `}
                >

                    {dayNumber}

                </button>


                {/* =============================================================
                    ADD EVENT BUTTON
                ============================================================= */}

                {onAddEvent && (

                    <button
                        type="button"
                        onClick={
                            handleAddEvent
                        }
                        aria-label={
                            `Add event on ${safeDay.toDateString()}`
                        }
                        title="Add event"
                        className="
                            flex
                            h-7
                            w-7
                            items-center
                            justify-center
                            rounded-lg
                            border
                            border-transparent
                            bg-white
                            text-slate-300
                            opacity-0
                            shadow-sm
                            outline-none
                            transition-all
                            duration-200
                            hover:border-indigo-100
                            hover:bg-indigo-50
                            hover:text-[#5B4BFF]
                            group-hover:opacity-100
                            focus:opacity-100
                            focus:outline-none
                            focus:ring-4
                            focus:ring-indigo-100
                        "
                    >

                        <CalendarPlus
                            size={14}
                            strokeWidth={2}
                        />

                    </button>

                )}

            </div>


            {/* =================================================================
                EVENTS
            ================================================================= */}

            {visibleEvents.length > 0 && (

                <div
                    className="
                        mt-1.5
                        space-y-1
                    "
                    onClick={(event) =>
                        event.stopPropagation()
                    }
                >

                    {visibleEvents.map(
                        (
                            calendarEvent,
                            index
                        ) => (

                            <CalendarEvent
                                key={
                                    calendarEvent?._id ||
                                    calendarEvent?.id ||
                                    `${calendarEvent?.title || "event"}-${index}`
                                }
                                event={
                                    calendarEvent
                                }
                                compact
                                onClick={
                                    onEventClick
                                }
                                onComplete={
                                    onCompleteEvent
                                }
                            />

                        )
                    )}

                </div>

            )}


            {/* =================================================================
                MORE EVENTS
            ================================================================= */}

            {remainingCount > 0 && (

                <button
                    type="button"
                    onClick={
                        handleMoreClick
                    }
                    className="
                        mt-1
                        inline-flex
                        items-center
                        gap-1
                        rounded-lg
                        px-1.5
                        py-0.5
                        text-[10px]
                        font-bold
                        text-indigo-600
                        outline-none
                        transition-all
                        duration-200
                        hover:bg-indigo-50
                        hover:text-indigo-700
                        focus:outline-none
                        focus:ring-4
                        focus:ring-indigo-50
                    "
                >

                    <MoreHorizontal
                        size={12}
                        strokeWidth={2.5}
                    />

                    <span>
                        {remainingCount} more
                    </span>

                </button>

            )}


            {/* =================================================================
                EMPTY DAY HOVER ACTION
            ================================================================= */}

            {dayEvents.length === 0 &&
                onAddEvent && (

                    <button
                        type="button"
                        onClick={
                            handleAddEvent
                        }
                        className="
                            absolute
                            bottom-1.5
                            left-2
                            right-2
                            flex
                            items-center
                            justify-center
                            gap-1
                            rounded-lg
                            border
                            border-dashed
                            border-transparent
                            py-1
                            text-[9px]
                            font-semibold
                            text-indigo-400
                            opacity-0
                            outline-none
                            transition-all
                            duration-200
                            hover:border-indigo-100
                            hover:bg-indigo-50/60
                            hover:text-indigo-600
                            group-hover:opacity-100
                            focus:opacity-100
                            focus:outline-none
                            focus:ring-2
                            focus:ring-indigo-100
                        "
                    >

                        <CalendarPlus
                            size={11}
                        />

                        Add event

                    </button>

                )}


            {/* =================================================================
                SELECTED DAY INDICATOR
            ================================================================= */}

            {selected &&
                !today && (

                    <span
                        aria-hidden="true"
                        className="
                            pointer-events-none
                            absolute
                            bottom-1
                            left-1/2
                            h-1
                            w-1
                            -translate-x-1/2
                            rounded-full
                            bg-[#5B4BFF]
                        "
                    />

                )}

        </div>
    );
};


// ============================================================================
// LOCAL DATE COMPARISON
// ============================================================================

const isSameCalendarDay = (
    first,
    second
) => {

    if (
        !first ||
        !second
    ) {
        return false;
    }


    const firstDate =
        first instanceof Date
            ? first
            : new Date(first);


    const secondDate =
        second instanceof Date
            ? second
            : new Date(second);


    if (
        Number.isNaN(
            firstDate.getTime()
        ) ||
        Number.isNaN(
            secondDate.getTime()
        )
    ) {
        return false;
    }


    return (
        firstDate.getFullYear() ===
            secondDate.getFullYear() &&

        firstDate.getMonth() ===
            secondDate.getMonth() &&

        firstDate.getDate() ===
            secondDate.getDate()
    );
};


export default CalendarDay;