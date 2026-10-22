
import { useMemo, useState } from "react";
import {
    Boxes,
    Package,
    PieChart,
    RotateCcw,
    ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";

const COLORS = [
    "#6366f1",
    "#06b6d4",
    "#10b981",
    "#f59e0b",
    "#ec4899",
    "#8b5cf6",
    "#64748b",
    "#14b8a6",
    "#f97316",
];

const formatNumber = (value) =>
    new Intl.NumberFormat("en-IN").format(value);

export default function AssetChart({ assets = [] }) {
    const [selectedCategory, setSelectedCategory] = useState(null);

    const safeAssets = useMemo(
        () => (Array.isArray(assets) ? assets : []),
        [assets],
    );

    const categories = useMemo(() => {
        const counts = new Map();

        safeAssets.forEach((asset) => {
            const name =
                typeof asset?.category === "string" && asset.category.trim()
                    ? asset.category.trim()
                    : "Other";

            counts.set(name, (counts.get(name) || 0) + 1);
        });

        return [...counts.entries()]
            .map(([name, count], index) => ({
                name,
                count,
                color: COLORS[index % COLORS.length],
            }))
            .sort((a, b) => b.count - a.count);
    }, [safeAssets]);

    const total = safeAssets.length;

    const selected = categories.find(
        (item) => item.name === selectedCategory
    );

    const activeCategory = selected || null;

    const gradient = useMemo(() => {
        if (!total) return "conic-gradient(#e2e8f0 0deg 360deg)";

        let angle = 0;

        const slices = categories.map((item) => {
            const start = angle;
            angle += (item.count / total) * 360;

            return `${item.color} ${start}deg ${angle}deg`;
        });

        return `conic-gradient(${slices.join(", ")})`;
    }, [categories, total]);

    const resetSelection = () => setSelectedCategory(null);

    return (
        <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900 sm:p-5">
            {/* Header */}
            <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                        <PieChart size={21} />
                    </div>

                    <div className="min-w-0">
                        <h2 className="text-base font-bold text-slate-900 dark:text-white">
                            Asset Distribution
                        </h2>
                        <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
                            Explore your collection by category
                        </p>
                    </div>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-right dark:border-slate-800 dark:bg-slate-800/60">
                    <p className="text-lg font-bold leading-5 text-slate-900 dark:text-white">
                        {formatNumber(total)}
                    </p>
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                        Total assets
                    </p>
                </div>
            </div>

            {!total ? (
                <div className="flex min-h-52 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 px-5 text-center dark:border-slate-700">
                    <div className="mb-3 rounded-2xl bg-slate-100 p-3 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        <Boxes size={27} />
                    </div>

                    <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        No assets to analyse yet
                    </h3>

                    <p className="mt-2 max-w-xs text-sm leading-5 text-slate-500 dark:text-slate-400">
                        Add your first asset to see your category distribution and
                        percentages here.
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid min-w-0 grid-cols-1 items-center gap-7 md:grid-cols-[minmax(170px,0.85fr)_minmax(0,1.15fr)] md:gap-6">
                        {/* Interactive donut */}
                        <div className="mx-auto w-full max-w-56">
                            <button
                                type="button"
                                onClick={resetSelection}
                                aria-label="Show total assets in the chart"
                                className="group relative block aspect-square w-full rounded-full outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30"
                                style={{ background: gradient }}
                            >
                                <div className="absolute inset-[17%] flex flex-col items-center justify-center rounded-full bg-white text-center shadow-inner dark:bg-slate-900">
                                    {activeCategory ? (
                                        <>
                                            <span
                                                className="max-w-[90%] truncate text-2xl font-extrabold text-slate-900 dark:text-white"
                                                title={activeCategory.name}
                                            >
                                                {activeCategory.count}
                                            </span>
                                            <span className="mt-1 max-w-[90%] truncate px-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                                                {activeCategory.name}
                                            </span>
                                            <span className="mt-1 text-[10px] text-slate-400">
                                                {((activeCategory.count / total) * 100).toFixed(1)}%
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <Package
                                                size={22}
                                                className="mb-2 text-indigo-500 transition-transform group-hover:scale-110"
                                                aria-hidden="true"
                                            />
                                            <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                                {formatNumber(total)}
                                            </span>
                                            <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                                Total assets
                                            </span>
                                        </>
                                    )}
                                </div>
                            </button>

                            <p className="mt-4 text-center text-xs text-slate-400">
                                Select a category to inspect it
                            </p>
                        </div>

                        {/* Legend */}
                        <div className="min-w-0 space-y-2">
                            {categories.map((item, index) => {
                                const percentage = (item.count / total) * 100;
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
                                        className={`w-full min-w-0 rounded-xl border p-3 text-left transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20 ${isSelected
                                                ? "border-indigo-200 bg-indigo-50/70 dark:border-indigo-800 dark:bg-indigo-950/30"
                                                : "border-transparent hover:border-slate-200 hover:bg-slate-50 dark:hover:border-slate-700 dark:hover:bg-slate-800/70"
                                            }`}
                                    >
                                        <div className="mb-2 flex items-center justify-between gap-3">
                                            <div className="flex min-w-0 items-center gap-2">
                                                <span
                                                    className="h-3 w-3 shrink-0 rounded-full ring-2 ring-white dark:ring-slate-900"
                                                    style={{ backgroundColor: item.color }}
                                                />

                                                <span className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                                                    {item.name}
                                                </span>
                                            </div>

                                            <div className="flex shrink-0 items-center gap-1.5">
                                                <span className="text-sm font-bold text-slate-900 dark:text-white">
                                                    {formatNumber(item.count)}
                                                </span>
                                                <ArrowUpRight
                                                    size={13}
                                                    className={`transition-colors ${isSelected
                                                            ? "text-indigo-600 dark:text-indigo-400"
                                                            : "text-slate-300 dark:text-slate-600"
                                                        }`}
                                                />
                                            </div>
                                        </div>

                                        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percentage}%` }}
                                                transition={{
                                                    duration: 0.55,
                                                    delay: Math.min(index * 0.035, 0.3),
                                                }}
                                                className="h-full rounded-full"
                                                style={{ backgroundColor: item.color }}
                                            />
                                        </div>

                                        <div className="mt-1.5 text-right text-[11px] text-slate-500 dark:text-slate-400">
                                            {percentage.toFixed(1)}% of collection
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
                        <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Categories
                            </p>
                            <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                                {categories.length}
                            </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Largest category
                            </p>
                            <p
                                className="mt-1 truncate text-sm font-bold text-slate-900 dark:text-white"
                                title={categories[0]?.name || ""}
                            >
                                {categories[0]?.name || "—"}
                            </p>
                            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                                {categories[0]
                                    ? `${((categories[0].count / total) * 100).toFixed(1)}% of assets`
                                    : "No data"}
                            </p>
                        </div>
                    </div>

                    {selectedCategory && (
                        <button
                            type="button"
                            onClick={resetSelection}
                            className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                        >
                            <RotateCcw size={13} />
                            Reset chart selection
                        </button>
                    )}
                </>
            )}

            <p className="mt-5 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-400 dark:border-slate-800">
                Distribution is calculated from the assets currently returned by your
                API. Select a legend item to view its share in the chart.
            </p>
        </section>
    );
}
