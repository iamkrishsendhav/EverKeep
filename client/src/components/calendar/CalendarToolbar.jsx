import {
    CalendarDays,
    ChevronDown,
    Filter,
    List,
    RotateCcw,
    SlidersHorizontal,
} from "lucide-react";


// ============================================================================
// VIEW OPTIONS
// ============================================================================

const VIEW_OPTIONS = [
    {
        value: "month",
        label: "Month",
        icon: CalendarDays,
    },
    {
        value: "agenda",
        label: "Agenda",
        icon: List,
    },
];


// ============================================================================
// EVENT TYPE OPTIONS
// ============================================================================

const EVENT_TYPE_OPTIONS = [
    {
        value: "all",
        label: "All types",
    },
    {
        value: "warranty",
        label: "Warranty",
    },
    {
        value: "insurance",
        label: "Insurance",
    },
    {
        value: "subscription",
        label: "Subscription",
    },
    {
        value: "payment",
        label: "Payment",
    },
    {
        value: "maintenance",
        label: "Maintenance",
    },
    {
        value: "custom",
        label: "Custom",
    },
];


// ============================================================================
// STATUS OPTIONS
// ============================================================================

const STATUS_OPTIONS = [
    {
        value: "all",
        label: "All statuses",
    },
    {
        value: "upcoming",
        label: "Upcoming",
    },
    {
        value: "today",
        label: "Today",
    },
    {
        value: "overdue",
        label: "Overdue",
    },
    {
        value: "completed",
        label: "Completed",
    },
    {
        value: "cancelled",
        label: "Cancelled",
    },
];


// ============================================================================
// PRIORITY OPTIONS
// ============================================================================

const PRIORITY_OPTIONS = [
    {
        value: "all",
        label: "All priorities",
    },
    {
        value: "low",
        label: "Low",
    },
    {
        value: "medium",
        label: "Medium",
    },
    {
        value: "high",
        label: "High",
    },
];


// ============================================================================
// FILTER SELECT
// ============================================================================

const FilterSelect = ({
    label,
    value,
    options,
    onChange,
}) => {

    const isActive =
        value !== "all";


    return (
        <label
            className="
                group
                relative
                block
                h-9
                min-w-0
                sm:min-w-[130px]
            "
        >

            {/* Accessible label */}

            <span className="sr-only">
                {label}
            </span>


            <select
                value={
                    value
                }
                onChange={(
                    event
                ) =>
                    onChange?.(
                        event.target.value
                    )
                }
                aria-label={
                    label
                }
                className={`
                    h-full
                    w-full
                    cursor-pointer
                    appearance-none
                    rounded-xl
                    border
                    pl-3
                    pr-8
                    text-[11px]
                    font-semibold
                    outline-none
                    transition-all
                    duration-200

                    ${
                        isActive
                            ? `
                                border-indigo-200
                                bg-indigo-50
                                text-indigo-700
                              `
                            : `
                                border-slate-200
                                bg-white
                                text-slate-600
                                hover:border-slate-300
                              `
                    }

                    focus:border-indigo-400
                    focus:ring-4
                    focus:ring-indigo-50
                `}
            >

                {options.map(
                    (
                        option
                    ) => (

                        <option
                            key={
                                option.value
                            }
                            value={
                                option.value
                            }
                        >
                            {option.label}
                        </option>

                    )
                )}

            </select>


            {/* Active indicator */}

            {isActive && (

                <span
                    aria-hidden="true"
                    className="
                        pointer-events-none
                        absolute
                        left-2
                        top-1/2
                        h-1.5
                        w-1.5
                        -translate-y-1/2
                        rounded-full
                        bg-indigo-500
                    "
                />

            )}


            <ChevronDown
                size={13}
                className="
                    pointer-events-none
                    absolute
                    right-2.5
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                    transition-transform
                    group-focus-within:text-indigo-500
                "
            />

        </label>
    );
};


