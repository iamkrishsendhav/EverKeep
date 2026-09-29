import { CreditCard, Plus, Search, X } from "lucide-react";

// ============================================================================
// SUBSCRIPTION HEADER
// ============================================================================
//
// Responsible for:
// - Page title
// - Subscription count
// - Search
// - Add subscription action
//
// No API calls are made here.
// ============================================================================

const SubscriptionHeader = ({
    count = 0,

    searchQuery = "",
    onSearchChange,

    onAdd,

    disabled = false,
}) => {
    // =========================================================================
    // SEARCH HANDLER
    // =========================================================================

    const handleSearchChange = (event) => {
        onSearchChange?.(event.target.value);
    };

    // =========================================================================
    // CLEAR SEARCH
    // =========================================================================

    const handleClearSearch = () => {
        onSearchChange?.("");
    };

    // =========================================================================
    // RENDER
    // =========================================================================

    return (
        <header
            className="
                w-full
            "
        >
            {/* =================================================================
                TOP ROW
            ================================================================= */}

            <div
                className="
                    flex
                    flex-col
                    gap-4

                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                "
            >
                {/* =============================================================
                    TITLE
                ============================================================= */}

                <div
                    className="
                        flex
                        min-w-0
                        items-start
                        gap-3
                    "
                >
                    {/* ICON */}

                    <div
                        className="
                            flex
                            h-11
                            w-11
                            shrink-0
                            items-center
                            justify-center
                            rounded-2xl
                            bg-indigo-50
                            text-indigo-600
                            ring-1
                            ring-indigo-100
                        "
                    >
                        <CreditCard size={20} strokeWidth={2} />
                    </div>

                    {/* TEXT */}

                    <div
                        className="
                            min-w-0
                        "
                    >
                        <div
                            className="
                                flex
                                flex-wrap
                                items-center
                                gap-2
                            "
                        >
                            <h1
                                className="
                                    text-2xl
                                    font-extrabold
                                    tracking-tight
                                    text-slate-950

                                    sm:text-[28px]
                                "
                            >
                                Subscriptions
                            </h1>

                            {/* COUNT */}

                            <span
                                className="
                                    inline-flex
                                    h-6
                                    min-w-6
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-slate-100
                                    px-2
                                    text-[10px]
                                    font-bold
                                    text-slate-600
                                    ring-1
                                    ring-slate-200
                                "
                            >
                                {count}
                            </span>
                        </div>

                        <p
                            className="
                                mt-1
                                max-w-xl
                                text-xs
                                leading-5
                                text-slate-500

                                sm:text-sm
                            "
                        >
                            Keep track of recurring payments, renewal dates, and subscription
                            spending in one place.
                        </p>
                    </div>
                </div>

                {/* =============================================================
                    ADD BUTTON
                ============================================================= */}

                <button
                    type="button"
                    onClick={onAdd}
                    disabled={disabled}
                    className="
                        inline-flex
                        h-10
                        shrink-0
                        items-center
                        justify-center
                        gap-2
                        self-start
                        rounded-xl
                        bg-slate-950
                        px-4
                        text-xs
                        font-bold
                        text-white
                        shadow-[0_8px_20px_rgba(15,23,42,0.12)]
                        transition-all
                        duration-200

                        hover:-translate-y-0.5
                        hover:bg-slate-800
                        hover:shadow-[0_12px_28px_rgba(15,23,42,0.16)]

                        focus:outline-none
                        focus:ring-4
                        focus:ring-slate-200

                        disabled:pointer-events-none
                        disabled:opacity-50

                        lg:self-auto
                    "
                >
                    <Plus size={16} strokeWidth={2.5} />
                    Add subscription
                </button>
            </div>

            {/* =================================================================
                SEARCH BAR
            ================================================================= */}

            <div
                className="
                    mt-5
                    flex
                    flex-col
                    gap-2

                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >
                {/* SEARCH */}

                <div
                    className="
                        relative
                        w-full

                        sm:max-w-md
                    "
                >
                    {/* SEARCH ICON */}

                    <Search
                        size={16}
                        strokeWidth={2}
                        className="
                            pointer-events-none
                            absolute
                            left-3.5
                            top-1/2
                            -translate-y-1/2
                            text-slate-400
                        "
                    />

                    {/* INPUT */}

                    <input
                        type="search"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="
                            Search subscriptions...
                        "
                        aria-label="
                            Search subscriptions
                        "
                        className="
                            h-10
                            w-full
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            pl-10
                            pr-10
                            text-xs
                            font-medium
                            text-slate-800
                            outline-none
                            placeholder:text-slate-400
                            transition-all
                            duration-200

                            hover:border-slate-300

                            focus:border-indigo-300
                            focus:ring-4
                            focus:ring-indigo-50
                        "
                    />

                    {/* CLEAR */}

                    {searchQuery && (
                        <button
                            type="button"
                            onClick={handleClearSearch}
                            aria-label="
                                Clear subscription search
                            "
                            className="
                                absolute
                                right-2
                                top-1/2
                                flex
                                h-7
                                w-7
                                -translate-y-1/2
                                items-center
                                justify-center
                                rounded-lg
                                text-slate-400
                                transition-colors

                                hover:bg-slate-100
                                hover:text-slate-700

                                focus:outline-none
                                focus:ring-2
                                focus:ring-indigo-100
                            "
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>

                {/* HELPER TEXT */}

                <p
                    className="
                        hidden
                        text-[10px]
                        font-medium
                        text-slate-400

                        sm:block
                    "
                >
                    Search by name, provider, or plan
                </p>
            </div>
        </header>
    );
};

export default SubscriptionHeader;
