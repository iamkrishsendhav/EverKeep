import {
    Activity,
    CalendarClock,
    CreditCard,
    IndianRupee,
} from "lucide-react";


// ============================================================================
// HELPERS
// ============================================================================

const formatCurrency = (
    value,
    currency = "INR"
) => {

    const amount =
        Number(value) || 0;

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency,
            maximumFractionDigits: 0,
        }
    ).format(amount);
};


// ============================================================================
// STAT CARD
// ============================================================================

const StatCard = ({
    icon: Icon,
    label,
    value,
    helper,
    iconClassName,
    valueClassName = "text-slate-950",
}) => {

    return (
        <article
            className="
                group
                relative
                overflow-hidden
                rounded-2xl
                border
                border-slate-200/80
                bg-white
                p-4
                shadow-[0_8px_25px_rgba(15,23,42,0.035)]
                transition-all
                duration-300

                hover:-translate-y-0.5
                hover:border-slate-300
                hover:shadow-[0_16px_40px_rgba(15,23,42,0.07)]
            "
        >

            {/* ================================================================
                TOP ACCENT
            ================================================================ */}

            <div
                className="
                    pointer-events-none
                    absolute
                    inset-x-6
                    top-0
                    h-px
                    bg-gradient-to-r
                    from-transparent
                    via-indigo-400/60
                    to-transparent
                    opacity-0
                    transition-opacity
                    duration-300
                    group-hover:opacity-100
                "
            />


            {/* ================================================================
                CONTENT
            ================================================================ */}

            <div
                className="
                    flex
                    items-start
                    justify-between
                    gap-3
                "
            >

                {/* ------------------------------------------------------------
                    TEXT
                ------------------------------------------------------------ */}

                <div
                    className="
                        min-w-0
                        flex-1
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
                        className={`
                            mt-2
                            truncate
                            text-2xl
                            font-extrabold
                            tracking-tight
                            ${valueClassName}
                        `}
                    >
                        {value}
                    </p>


                    {helper && (

                        <p
                            className="
                                mt-1
                                truncate
                                text-[10px]
                                font-medium
                                text-slate-400
                            "
                        >
                            {helper}
                        </p>

                    )}

                </div>


                {/* ------------------------------------------------------------
                    ICON
                ------------------------------------------------------------ */}

                <div
                    className={`
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        ring-1
                        transition-transform
                        duration-300
                        group-hover:scale-105
                        ${iconClassName}
                    `}
                >

                    <Icon
                        size={18}
                        strokeWidth={2}
                    />

                </div>

            </div>

        </article>
    );
};


// ============================================================================
// SKELETON CARD
// ============================================================================

const StatsSkeleton = () => {

    return (
        <div
            className="
                rounded-2xl
                border
                border-slate-200/80
                bg-white
                p-4
                shadow-[0_8px_25px_rgba(15,23,42,0.035)]
            "
            aria-hidden="true"
        >

            <div
                className="
                    flex
                    items-start
                    justify-between
                    gap-3
                "
            >

                <div
                    className="
                        flex-1
                        space-y-2.5
                    "
                >

                    {/* Label */}

                    <div
                        className="
                            h-2.5
                            w-24
                            animate-pulse
                            rounded-full
                            bg-slate-100
                        "
                    />


                    {/* Value */}

                    <div
                        className="
                            h-7
                            w-16
                            animate-pulse
                            rounded-lg
                            bg-slate-100
                        "
                    />


                    {/* Helper */}

                    <div
                        className="
                            h-2
                            w-32
                            animate-pulse
                            rounded-full
                            bg-slate-100
                        "
                    />

                </div>


                {/* Icon */}

                <div
                    className="
                        h-10
                        w-10
                        animate-pulse
                        rounded-xl
                        bg-slate-100
                    "
                />

            </div>

        </div>
    );
};


// ============================================================================
// SUBSCRIPTION STATS
// ============================================================================

const SubscriptionStats = ({
    stats = {},
    loading = false,
}) => {

    // =========================================================================
    // SAFE VALUES
    // =========================================================================

    const total =
        Number(
            stats?.total
        ) || 0;


    const active =
        Number(
            stats?.active
        ) || 0;


    const upcoming =
        Number(
            stats?.upcoming
        ) || 0;


    const monthlyCost =
        Number(
            stats?.monthlyCost
        ) || 0;


    // =========================================================================
    // ACTIVE PERCENTAGE
    // =========================================================================

    const activePercentage =
        total > 0
            ? Math.round(
                (active / total) * 100
            )
            : 0;


    // =========================================================================
    // LOADING
    // =========================================================================

    if (loading) {

        return (
            <section
                aria-label="
                    Loading subscription statistics
                "
            >

                <div
                    className="
                        grid
                        grid-cols-1
                        gap-3

                        sm:grid-cols-2

                        xl:grid-cols-4
                    "
                >

                    {Array.from({
                        length: 4,
                    }).map(
                        (_, index) => (

                            <StatsSkeleton
                                key={index}
                            />

                        )
                    )}

                </div>

            </section>
        );
    }


    // =========================================================================
    // RENDER
    // =========================================================================

    return (
        <section
            aria-label="
                Subscription statistics
            "
        >

            <div
                className="
                    grid
                    grid-cols-1
                    gap-3

                    sm:grid-cols-2

                    xl:grid-cols-4
                "
            >

                {/* =============================================================
                    TOTAL
                ============================================================= */}

                <StatCard
                    icon={CreditCard}
                    label="Total subscriptions"
                    value={total}
                    helper="All tracked subscriptions"
                    iconClassName="
                        bg-indigo-50
                        text-indigo-600
                        ring-indigo-100
                    "
                />


                {/* =============================================================
                    ACTIVE
                ============================================================= */}

                <StatCard
                    icon={Activity}
                    label="Active"
                    value={active}
                    helper={
                        total > 0
                            ? `${activePercentage}% currently active`
                            : "No active subscriptions"
                    }
                    iconClassName="
                        bg-emerald-50
                        text-emerald-600
                        ring-emerald-100
                    "
                    valueClassName="
                        text-emerald-700
                    "
                />


                {/* =============================================================
                    MONTHLY COST
                ============================================================= */}

                <StatCard
                    icon={IndianRupee}
                    label="Monthly cost"
                    value={
                        formatCurrency(
                            monthlyCost
                        )
                    }
                    helper="
                        Estimated recurring spend
                    "
                    iconClassName="
                        bg-violet-50
                        text-violet-600
                        ring-violet-100
                    "
                />


                {/* =============================================================
                    UPCOMING
                ============================================================= */}

                <StatCard
                    icon={CalendarClock}
                    label="Upcoming"
                    value={upcoming}
                    helper="
                        Billing within 30 days
                    "
                    iconClassName="
                        bg-amber-50
                        text-amber-600
                        ring-amber-100
                    "
                    valueClassName={
                        upcoming > 0
                            ? "text-amber-700"
                            : "text-slate-950"
                    }
                />

            </div>

        </section>
    );
};


export default SubscriptionStats;