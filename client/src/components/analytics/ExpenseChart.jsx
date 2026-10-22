
import { useMemo, useState } from "react";
import {
    CreditCard,
    TrendingUp,
    Wallet,
    RotateCcw,
    Receipt,
} from "lucide-react";
import { motion } from "framer-motion";

const COLORS = [
    "#8b5cf6",
    "#6366f1",
    "#06b6d4",
    "#10b981",
    "#f59e0b",
    "#ec4899",
    "#64748b",
    "#f97316",
];

const getMonthlyAmount = (subscription) => {
    const amount = Number(subscription?.amount);

    if (
        subscription?.amount === null ||
        subscription?.amount === undefined ||
        subscription?.amount === "" ||
        !Number.isFinite(amount) ||
        amount < 0
    ) {
        return null;
    }

    switch (subscription.billingCycle) {
        case "weekly":
            return (amount * 52) / 12;
        case "monthly":
            return amount;
        case "quarterly":
            return amount / 3;
        case "half-yearly":
            return amount / 6;
        case "yearly":
            return amount / 12;
        default:
            return null;
    }
};

const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount);

export default function ExpenseChart({ subscriptions = [] }) {
    const [selectedCategory, setSelectedCategory] = useState(null);

    const summary = useMemo(() => {
        const active = (Array.isArray(subscriptions) ? subscriptions : [])
            .filter(
                (item) =>
                    String(item?.status || "").toLowerCase() === "active"
            )
            .map((item) => ({
                name: item.name || "Unnamed subscription",
                category: String(item.category || "Other").trim() || "Other",
                monthlyAmount: getMonthlyAmount(item),
            }));

        const known = active.filter(
            (item) =>
                item.monthlyAmount !== null &&
                Number.isFinite(item.monthlyAmount)
        );

        const total = known.reduce(
            (sum, item) => sum + item.monthlyAmount,
            0
        );

        const grouped = new Map();

        known.forEach((item) => {
            const current = grouped.get(item.category) || {
                amount: 0,
                count: 0,
            };

            current.amount += item.monthlyAmount;
            current.count += 1;

            grouped.set(item.category, current);
        });

        return {
            total,
            activeCount: active.length,
            supportedCount: known.length,
            excludedCount: active.length - known.length,
            categories: [...grouped.entries()]
                .map(([name, value], index) => ({
                    name,
                    amount: value.amount,
                    count: value.count,
                    color: COLORS[index % COLORS.length],
                }))
                .sort((a, b) => b.amount - a.amount),
        };
    }, [subscriptions]);

    const maxAmount = Math.max(
        1,
        ...summary.categories.map((item) => item.amount)
    );

    const selected = summary.categories.find(
        (item) => item.name === selectedCategory
    );

    const resetSelection = () => setSelectedCategory(null);

    return (
        <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900 sm:p-5">
            {/* Header */}
            <div className="mb-6 flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400">
                        <CreditCard size={21} />
                    </div>

                    <div className="min-w-0">
                        <h2 className="text-base font-bold text-slate-900 dark:text-white">
                            Monthly Spending
                        </h2>
                        <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
                            Estimated recurring cost from active subscriptions
                        </p>
                    </div>
                </div>
            </div>

            {/* Summary */}
            <div className="mb-6 rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-indigo-50/70 p-4 dark:border-violet-900/40 dark:from-violet-950/30 dark:to-indigo-950/20 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                            Estimated monthly total
                        </p>

                        <p className="mt-2 break-words text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                            {formatCurrency(summary.total)}
                        </p>

                        <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                            Based on {summary.supportedCount} supported active subscription
                            {summary.supportedCount === 1 ? "" : "s"}
                        </p>
                    </div>

                    <div className="shrink-0 rounded-xl bg-white/80 p-3 text-violet-600 shadow-sm dark:bg-slate-900/70 dark:text-violet-400">
                        <Wallet size={23} />
                    </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 border-t border-violet-100 pt-4 dark:border-violet-900/40">
                    <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Active subscriptions
                        </p>
                        <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                            {summary.activeCount}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Categories
                        </p>
                        <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                            {summary.categories.length}
                        </p>
                    </div>
                </div>
            </div>

            {/* Category breakdown */}
            {summary.categories.length === 0 ? (
                <div className="flex min-h-36 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 px-4 text-center dark:border-slate-700">
                    <Receipt size={27} className="mb-3 text-slate-400" />

                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        No spending data available
                    </p>

                    <p className="mt-2 max-w-xs text-sm leading-5 text-slate-500 dark:text-slate-400">
                        Add active subscriptions with valid amounts and supported billing
                        cycles to calculate monthly spending.
                    </p>
                </div>
            ) : (
                <div>
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                Category breakdown
                            </h3>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Select a category to inspect its share
                            </p>
                        </div>

                        {selectedCategory && (
                            <button
                                type="button"
                                onClick={resetSelection}
                                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-violet-700 transition hover:bg-violet-50 dark:text-violet-300 dark:hover:bg-violet-950/40"
                            >
                                <RotateCcw size={13} />
                                Reset
                            </button>
                        )}
                    </div>

                    <div className="space-y-2">
                        {summary.categories.map((item, index) => {
                            const percentage =
                                summary.total > 0
                                    ? (item.amount / summary.total) * 100
                                    : 0;

                            const isSelected = selectedCategory === item.name;

                            return (
                                <motion.button
                                    key={item.name}
                                    type="button"
                                    initial={{ opacity: 0, x: 8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                        duration: 0.25,
                                        delay: Math.min(index * 0.035, 0.3),
                                    }}
                                    onClick={() =>
                                        setSelectedCategory((current) =>
                                            current === item.name ? null : item.name
                                        )
                                    }
                                    aria-pressed={isSelected}
                                    className={`w-full min-w-0 rounded-xl border p-3 text-left transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-500/20 ${isSelected
                                            ? "border-violet-200 bg-violet-50/70 dark:border-violet-900 dark:bg-violet-950/30"
                                            : "border-transparent hover:border-slate-200 hover:bg-slate-50 dark:hover:border-slate-700 dark:hover:bg-slate-800/60"
                                        }`}
                                >
                                    <div className="mb-2 flex items-center justify-between gap-3">
                                        <div className="flex min-w-0 items-center gap-2">
                                            <span
                                                className="h-3 w-3 shrink-0 rounded-full"
                                                style={{ backgroundColor: item.color }}
                                            />

                                            <span className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                                                {item.name}
                                            </span>
                                        </div>

                                        <span className="shrink-0 text-sm font-bold text-slate-900 dark:text-white">
                                            {formatCurrency(item.amount)}
                                        </span>
                                    </div>

                                    <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{
                                                width: `${(item.amount / maxAmount) * 100}%`,
                                            }}
                                            transition={{
                                                duration: 0.5,
                                                delay: Math.min(index * 0.035, 0.3),
                                            }}
                                            className="h-full rounded-full"
                                            style={{ backgroundColor: item.color }}
                                        />
                                    </div>

                                    <div className="mt-2 flex flex-wrap justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                                        <span>
                                            {item.count} subscription
                                            {item.count === 1 ? "" : "s"}
                                        </span>
                                        <span>{percentage.toFixed(1)}% of total</span>
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>

                    {selected && (
                        <div className="mt-4 rounded-xl border border-violet-100 bg-violet-50/60 p-4 dark:border-violet-900/40 dark:bg-violet-950/20">
                            <p className="text-xs font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300">
                                Selected category
                            </p>

                            <p className="mt-1 break-words text-sm font-bold text-slate-900 dark:text-white">
                                {selected.name}
                            </p>

                            <p className="mt-2 text-lg font-extrabold text-slate-900 dark:text-white">
                                {formatCurrency(selected.amount)}
                                <span className="ml-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                                    / month
                                </span>
                            </p>

                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                {((selected.amount / (summary.total || 1)) * 100).toFixed(1)}%
                                of estimated recurring spending
                            </p>
                        </div>
                    )}
                </div>
            )}

            {summary.excludedCount > 0 && (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/50 dark:bg-amber-950/20">
                    <p className="text-xs leading-5 text-amber-800 dark:text-amber-300">
                        {summary.excludedCount} active subscription
                        {summary.excludedCount === 1 ? "" : "s"} could not be included
                        because the billing cycle or amount is unsupported or invalid.
                    </p>
                </div>
            )}

            <div className="mt-5 flex items-start gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                <TrendingUp
                    size={14}
                    className="mt-0.5 shrink-0 text-slate-400"
                />
                <p className="text-xs leading-5 text-slate-400">
                    Monthly amounts are estimates. Weekly, quarterly, half-yearly and
                    yearly charges are normalized to monthly values. This chart does not
                    represent actual historical payments. All values are formatted in
                    INR; mixed currencies require conversion before aggregation.
                </p>
            </div>
        </section>
    );
}
