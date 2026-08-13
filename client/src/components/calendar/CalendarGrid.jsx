import { useMemo } from "react";

import CalendarDay from "./CalendarDay";

import {
    getCalendarDays,
} from "./calendarHelpers";


// ============================================================================
// CALENDAR GRID
// ============================================================================
//
// Responsible for:
// - Rendering weekday headers
// - Generating calendar days
// - Passing events to CalendarDay
// - Forwarding calendar interactions
//
// No API calls.
// No business logic.
// No backend logic.
// ============================================================================


const WEEK_DAYS = [
    {
        full: "Sunday",
        short: "Sun",
        compact: "S",
    },
    {
        full: "Monday",
        short: "Mon",
        compact: "M",
    },
    {
        full: "Tuesday",
        short: "Tue",
        compact: "T",
    },
    {
        full: "Wednesday",
        short: "Wed",
        compact: "W",
    },
    {
        full: "Thursday",
        short: "Thu",
        compact: "T",
    },
    {
        full: "Friday",
        short: "Fri",
        compact: "F",
    },
    {
        full: "Saturday",
        short: "Sat",
        compact: "S",
    },
];


// ============================================================================
// COMPONENT
// ============================================================================

const CalendarGrid = ({
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
    // CALENDAR DAYS
    // =========================================================================

    const calendarDays = useMemo(
        () => {

            if (!monthDate) {
                return [];
            }

            return getCalendarDays(
                monthDate
            );

        },
        [monthDate]
    );


    // =========================================================================
    // EMPTY STATE
    // =========================================================================

    if (
        !monthDate ||
        calendarDays.length === 0
    ) {

        return (
            <div
                className="
                    flex
                    min-h-[260px]
                    items-center
                    justify-center
                    rounded-[1.5rem]
                    border
                    border-slate-200
                    bg-white
                    shadow-[0_10px_35px_rgba(15,23,42,0.04)]
                "
            >

                <div
                    className="
                        text-center
                    "
                >

                    <p
                        className="
                            text-sm
                            font-semibold
                            text-slate-700
                        "
                    >
                        Calendar unavailable
                    </p>

                    <p
                        className="
                            mt-1
                            text-xs
                            text-slate-400
                        "
                    >
                        Select a valid month to continue.
                    </p>

                </div>

            </div>
        );
    }


    // =========================================================================
    // RENDER
    // =========================================================================

    return (

        <section
            aria-label="Calendar"
            className="
                w-full
                overflow-hidden
                rounded-[1.5rem]
                border
                border-slate-200/90
                bg-white
                shadow-[0_16px_50px_rgba(15,23,42,0.055)]
            "
        >

            {/* =================================================================
                WEEKDAY HEADER
            ================================================================= */}

            <div
                role="row"
                className="
                    grid
                    grid-cols-7
                    border-b
                    border-slate-200
                    bg-gradient-to-b
                    from-slate-50
                    to-white
                "
            >

                {WEEK_DAYS.map(
                    (
                        weekday,
                        index
                    ) => (

                        <div
                            key={
                                weekday.full
                            }
                            role="columnheader"
                            aria-label={
                                weekday.full
                            }
                            className={`
                                relative
                                flex
                                h-10
                                items-center
                                justify-center
                                border-r
                                border-slate-200/80
                                last:border-r-0

                                ${
                                    index === 0 ||
                                    index === 6
                                        ? "bg-slate-50/45"
                                        : ""
                                }
                            `}
                        >

                            {/* -------------------------------------------------
                                DESKTOP
                            ------------------------------------------------- */}

                            <span
                                className="
                                    hidden
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-[0.16em]
                                    text-slate-400
                                    sm:block
                                "
                            >
                                {weekday.full}
                            </span>


                            {/* -------------------------------------------------
                                TABLET
                            ------------------------------------------------- */}

                            <span
                                className="
                                    hidden
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-[0.14em]
                                    text-slate-400
                                    min-[400px]:max-sm:block
                                "
                            >
                                {weekday.short}
                            </span>


                            {/* -------------------------------------------------
                                MOBILE
                            ------------------------------------------------- */}

                            <span
                                className="
                                    block
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-[0.1em]
                                    text-slate-400
                                    min-[400px]:hidden
                                "
                            >
                                {weekday.compact}
                            </span>

                        </div>

                    )
                )}

            </div>


            {/* =================================================================
                CALENDAR DAYS
            ================================================================= */}

            <div
                role="grid"
                aria-label="Calendar days"
                className="
                    grid
                    grid-cols-7
                    bg-slate-100/70
                    gap-px
                "
            >

                {calendarDays.map(
                    (day) => (

                        <CalendarDay
                            key={
                                day.toISOString()
                            }

                            day={
                                day
                            }

                            monthDate={
                                monthDate
                            }

                            events={
                                events
                            }

                            selectedDate={
                                selectedDate
                            }

                            maxEvents={
                                maxEvents
                            }

                            onDayClick={
                                onDayClick
                            }

                            onEventClick={
                                onEventClick
                            }

                            onAddEvent={
                                onAddEvent
                            }

                            onCompleteEvent={
                                onCompleteEvent
                            }
                        />

                    )
                )}

            </div>


            {/* =================================================================
                SUBTLE BOTTOM EDGE
            ================================================================= */}

            <div
                aria-hidden="true"
                className="
                    h-px
                    w-full
                    bg-gradient-to-r
                    from-transparent
                    via-indigo-100
                    to-transparent
                "
            />

        </section>
    );
};


export default CalendarGrid;