// ============================================================================
// CALENDAR TOOLBAR
// ============================================================================

const CalendarToolbar = ({
    view = "month",
    onViewChange,

    type = "all",
    onTypeChange,

    status = "all",
    onStatusChange,

    priority = "all",
    onPriorityChange,

    onClearFilters,
}) => {

    // =========================================================================
    // ACTIVE FILTER COUNT
    // =========================================================================

    const activeFilterCount = [
        type !== "all",
        status !== "all",
        priority !== "all",
    ].filter(Boolean).length;


    const hasFilters =
        activeFilterCount > 0;


    // =========================================================================
    // RENDER
    // =========================================================================

    return (

        <section
            aria-label="Calendar controls"
            className="
                w-full
                rounded-2xl
                border
                border-slate-200/80
                bg-white
                p-3
                shadow-[0_8px_30px_rgba(15,23,42,0.035)]

                sm:p-3.5
            "
        >

            {/* =================================================================
                MAIN TOOLBAR
            ================================================================= */}

            <div
                className="
                    flex
                    flex-col
                    gap-3

                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                "
            >

                {/* =============================================================
                    LEFT — VIEW
                ============================================================= */}

                <div
                    className="
                        flex
                        min-w-0
                        items-center
                        justify-between
                        gap-3
                    "
                >

                    {/* VIEW LABEL */}

                    <div
                        className="
                            hidden
                            items-center
                            gap-2.5

                            sm:flex
                        "
                    >

                        <div
                            className="
                                flex
                                h-8
                                w-8
                                items-center
                                justify-center
                                rounded-lg
                                bg-indigo-50
                                text-indigo-600
                            "
                        >

                            <Filter
                                size={14}
                                strokeWidth={2.2}
                            />

                        </div>


                        <div>

                            <p
                                className="
                                    text-[11px]
                                    font-bold
                                    text-slate-800
                                "
                            >
                                Calendar view
                            </p>

                            <p
                                className="
                                    text-[9px]
                                    font-medium
                                    text-slate-400
                                "
                            >
                                Organize your events
                            </p>

                        </div>

                    </div>


                    {/* VIEW SWITCHER */}

                    <div
                        className="
                            flex
                            items-center
                            rounded-xl
                            border
                            border-slate-200
                            bg-slate-50
                            p-1
                        "
                    >

                        {VIEW_OPTIONS.map(
                            (
                                option
                            ) => {

                                const Icon =
                                    option.icon;


                                const active =
                                    view ===
                                    option.value;


                                return (

                                    <button
                                        key={
                                            option.value
                                        }
                                        type="button"
                                        onClick={() =>
                                            onViewChange?.(
                                                option.value
                                            )
                                        }
                                        aria-pressed={
                                            active
                                        }
                                        className={`
                                            inline-flex
                                            h-8
                                            items-center
                                            justify-center
                                            gap-1.5
                                            rounded-lg
                                            px-3
                                            text-[11px]
                                            font-bold
                                            transition-all
                                            duration-200

                                            ${
                                                active
                                                    ? `
                                                        bg-white
                                                        text-indigo-600
                                                        shadow-[0_2px_8px_rgba(15,23,42,0.07)]
                                                      `
                                                    : `
                                                        text-slate-500
                                                        hover:text-slate-800
                                                      `
                                            }

                                            focus:outline-none
                                            focus:ring-2
                                            focus:ring-indigo-100
                                        `}
                                    >

                                        <Icon
                                            size={13}
                                            strokeWidth={2.2}
                                        />

                                        <span>
                                            {
                                                option.label
                                            }
                                        </span>

                                    </button>

                                );
                            }
                        )}

                    </div>

                </div>


                {/* =============================================================
                    RIGHT — FILTERS
                ============================================================= */}

                <div
                    className="
                        flex
                        min-w-0
                        flex-wrap
                        items-center
                        gap-2
                    "
                >

                    {/* FILTER LABEL */}

                    <div
                        className="
                            mr-0.5
                            hidden
                            items-center
                            gap-1.5

                            lg:flex
                        "
                    >

                        <SlidersHorizontal
                            size={13}
                            className="
                                text-slate-400
                            "
                        />

                        <span
                            className="
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[0.12em]
                                text-slate-400
                            "
                        >
                            Filters
                        </span>

                    </div>


                    {/* TYPE */}

                    <FilterSelect
                        label="Event type"
                        value={
                            type
                        }
                        options={
                            EVENT_TYPE_OPTIONS
                        }
                        onChange={
                            onTypeChange
                        }
                    />


                    {/* STATUS */}

                    <FilterSelect
                        label="Status"
                        value={
                            status
                        }
                        options={
                            STATUS_OPTIONS
                        }
                        onChange={
                            onStatusChange
                        }
                    />


                    {/* PRIORITY */}

                    <FilterSelect
                        label="Priority"
                        value={
                            priority
                        }
                        options={
                            PRIORITY_OPTIONS
                        }
                        onChange={
                            onPriorityChange
                        }
                    />


                    {/* =========================================================
                        CLEAR FILTERS
                    ========================================================= */}

                    {hasFilters && (

                        <button
                            type="button"
                            onClick={
                                onClearFilters
                            }
                            aria-label="Clear active filters"
                            className="
                                inline-flex
                                h-9
                                shrink-0
                                items-center
                                justify-center
                                gap-1.5
                                rounded-xl
                                border
                                border-rose-100
                                bg-rose-50
                                px-2.5
                                text-[10px]
                                font-bold
                                text-rose-600
                                transition-all
                                duration-200

                                hover:border-rose-200
                                hover:bg-rose-100
                                hover:text-rose-700

                                focus:outline-none
                                focus:ring-4
                                focus:ring-rose-50
                            "
                        >

                            <RotateCcw
                                size={12}
                                strokeWidth={2.3}
                            />

                            <span>
                                Clear
                            </span>


                            <span
                                className="
                                    flex
                                    h-4.5
                                    min-w-4.5
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-white
                                    px-1
                                    text-[9px]
                                    font-extrabold
                                    text-rose-600
                                    shadow-sm
                                "
                            >
                                {
                                    activeFilterCount
                                }
                            </span>

                        </button>

                    )}

                </div>

            </div>


            {/* =================================================================
                ACTIVE FILTER SUMMARY
            ================================================================= */}

            {hasFilters && (

                <div
                    className="
                        mt-3
                        flex
                        items-center
                        gap-2
                        border-t
                        border-slate-100
                        pt-2.5
                    "
                >

                    <span
                        className="
                            text-[10px]
                            font-medium
                            text-slate-400
                        "
                    >
                        Active:
                    </span>


                    {type !== "all" && (

                        <FilterBadge
                            label={
                                EVENT_TYPE_OPTIONS.find(
                                    (item) =>
                                        item.value ===
                                        type
                                )?.label ||
                                type
                            }
                        />

                    )}


                    {status !== "all" && (

                        <FilterBadge
                            label={
                                STATUS_OPTIONS.find(
                                    (item) =>
                                        item.value ===
                                        status
                                )?.label ||
                                status
                            }
                        />

                    )}


                    {priority !== "all" && (

                        <FilterBadge
                            label={
                                PRIORITY_OPTIONS.find(
                                    (item) =>
                                        item.value ===
                                        priority
                                )?.label ||
                                priority
                            }
                        />

                    )}

                </div>

            )}

        </section>
    );
};


// ============================================================================
// FILTER BADGE
// ============================================================================

const FilterBadge = ({
    label,
}) => {

    return (

        <span
            className="
                inline-flex
                items-center
                rounded-full
                bg-indigo-50
                px-2
                py-1
                text-[9px]
                font-bold
                text-indigo-600
            "
        >
            {label}
        </span>

    );
};


export default CalendarToolbar;
