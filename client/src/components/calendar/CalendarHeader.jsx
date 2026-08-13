import {
    ChevronLeft,
    ChevronRight,
    Plus,
    CalendarDays,
    List,
    RotateCcw,
} from "lucide-react";

import {
    formatMonthTitle,
} from "./calendarHelpers";


// ============================================================================
// EVERKEEP — CALENDAR HEADER
// ============================================================================
//
// Responsibilities:
// - Show current month / year
// - Previous / next month navigation
// - Today navigation
// - Month / Agenda view switch
// - Add event action
//
// No API calls.
// No calendar data fetching.
// ============================================================================


const CalendarHeader = ({
    currentDate,
    view = "month",

    onPrevious,
    onNext,
    onToday,

    onViewChange,
    onAddEvent,

    className = "",
}) => {

    // =========================================================================
    // SAFETY
    // =========================================================================

    if (!currentDate) {
        return null;
    }


    // =========================================================================
    // MONTH TITLE
    // =========================================================================

    const monthTitle =
        formatMonthTitle(
            currentDate
        );


    // =========================================================================
    // VIEW CHANGE
    // =========================================================================

    const handleViewChange = (
        nextView
    ) => {

        if (
            nextView === view
        ) {
            return;
        }

        onViewChange?.(
            nextView
        );
    };


    // =========================================================================
    // RENDER
    // =========================================================================

    return (

        <header
            className={`
                flex
                flex-col
                gap-4
                border-b
                border-slate-200/80
                bg-white
                px-4
                py-4

                sm:px-5
                lg:px-6

                ${className}
            `}
        >

            {/* =================================================================
                TOP ROW
            ================================================================= */}

            <div
                className="
                    flex
                    flex-col
                    gap-3

                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >

                {/* -------------------------------------------------------------
                    TITLE + NAVIGATION
                ------------------------------------------------------------- */}

                <div
                    className="
                        flex
                        min-w-0
                        items-center
                        gap-3
                    "
                >

                    {/* CALENDAR ICON */}

                    <div
                        className="
                            hidden
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-indigo-50
                            text-indigo-600

                            sm:flex
                        "
                    >

                        <CalendarDays
                            size={19}
                            strokeWidth={2}
                        />

                    </div>


                    {/* TITLE */}

                    <div
                        className="
                            min-w-0
                        "
                    >

                        <p
                            className="
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[0.16em]
                                text-indigo-500
                            "
                        >
                            EverKeep Calendar
                        </p>

                        <h1
                            className="
                                truncate
                                text-xl
                                font-bold
                                tracking-tight
                                text-slate-950

                                sm:text-2xl
                            "
                        >
                            {monthTitle}
                        </h1>

                    </div>


                    {/* ---------------------------------------------------------
                        MONTH NAVIGATION
                    --------------------------------------------------------- */}

                    <div
                        className="
                            ml-1
                            flex
                            items-center
                            rounded-xl
                            border
                            border-slate-200
                            bg-slate-50/70
                            p-0.5
                        "
                    >

                        {/* PREVIOUS */}

                        <button
                            type="button"
                            onClick={
                                onPrevious
                            }
                            aria-label="
                                Previous month
                            "
                            title="
                                Previous month
                            "
                            className="
                                flex
                                h-8
                                w-8
                                items-center
                                justify-center
                                rounded-lg
                                text-slate-500
                                transition

                                hover:bg-white
                                hover:text-slate-900
                                hover:shadow-sm

                                focus:outline-none
                                focus:ring-4
                                focus:ring-indigo-50
                            "
                        >

                            <ChevronLeft
                                size={17}
                            />

                        </button>


                        {/* NEXT */}

                        <button
                            type="button"
                            onClick={
                                onNext
                            }
                            aria-label="
                                Next month
                            "
                            title="
                                Next month
                            "
                            className="
                                flex
                                h-8
                                w-8
                                items-center
                                justify-center
                                rounded-lg
                                text-slate-500
                                transition

                                hover:bg-white
                                hover:text-slate-900
                                hover:shadow-sm

                                focus:outline-none
                                focus:ring-4
                                focus:ring-indigo-50
                            "
                        >

                            <ChevronRight
                                size={17}
                            />

                        </button>

                    </div>


                    {/* ---------------------------------------------------------
                        TODAY
                    --------------------------------------------------------- */}

                    <button
                        type="button"
                        onClick={
                            onToday
                        }
                        className="
                            hidden
                            h-9
                            items-center
                            gap-1.5
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            px-3
                            text-xs
                            font-semibold
                            text-slate-600
                            transition

                            hover:border-indigo-200
                            hover:bg-indigo-50
                            hover:text-indigo-600

                            focus:outline-none
                            focus:ring-4
                            focus:ring-indigo-50

                            sm:flex
                        "
                    >

                        <RotateCcw
                            size={13}
                        />

                        Today

                    </button>

                </div>


                {/* -------------------------------------------------------------
                    ACTIONS
                ------------------------------------------------------------- */}

                <div
                    className="
                        flex
                        items-center
                        gap-2
                    "
                >

                    {/* MOBILE TODAY */}

                    <button
                        type="button"
                        onClick={
                            onToday
                        }
                        className="
                            flex
                            h-10
                            items-center
                            gap-1.5
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            px-3
                            text-xs
                            font-semibold
                            text-slate-600
                            transition

                            hover:border-indigo-200
                            hover:bg-indigo-50
                            hover:text-indigo-600

                            sm:hidden
                        "
                    >

                        <RotateCcw
                            size={13}
                        />

                        Today

                    </button>


                    {/* ADD EVENT */}

                    <button
                        type="button"
                        onClick={
                            onAddEvent
                        }
                        className="
                            inline-flex
                            h-10
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-indigo-600
                            px-3.5
                            text-xs
                            font-bold
                            text-white
                            shadow-[0_8px_20px_rgba(79,70,229,0.20)]
                            transition-all
                            duration-200

                            hover:-translate-y-0.5
                            hover:bg-indigo-700
                            hover:shadow-[0_12px_24px_rgba(79,70,229,0.25)]

                            focus:outline-none
                            focus:ring-4
                            focus:ring-indigo-100
                        "
                    >

                        <Plus
                            size={15}
                            strokeWidth={2.5}
                        />

                        <span className="
                            hidden
                            sm:inline
                        ">
                            Add event
                        </span>

                        <span className="
                            sm:hidden
                        ">
                            Add
                        </span>

                    </button>

                </div>

            </div>


            {/* =================================================================
                BOTTOM ROW — VIEW SWITCHER
            ================================================================= */}

            <div
                className="
                    flex
                    items-center
                    justify-between
                    gap-3
                "
            >

                {/* VIEW SWITCHER */}

                <div
                    className="
                        inline-flex
                        items-center
                        rounded-xl
                        border
                        border-slate-200
                        bg-slate-50
                        p-1
                    "
                >

                    {/* MONTH */}

                    <button
                        type="button"
                        onClick={() =>
                            handleViewChange(
                                "month"
                            )
                        }
                        className={`
                            inline-flex
                            h-8
                            items-center
                            gap-1.5
                            rounded-lg
                            px-3
                            text-xs
                            font-semibold
                            transition-all

                            ${
                                view === "month"
                                    ? `
                                        bg-white
                                        text-slate-900
                                        shadow-sm
                                      `
                                    : `
                                        text-slate-500
                                        hover:text-slate-800
                                      `
                            }
                        `}
                    >

                        <CalendarDays
                            size={13}
                        />

                        Month

                    </button>


                    {/* AGENDA */}

                    <button
                        type="button"
                        onClick={() =>
                            handleViewChange(
                                "agenda"
                            )
                        }
                        className={`
                            inline-flex
                            h-8
                            items-center
                            gap-1.5
                            rounded-lg
                            px-3
                            text-xs
                            font-semibold
                            transition-all

                            ${
                                view === "agenda"
                                    ? `
                                        bg-white
                                        text-slate-900
                                        shadow-sm
                                      `
                                    : `
                                        text-slate-500
                                        hover:text-slate-800
                                      `
                            }
                        `}
                    >

                        <List
                            size={13}
                        />

                        Agenda

                    </button>

                </div>


                {/* SMALL HELPER TEXT */}

                <p
                    className="
                        hidden
                        text-[11px]
                        font-medium
                        text-slate-400

                        md:block
                    "
                >
                    Plan and track what matters
                </p>

            </div>

        </header>
    );
};


export default CalendarHeader;