
import {
    AlertCircle,
    BrainCircuit,
    CheckCircle2,
    Lightbulb,
    RefreshCw,
    Sparkles,
    TrendingUp,
} from "lucide-react";

const INSIGHT_STYLES = {
    warning: {
        icon: AlertCircle,
        label: "Attention",
        color:
            "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
        border: "hover:border-amber-200 dark:hover:border-amber-900",
    },
    saving: {
        icon: TrendingUp,
        label: "Saving opportunity",
        color:
            "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
        border: "hover:border-emerald-200 dark:hover:border-emerald-900",
    },
    action: {
        icon: CheckCircle2,
        label: "Recommended action",
        color:
            "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300",
        border: "hover:border-indigo-200 dark:hover:border-indigo-900",
    },
    general: {
        icon: Lightbulb,
        label: "General insight",
        color:
            "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300",
        border: "hover:border-violet-200 dark:hover:border-violet-900",
    },
};

function InsightCard({ insight }) {
    const style = INSIGHT_STYLES[insight.type] || INSIGHT_STYLES.general;
    const Icon = style.icon;

    return (
        <article
            className={`flex min-w-0 items-start gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 ${style.border}`}
        >
            <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${style.color}`}
            >
                <Icon size={20} aria-hidden="true" />
            </div>

            <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span
                        className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${style.color}`}
                    >
                        {style.label}
                    </span>
                </div>

                <h3 className="break-words text-sm font-bold leading-5 text-slate-900 dark:text-white">
                    {insight.title || "Untitled insight"}
                </h3>

                <p className="mt-2 whitespace-pre-line break-words text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {insight.description || "No additional details available."}
                </p>

                {insight.recommendation && (
                    <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/70">
                        <p className="mb-1 text-xs font-bold text-slate-800 dark:text-slate-200">
                            Recommended next step
                        </p>
                        <p className="break-words text-xs leading-5 text-slate-600 dark:text-slate-400">
                            {insight.recommendation}
                        </p>
                    </div>
                )}
            </div>
        </article>
    );
}

export default function AIInsights({
    insights = [],
    loading = false,
    error = "",
    onRefresh,
}) {
    const safeInsights = Array.isArray(insights)
        ? insights.filter((item) => item && typeof item === "object")
        : [];

    return (
        <section
            aria-labelledby="ai-insights-title"
            className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
            <header className="flex flex-col gap-4 border-b border-slate-100 p-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm shadow-indigo-500/20">
                        <BrainCircuit size={23} />
                    </div>

                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <h2
                                id="ai-insights-title"
                                className="text-base font-bold text-slate-900 dark:text-white"
                            >
                                AI Insights
                            </h2>

                            <span className="inline-flex items-center gap-1 rounded-full border border-indigo-100 bg-indigo-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/50 dark:text-indigo-300">
                                <Sparkles size={12} />
                                Smart analysis
                            </span>
                        </div>

                        <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
                            Recommendations based on your available records.
                        </p>
                    </div>
                </div>

                {onRefresh && (
                    <button
                        type="button"
                        onClick={onRefresh}
                        disabled={loading}
                        aria-label="Refresh AI insights"
                        className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                        <RefreshCw
                            size={15}
                            className={loading ? "animate-spin" : ""}
                        />
                        {loading ? "Analyzing..." : "Refresh insights"}
                    </button>
                )}
            </header>

            <div className="p-4 sm:p-5">
                {loading ? (
                    <div
                        role="status"
                        aria-live="polite"
                        className="flex min-h-44 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50/70 to-violet-50/70 px-5 py-8 text-center dark:from-indigo-950/20 dark:to-violet-950/20"
                    >
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-indigo-400">
                            <Sparkles size={23} className="animate-pulse" />
                        </div>

                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            Analyzing your records
                        </p>

                        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
                            Preparing insights from your available asset, warranty and
                            subscription data.
                        </p>

                        <div className="mt-5 h-1.5 w-40 overflow-hidden rounded-full bg-indigo-100 dark:bg-slate-800">
                            <div className="h-full w-1/2 animate-pulse rounded-full bg-indigo-500" />
                        </div>
                    </div>
                ) : error ? (
                    <div
                        role="alert"
                        className="flex flex-col gap-4 rounded-2xl border border-rose-200 bg-rose-50/70 p-4 sm:flex-row sm:items-start dark:border-rose-900/50 dark:bg-rose-950/20"
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-rose-600 dark:bg-slate-900 dark:text-rose-400">
                            <AlertCircle size={21} />
                        </div>

                        <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-bold text-rose-800 dark:text-rose-300">
                                Insights could not be loaded
                            </h3>

                            <p className="mt-1 break-words text-sm leading-6 text-rose-700 dark:text-rose-400">
                                {error}
                            </p>

                            {onRefresh && (
                                <button
                                    type="button"
                                    onClick={onRefresh}
                                    className="mt-3 inline-flex items-center gap-2 rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 focus:outline-none focus:ring-4 focus:ring-rose-500/20"
                                >
                                    <RefreshCw size={15} />
                                    Try again
                                </button>
                            )}
                        </div>
                    </div>
                ) : safeInsights.length === 0 ? (
                    <div className="flex min-h-44 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 px-5 py-8 text-center dark:border-slate-700">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-300">
                            <Lightbulb size={23} />
                        </div>

                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                            No insights available yet
                        </h3>

                        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
                            Add asset, warranty or subscription records to provide more
                            context for useful recommendations.
                        </p>

                        {onRefresh && (
                            <button
                                type="button"
                                onClick={onRefresh}
                                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20"
                            >
                                <Sparkles size={15} />
                                Generate insights
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid min-w-0 grid-cols-1 gap-3 xl:grid-cols-2">
                        {safeInsights.map((insight, index) => (
                            <InsightCard
                                key={
                                    insight.id ||
                                    `${insight.type || "general"}-${insight.title || "insight"}-${index}`
                                }
                                insight={insight}
                            />
                        ))}
                    </div>
                )}

                <footer className="mt-5 flex items-start gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                    <AlertCircle
                        size={14}
                        className="mt-0.5 shrink-0 text-slate-400"
                    />
                    <p className="text-xs leading-5 text-slate-400">
                        AI recommendations are informational. Verify renewal dates,
                        billing amounts and record details before making decisions.
                    </p>
                </footer>
            </div>
        </section>
    );
}
