import {
    CalendarDays,
    Plus,
    Sparkles,
} from "lucide-react";


// ============================================================================
// CALENDAR EMPTY STATE
// ============================================================================
//
// Reusable empty state for the Calendar module.
//
// Responsibilities:
// - Explain why there is nothing to show
// - Provide a clear primary action
// - Support filtered and completely empty states
//
// No API calls.
// ============================================================================

const CalendarEmptyState = ({
    title = "Your calendar is clear",
    description = "There are no events scheduled for this period.",
    actionLabel = "Add event",
    onAction,
    filtered = false,
}) => {

    // =========================================================================
    // RENDER
    // =========================================================================

    return (

        <div
            className="
                flex
                min-h-[360px]
                items-center
                justify-center
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
                    max-w-md
                    flex-col
                    items-center
                    text-center
                "
            >

                {/* =============================================================
                    ICON
                ============================================================= */}

                <div className="relative">

                    <div
                        className="
                            flex
                            h-16
                            w-16
                            items-center
                            justify-center
                            rounded-[1.4rem]
                            bg-indigo-50
                            text-[#5B4BFF]
                        "
                    >

                        <CalendarDays
                            size={28}
                            strokeWidth={1.8}
                        />

                    </div>


                    <div
                        className="
                            absolute
                            -right-2
                            -top-2
                            flex
                            h-7
                            w-7
                            items-center
                            justify-center
                            rounded-lg
                            border
                            border-white
                            bg-white
                            text-indigo-500
                            shadow-sm
                        "
                    >

                        <Sparkles
                            size={13}
                        />

                    </div>

                </div>


                {/* =============================================================
                    TEXT
                ============================================================= */}

                <p
                    className="
                        mt-6
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[0.18em]
                        text-indigo-500
                    "
                >
                    Calendar
                </p>


                <h2
                    className="
                        mt-2
                        text-xl
                        font-bold
                        tracking-tight
                        text-slate-950
                    "
                >
                    {title}
                </h2>


                <p
                    className="
                        mt-2
                        max-w-sm
                        text-sm
                        leading-6
                        text-slate-500
                    "
                >
                    {description}
                </p>


                {/* =============================================================
                    FILTERED MESSAGE
                ============================================================= */}

                {filtered && (

                    <div
                        className="
                            mt-4
                            rounded-xl
                            border
                            border-amber-100
                            bg-amber-50
                            px-3
                            py-2
                            text-xs
                            font-medium
                            text-amber-700
                        "
                    >
                        No events match the current
                        filters.
                    </div>

                )}


                {/* =============================================================
                    ACTION
                ============================================================= */}

                {onAction && (

                    <button
                        type="button"
                        onClick={onAction}
                        className="
                            mt-6
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
                            duration-200
                            hover:-translate-y-0.5
                            hover:bg-indigo-600
                            focus:outline-none
                            focus:ring-4
                            focus:ring-indigo-100
                        "
                    >

                        <Plus
                            size={17}
                            strokeWidth={2.5}
                        />

                        {actionLabel}

                    </button>

                )}

            </div>

        </div>
    );
};


export default CalendarEmptyState;