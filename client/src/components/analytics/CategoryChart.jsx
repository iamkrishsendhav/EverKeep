
import { useMemo, useState } from "react";
import { Layers3, Wallet, RotateCcw, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

const COLORS = [
    "#6366f1",
    "#06b6d4",
    "#10b981",
    "#f59e0b",
    "#ec4899",
    "#8b5cf6",
    "#64748b",
    "#f97316",
];

const formatCurrency = (amount, currency = "INR") =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
    }).format(amount);

function getMonthlyAmount(subscription) {
    const amount = Number(subscription.amount);

    if (!Number.isFinite(amount) || amount < 0) return null;

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
            // Custom cycles cannot be normalized without their interval.
            return null;
    }
}

export default function CategoryChart({ subscriptions = [] }) {
    const [selectedCategory, setSelectedCategory] = useState(null);

    const categories = useMemo(() => {
        const result = new Map();
        const safeSubscriptions = Array.isArray(subscriptions)
            ? subscriptions
            : [];

        safeSubscriptions
            .filter(
                (item) =>
                    String(item?.status || "").toLowerCase() === "active"
            )
            .forEach((item) => {
                const name = String(item.category || "Other").trim() || "Other";
                const monthlyAmount = getMonthlyAmount(item);

                if (monthlyAmount === null) return;

                const current = result.get(name) || {
                    amount: 0,
                    count: 0,
                };

                current.amount += monthlyAmount;
                current.count += 1;

                result.set(name, current);
            });

        return [...result.entries()]
            .map(([name, value], index) => ({
                name,
                amount: value.amount,
                count: value.count,
                color: COLORS[index % COLORS.length],
            }))
            .sort((a, b) => b.amount - a.amount);
    }, [subscriptions]);

    const total = categories.reduce((sum, item) => sum + item.amount, 0);

    const selected = categories.find(
        (item) => item.name === selectedCategory
    );

    const customCount = useMemo(
        () =>
            (Array.isArray(subscriptions) ? subscriptions : []).filter(
                (item) =>
                    String(item?.status || "").toLowerCase() === "active" &&
                    getMonthlyAmount(item) === null
            ).length,
        [subscriptions]
    );

    const gradient = useMemo(() => {
        if (total <= 0) return "conic-gradient(#e2e8f0 0deg 360deg)";

        let angle = 0;

        const slices = categories.map((item) => {
            const start = angle;
            angle += (item.amount / total) * 360;
            return `${item.color} ${start}deg ${angle}deg`;
        });

        return `conic-gradient(${slices.join(", ")})`;
    }, [categories, total]);

    return (
        <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900 sm:p-5">
            <div className="mb-6 flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400">
                        <Layers3 size={21} />
                    </div>

                    <div className="min-w-0">
                        <h2 className="text-base font-bold text-slate-900 dark:text-white">
                            Subscription Categories
                        </h2>
                        <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
                            Estimated monthly spending by category
                        </p>
                    </div>
                </div>

                <div className="shrink-0 rounded-xl bg-slate-50 px-3 py-2 text-right dark:bg-slate-800">
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                        {categories.reduce((sum, item) => sum + item.count, 0)}
                    </p>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                        Subscriptions
                    </p>
                </div>
            </div>

            {!categories.length || total <= 0 ? (
                <div className="flex min-h-44 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 px-5 text-center dark:border-slate-700">
                    <Wallet size={28} className="mb-3 text-slate-400" />
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        No comparable spending data
                    </p>
                    <p className="mt-2 max-w-xs text-sm leading-5 text-slate-500 dark:text-slate-400">
                        Active subscriptions with supported billing cycles will appear here.
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid min-w-0 grid-cols-1 items-center gap-7 md:grid-cols-[minmax(150px,0.8fr)_minmax(0,1.2fr)] md:gap-6">
                        {/* Circular spending distribution */}
                        <button
                            type="button"
                            onClick={() => setSelectedCategory(null)}
                            aria-label="Show total subscription spending"
                            className="relative mx-auto aspect-square w-full max-w-48 rounded-full outline-none focus-visible:ring-4 focus-visible:ring-cyan-500/30"
                            style={{ background: gradient }}
                        >
                            <div className="absolute inset-[17%] flex flex-col items-center justify-center rounded-full bg-white text-center dark:bg-slate-900">
                                {selected ? (
                                    <>
                                        <span className="max-w-[90%] truncate px-2 text-xl font-extrabold text-slate-900 dark:text-white">
                                            {formatCurrency(selected.amount)}
                                        </span>
                                        <span className="mt-1 max-w-[90%] truncate px-2 text-xs text-slate-500 dark:text-slate-400">
                                            {selected.name}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <CreditCard size={21} className="mb-2 text-cyan-500" />
                                        <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                                            {formatCurrency(total)}
                                        </span>
                                        <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                            Per month*
                                        </span>
                                    </>
                                )}
                            </div>
                        </button>

                        {/* Interactive category legend */}
                        <div className="min-w-0 space-y-2">
                            {categories.map((item, index) => {
                                const percentage = (item.amount / total) * 100;
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
                                        className={`w-full rounded-xl border p-3 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-500/20 ${isSelected
                                                ? "border-cyan-200 bg-cyan-50/70 dark:border-cyan-900 dark:bg-cyan-950/30"
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

                                        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percentage}%` }}
                                                transition={{
                                                    duration: 0.5,
                                                    delay: Math.min(index * 0.035, 0.3),
                                                }}
                                                className="h-full rounded-full"
                                                style={{ backgroundColor: item.color }}
                                            />
                                        </div>

                                        <div className="mt-1.5 flex justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                                            <span>
                                                {item.count} subscription
                                                {item.count === 1 ? "" : "s"}
                                            </span>
                                            <span>{percentage.toFixed(1)}%</span>
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                Normalized monthly total
                            </p>
                            <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                                {formatCurrency(total)}
                            </p>
                        </div>

                        {selectedCategory && (
                            <button
                                type="button"
                                onClick={() => setSelectedCategory(null)}
                                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-cyan-700 hover:bg-cyan-50 dark:text-cyan-300 dark:hover:bg-cyan-950/40"
                            >
                                <RotateCcw size={13} />
                                Reset
                            </button>
                        )}
                    </div>
                </>
            )}

            {customCount > 0 && (
                <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/20 dark:text-amber-300">
                    {customCount} active subscription
                    {customCount === 1 ? "" : "s"} with an unsupported or custom billing
                    cycle {customCount === 1 ? "is" : "are"} excluded from this estimate.
                </p>
            )}

            <p className="mt-4 text-xs leading-5 text-slate-400">
                *Weekly, monthly, quarterly, half-yearly and yearly charges are
                normalized to estimated monthly amounts. This is not a transaction
                history. Amounts are displayed in INR; subscriptions in other
                currencies require conversion before combining.
            </p>
        </section>
    );
}
