import { useMemo } from "react";


// ============================================================================
// AI SUMMARY
// ============================================================================
//
// Clean, minimal summary panel for the EverKeep AI workspace.
//
// Responsibilities:
// - Display AI-generated overview
// - Show key metrics
// - Show concise insights
// - Support loading / empty states
// - Remain presentation-only
//
// This component does NOT:
// - Fetch data
// - Call APIs
// - Manage chat state
// - Modify EverKeep data
//
// ============================================================================


// ============================================================================
// ICONS
// ============================================================================

const SparklesIcon = ({ size = 18 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
    >
        <path
            d="M12 3L13.35 8.65L19 10L13.35 11.35L12 17L10.65 11.35L5 10L10.65 8.65L12 3Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
        />

        <path
            d="M19 15L19.7 17.3L22 18L19.7 18.7L19 21L18.3 18.7L16 18L18.3 17.3L19 15Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
        />
    </svg>
);


const ArrowUpRightIcon = ({ size = 15 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
    >
        <path
            d="M7 17L17 7"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
        />

        <path
            d="M8 7H17V16"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);


const CheckIcon = ({ size = 15 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
    >
        <path
            d="M5 12.5L9.5 17L19 7.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);


// ============================================================================
// LOADING SKELETON
// ============================================================================

const SummarySkeleton = () => (
    <div className="animate-pulse space-y-5">

        <div className="flex items-center gap-3">

            <div className="h-9 w-9 rounded-xl bg-slate-200" />

            <div className="space-y-2">
                <div className="h-3 w-28 rounded bg-slate-200" />
                <div className="h-2.5 w-40 rounded bg-slate-100" />
            </div>

        </div>


        <div className="space-y-2">

            <div className="h-3 w-full rounded bg-slate-100" />

            <div className="h-3 w-[92%] rounded bg-slate-100" />

            <div className="h-3 w-[76%] rounded bg-slate-100" />

        </div>


        <div className="grid grid-cols-2 gap-3">

            <div className="h-20 rounded-2xl bg-slate-100" />

            <div className="h-20 rounded-2xl bg-slate-100" />

        </div>

    </div>
);


// ============================================================================
// EMPTY STATE
// ============================================================================

const EmptySummary = () => (
    <div className="flex min-h-[220px] flex-col items-center justify-center px-6 py-10 text-center">

        <div
            className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-2xl
                border
                border-slate-200
                bg-slate-50
                text-slate-500
            "
        >
            <SparklesIcon size={19} />
        </div>


        <h3
            className="
                mt-4
                text-sm
                font-semibold
                tracking-tight
                text-slate-900
            "
        >
            No AI summary yet
        </h3>


        <p
            className="
                mt-1.5
                max-w-xs
                text-xs
                leading-5
                text-slate-500
            "
        >
            Add some EverKeep data or start a conversation with AI to generate
            useful insights.
        </p>

    </div>
);


// ============================================================================
// STAT CARD
// ============================================================================

const SummaryStat = ({
    label,
    value,
    hint,
}) => (
    <div
        className="
            rounded-2xl
            border
            border-slate-200/80
            bg-slate-50/70
            px-4
            py-3.5
        "
    >

        <p
            className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.16em]
                text-slate-400
            "
        >
            {label}
        </p>


        <p
            className="
                mt-1
                text-xl
                font-semibold
                tracking-tight
                text-slate-900
            "
        >
            {value}
        </p>


        {hint ? (
            <p
                className="
                    mt-0.5
                    truncate
                    text-[11px]
                    text-slate-500
                "
            >
                {hint}
            </p>
        ) : null}

    </div>
);


// ============================================================================
// INSIGHT ITEM
// ============================================================================

const InsightItem = ({
    children,
}) => (
    <div className="flex items-start gap-2.5">

        <span
            className="
                mt-0.5
                flex
                h-5
                w-5
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-slate-100
                text-slate-600
            "
        >
            <CheckIcon size={12} />
        </span>


        <p
            className="
                text-xs
                leading-5
                text-slate-600
            "
        >
            {children}
        </p>

    </div>
);


// ============================================================================
// MAIN COMPONENT
// ============================================================================

const AISummary = ({
    summary = "",
    stats = [],
    insights = [],
    loading = false,
    title = "AI Summary",
    subtitle = "A quick overview of your EverKeep data.",
    onViewDetails,
}) => {

    // ------------------------------------------------------------------------
    // NORMALIZE STATS
    // ------------------------------------------------------------------------

    const normalizedStats = useMemo(() => {

        if (!Array.isArray(stats)) {
            return [];
        }

        return stats
            .filter(
                (stat) =>
                    stat &&
                    stat.value !== undefined &&
                    stat.value !== null
            )
            .slice(0, 4);

    }, [stats]);


    // ------------------------------------------------------------------------
    // NORMALIZE INSIGHTS
    // ------------------------------------------------------------------------

    const normalizedInsights = useMemo(() => {

        if (!Array.isArray(insights)) {
            return [];
        }

        return insights
            .filter(
                (insight) =>
                    typeof insight === "string" &&
                    insight.trim()
            )
            .slice(0, 5);

    }, [insights]);


    // ------------------------------------------------------------------------
    // LOADING
    // ------------------------------------------------------------------------

    if (loading) {

        return (
            <section
                className="
                    rounded-3xl
                    border
                    border-slate-200/80
                    bg-white
                    p-5
                    shadow-[0_12px_40px_rgba(15,23,42,0.05)]
                "
            >
                <SummarySkeleton />
            </section>
        );

    }


    // ------------------------------------------------------------------------
    // EMPTY
    // ------------------------------------------------------------------------

    if (
        !summary &&
        normalizedStats.length === 0 &&
        normalizedInsights.length === 0
    ) {

        return (
            <section
                className="
                    rounded-3xl
                    border
                    border-slate-200/80
                    bg-white
                    shadow-[0_12px_40px_rgba(15,23,42,0.05)]
                "
            >
                <EmptySummary />
            </section>
        );

    }


    // ------------------------------------------------------------------------
    // RENDER
    // ------------------------------------------------------------------------

    return (
        <section
            className="
                overflow-hidden
                rounded-3xl
                border
                border-slate-200/80
                bg-white
                shadow-[0_12px_40px_rgba(15,23,42,0.05)]
            "
        >

            {/* ================================================================
                HEADER
            ================================================================ */}

            <div
                className="
                    flex
                    items-start
                    justify-between
                    gap-4
                    border-b
                    border-slate-100
                    px-5
                    py-4
                "
            >

                <div className="flex min-w-0 items-center gap-3">

                    <div
                        className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-slate-900
                            text-white
                        "
                    >
                        <SparklesIcon size={17} />
                    </div>


                    <div className="min-w-0">

                        <h2
                            className="
                                truncate
                                text-sm
                                font-semibold
                                tracking-tight
                                text-slate-900
                            "
                        >
                            {title}
                        </h2>


                        <p
                            className="
                                mt-0.5
                                truncate
                                text-[11px]
                                text-slate-500
                            "
                        >
                            {subtitle}
                        </p>

                    </div>

                </div>


                {onViewDetails ? (
                    <button
                        type="button"
                        onClick={onViewDetails}
                        className="
                            inline-flex
                            shrink-0
                            items-center
                            gap-1
                            rounded-lg
                            px-2
                            py-1.5
                            text-xs
                            font-medium
                            text-slate-500
                            transition
                            hover:bg-slate-50
                            hover:text-slate-900
                            focus:outline-none
                            focus:ring-2
                            focus:ring-slate-200
                        "
                    >
                        Details
                        <ArrowUpRightIcon size={13} />
                    </button>
                ) : null}

            </div>


            {/* ================================================================
                CONTENT
            ================================================================ */}

            <div className="space-y-5 p-5">

                {/* ------------------------------------------------------------
                    SUMMARY
                ------------------------------------------------------------ */}

                {summary ? (
                    <div>

                        <p
                            className="
                                text-sm
                                leading-6
                                text-slate-600
                            "
                        >
                            {summary}
                        </p>

                    </div>
                ) : null}


                {/* ------------------------------------------------------------
                    STATS
                ------------------------------------------------------------ */}

                {normalizedStats.length > 0 ? (
                    <div
                        className="
                            grid
                            grid-cols-2
                            gap-3
                            sm:grid-cols-4
                        "
                    >

                        {normalizedStats.map(
                            (stat, index) => (
                                <SummaryStat
                                    key={
                                        stat.id ||
                                        stat.label ||
                                        index
                                    }
                                    label={
                                        stat.label ||
                                        "Metric"
                                    }
                                    value={
                                        stat.value
                                    }
                                    hint={
                                        stat.hint
                                    }
                                />
                            )
                        )}

                    </div>
                ) : null}


                {/* ------------------------------------------------------------
                    INSIGHTS
                ------------------------------------------------------------ */}

                {normalizedInsights.length > 0 ? (
                    <div>

                        <div
                            className="
                                mb-3
                                flex
                                items-center
                                justify-between
                            "
                        >

                            <h3
                                className="
                                    text-[11px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.16em]
                                    text-slate-400
                                "
                            >
                                Key insights
                            </h3>


                            <span
                                className="
                                    text-[10px]
                                    font-medium
                                    text-slate-400
                                "
                            >
                                {normalizedInsights.length}
                            </span>

                        </div>


                        <div className="space-y-2.5">

                            {normalizedInsights.map(
                                (insight, index) => (
                                    <InsightItem
                                        key={`${insight}-${index}`}
                                    >
                                        {insight}
                                    </InsightItem>
                                )
                            )}

                        </div>

                    </div>
                ) : null}

            </div>

        </section>
    );
};


export default AISummary;