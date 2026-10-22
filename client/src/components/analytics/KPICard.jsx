
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

const ACCENTS = {
    indigo: {
        icon: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400",
        hover: "group-hover:border-indigo-200 dark:group-hover:border-indigo-900",
    },
    emerald: {
        icon: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
        hover: "group-hover:border-emerald-200 dark:group-hover:border-emerald-900",
    },
    violet: {
        icon: "bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400",
        hover: "group-hover:border-violet-200 dark:group-hover:border-violet-900",
    },
    amber: {
        icon: "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400",
        hover: "group-hover:border-amber-200 dark:group-hover:border-amber-900",
    },
    cyan: {
        icon: "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/50 dark:text-cyan-400",
        hover: "group-hover:border-cyan-200 dark:group-hover:border-cyan-900",
    },
    rose: {
        icon: "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400",
        hover: "group-hover:border-rose-200 dark:group-hover:border-rose-900",
    },
};

export default function KPICard({
    title,
    value,
    description,
    icon: Icon,
    accent = "indigo",
    trend,
    trendLabel,
    index = 0,
}) {
    const shouldReduceMotion = useReducedMotion();

    const accentStyle =
        typeof accent === "string" && ACCENTS[accent]
            ? ACCENTS[accent]
            : null;

    // Preserve existing custom Tailwind accent strings.
    const iconStyle =
        accentStyle?.icon ||
        (typeof accent === "string" && accent.startsWith("bg-")
            ? accent
            : ACCENTS.indigo.icon);

    const trendValue =
        typeof trend === "number" && Number.isFinite(trend) ? trend : null;

    const TrendIcon =
        trendValue === null || trendValue === 0
            ? Minus
            : trendValue > 0
                ? ArrowUpRight
                : ArrowDownRight;

    const trendColor =
        trendValue === null || trendValue === 0
            ? "text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400"
            : trendValue > 0
                ? "text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400"
                : "text-rose-700 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400";

    return (
        <motion.article
            initial={
                shouldReduceMotion ? false : { opacity: 0, y: 12 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: shouldReduceMotion ? 0 : 0.25,
                delay: shouldReduceMotion ? 0 : Math.min(index * 0.05, 0.25),
            }}
            className="h-full min-w-0"
        >
            <div
                className={`group relative h-full min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 sm:p-5 ${accentStyle?.hover || ""
                    }`}
            >
                <div className="flex h-full min-w-0 flex-col justify-between gap-5">
                    <div className="flex min-w-0 items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                            <p className="break-words text-sm font-medium leading-5 text-slate-500 dark:text-slate-400">
                                {title}
                            </p>

                            <p
                                title={typeof value === "string" ? value : undefined}
                                className="mt-3 break-words text-2xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-3xl"
                            >
                                {value ?? "—"}
                            </p>
                        </div>

                        {Icon && (
                            <div
                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 ${iconStyle}`}
                                aria-hidden="true"
                            >
                                <Icon size={21} />
                            </div>
                        )}
                    </div>

                    <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
                        {description ? (
                            <p className="min-w-0 flex-1 break-words text-xs leading-5 text-slate-500 dark:text-slate-400">
                                {description}
                            </p>
                        ) : (
                            <span />
                        )}

                        {trendValue !== null && (
                            <span
                                className={`inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold ${trendColor}`}
                                title={trendLabel || "Change compared with the previous period"}
                            >
                                <TrendIcon size={13} aria-hidden="true" />
                                {Math.abs(trendValue).toFixed(1)}%
                            </span>
                        )}
                    </div>

                    {trendLabel && trendValue !== null && (
                        <p className="text-[11px] leading-4 text-slate-400">
                            {trendLabel}
                        </p>
                    )}
                </div>
            </div>
        </motion.article>
    );
}
