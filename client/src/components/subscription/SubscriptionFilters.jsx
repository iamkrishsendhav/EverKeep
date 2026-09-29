import { Check, ChevronDown, Filter, RotateCcw } from "lucide-react";

import {
    BILLING_CYCLES,
    SUBSCRIPTION_CATEGORIES,
    SUBSCRIPTION_STATUSES,
} from "./subscriptionHelpers";

// ============================================================================
// SELECT FIELD
// ============================================================================

const FilterSelect = ({ label, value, options, onChange }) => {
    return (
        <label
            className="
                relative
                block
                min-w-0
            "
        >
            <span
                className="
                    mb-1.5
                    block
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.12em]
                    text-slate-400
                "
            >
                {label}
            </span>

            <div
                className="
                    relative
                "
            >
                <select
                    value={value}
                    onChange={(event) => onChange?.(event.target.value)}
                    className="
                        h-9
                        w-full
                        appearance-none
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        px-3
                        pr-9
                        text-[11px]
                        font-semibold
                        text-slate-700
                        outline-none
                        transition-all
                        duration-200

                        hover:border-slate-300

                        focus:border-indigo-300
                        focus:ring-4
                        focus:ring-indigo-50
                    "
                >
                    <option value="all">All</option>

                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                <ChevronDown
                    size={14}
                    className="
                        pointer-events-none
                        absolute
                        right-3
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                    "
                />
            </div>
        </label>
    );
};

// ============================================================================
// SUBSCRIPTION FILTERS
// ============================================================================

const SubscriptionFilters = ({
    filters = {},

    onFilterChange,
    onClear,

    resultCount = 0,

    hasActiveFilters = false,
}) => {
    // =========================================================================
    // HANDLER
    // =========================================================================

    const handleChange = (key, value) => {
        onFilterChange?.({
            ...filters,
            [key]: value,
        });
    };

    // =========================================================================
    // RENDER
    // =========================================================================

    return (
        <section
            className="
                rounded-2xl
                border
                border-slate-200/80
                bg-white
                p-3
                shadow-[0_6px_22px_rgba(15,23,42,0.025)]
            "
            aria-label="
                Subscription filters
            "
        >
            <div
                className="
                    flex
                    flex-col
                    gap-3

                    xl:flex-row
                    xl:items-end
                "
            >
                {/* =============================================================
                    FILTER LABEL
                ============================================================= */}

                <div
                    className="
                        flex
                        shrink-0
                        items-center
                        gap-2
                        xl:pb-0.5
                    "
                >
                    <div
                        className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-xl
                            bg-slate-100
                            text-slate-500
                        "
                    >
                        <Filter size={14} />
                    </div>

                    <div>
                        <p
                            className="
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[0.12em]
                                text-slate-500
                            "
                        >
                            Filters
                        </p>

                        <p
                            className="
                                text-[9px]
                                font-medium
                                text-slate-400
                            "
                        >
                            Refine your subscriptions
                        </p>
                    </div>
                </div>

                {/* =============================================================
                    FILTERS
                ============================================================= */}

                <div
                    className="
                        grid
                        flex-1
                        grid-cols-1
                        gap-2

                        sm:grid-cols-3
                    "
                >
                    {/* STATUS */}

                    <FilterSelect
                        label="Status"
                        value={filters.status || "all"}
                        options={SUBSCRIPTION_STATUSES}
                        onChange={(value) => handleChange("status", value)}
                    />

                    {/* CATEGORY */}

                    <FilterSelect
                        label="Category"
                        value={filters.category || "all"}
                        options={SUBSCRIPTION_CATEGORIES}
                        onChange={(value) => handleChange("category", value)}
                    />

                    {/* BILLING CYCLE */}

                    <FilterSelect
                        label="Billing cycle"
                        value={filters.billingCycle || "all"}
                        options={BILLING_CYCLES}
                        onChange={(value) => handleChange("billingCycle", value)}
                    />
                </div>

                {/* =============================================================
                    RESULT COUNT + CLEAR
                ============================================================= */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        gap-2

                        sm:justify-end

                        xl:pb-0.5
                    "
                >
                    {/* RESULT COUNT */}

                    <div
                        className="
                            inline-flex
                            items-center
                            gap-1.5
                            rounded-lg
                            bg-slate-50
                            px-2.5
                            py-2
                            text-[9px]
                            font-bold
                            text-slate-500
                            ring-1
                            ring-slate-100
                        "
                    >
                        <Check
                            size={11}
                            className="
                                text-emerald-500
                            "
                        />
                        {resultCount} results
                    </div>

                    {/* CLEAR */}

                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={onClear}
                            className="
                                inline-flex
                                h-9
                                items-center
                                justify-center
                                gap-1.5
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                px-3
                                text-[10px]
                                font-bold
                                text-slate-500
                                transition-all
                                duration-200

                                hover:border-slate-300
                                hover:bg-slate-50
                                hover:text-slate-800

                                focus:outline-none
                                focus:ring-4
                                focus:ring-slate-100
                            "
                        >
                            <RotateCcw size={12} />
                            Clear
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
};

export default SubscriptionFilters;
