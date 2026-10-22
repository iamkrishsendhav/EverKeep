
import { useMemo, useState } from "react";
import {
    CalendarClock,
    ShieldCheck,
    CreditCard,
    AlertTriangle,
    Clock3,
    CalendarDays,
    RotateCcw,
} from "lucide-react";
import { motion } from "framer-motion";

const DAY_MS = 86400000;

const getDate = (value) => {
    if (!value) return null;

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
};

const getDaysRemaining = (value) => {
    const date = getDate(value);
    if (!date) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    return Math.round((date.getTime() - today.getTime()) / DAY_MS);
};

const formatDate = (value) => {
    const date = getDate(value);
    if (!date) return "Date unavailable";

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const FILTERS = [
    { value: "all", label: "All" },
    { value: "warranty", label: "Warranties" },
    { value: "subscription", label: "Subscriptions" },
];

function RenewalRow({ item, index }) {
    const urgent = item.days <= 7;
    const Icon = item.type === "warranty" ? ShieldCheck : CreditCard;

    const statusLabel =
        item.days === 0
            ? "Today"
            : item.days === 1
                ? "Tomorrow"
                : `${item.days} days`;

    return (
        <motion.article
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.22,
                delay: Math.min(index * 0.035, 0.3),
            }}
            className="flex min-w-0 items-center gap-3 py-3.5"
        >
            <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${urgent
                        ? "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
                        : item.type === "warranty"
                            ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400"
                            : "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400"
                    }`}
            >
                <Icon size={20} aria-hidden="true" />
            </div>

            <div className="min-w-0 flex-1">
                <p className="break-words text-sm font-semibold text-slate-900 dark:text-white">
                    {item.title}
                </p>

                <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                    {item.subtitle}
                </p>

                <p className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
                    <CalendarDays size={12} aria-hidden="true" />
                    {formatDate(item.date)}
                </p>
            </div>

            <div className="shrink-0 text-right">
                <span
                    className={`inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-bold ${urgent
                            ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                >
                    {urgent && <AlertTriangle size={12} aria-hidden="true" />}
                    {statusLabel}
                </span>

                {urgent && (
                    <p className="mt-1 text-[10px] font-medium text-amber-600 dark:text-amber-400">
                        {item.days === 0 ? "Due today" : "Coming soon"}
                    </p>
                )}
            </div>
        </motion.article>
    );
}

export default function RenewalChart({
    warranties = [],
    subscriptions = [],
    period = 30,
}) {
    const [selectedPeriod, setSelectedPeriod] = useState(
        [7, 30, 60, 90].includes(Number(period)) ? Number(period) : 30
    );
    const [filter, setFilter] = useState("all");

    const renewals = useMemo(() => {
        const safeWarranties = Array.isArray(warranties) ? warranties : [];
        const safeSubscriptions = Array.isArray(subscriptions)
            ? subscriptions
            : [];

        const records = [
            ...safeWarranties.map((item) => ({
                id: item._id || item.id,
                type: "warranty",
                title: item.title || "Warranty",
                subtitle: item.provider || "Warranty provider unavailable",
                date: item.expiryDate,
            })),

            ...safeSubscriptions
                .filter(
                    (item) =>
                        String(item?.status || "").toLowerCase() === "active"
                )
                .map((item) => ({
                    id: item._id || item.id,
                    type: "subscription",
                    title: item.name || "Subscription",
                    subtitle: item.provider || item.billingCycle || "Subscription",
                    date: item.nextBillingDate,
                })),
        ];

        return records
            .map((item) => ({
                ...item,
                days: getDaysRemaining(item.date),
                parsedDate: getDate(item.date),
            }))
            .filter(
                (item) =>
                    item.days !== null &&
                    item.days >= 0 &&
                    item.days <= selectedPeriod &&
                    item.parsedDate
            )
            .sort(
                (a, b) =>
                    a.parsedDate.getTime() - b.parsedDate.getTime()
            );
    }, [warranties, subscriptions, selectedPeriod]);

    const visibleRenewals = renewals.filter(
        (item) => filter === "all" || item.type === filter
    );

    const urgentCount = renewals.filter(
        (item) => item.days <= 7
    ).length;

    const warrantyCount = renewals.filter(
        (item) => item.type === "warranty"
    ).length;

    const subscriptionCount = renewals.filter(
        (item) => item.type === "subscription"
    ).length;

    return (
        <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900 sm:p-5">
            {/* Header */}
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                        <CalendarClock size={21} />
                    </div>

                    <div className="min-w-0">
                        <h2 className="text-base font-bold text-slate-900 dark:text-white">
                            Upcoming Renewals
                        </h2>
                        <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
                            Warranty expiries and subscription billing dates
                        </p>
                    </div>
                </div>

                <label className="flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
                    <Clock3 size={14} className="text-slate-400" />
                    <select
                        value={selectedPeriod}
                        onChange={(event) =>
                            setSelectedPeriod(Number(event.target.value))
                        }
                        aria-label="Renewal period"
                        className="max-w-28 bg-transparent text-sm font-semibold text-slate-700 outline-none dark:text-slate-200"
                    >
                        <option value={7}>7 days</option>
                        <option value={30}>30 days</option>
                        <option value={60}>60 days</option>
                        <option value={90}>90 days</option>
                    </select>
                </label>
            </div>

            {/* Summary cards */}
            <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/60">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Upcoming items
                    </p>
                    <p className="mt-1.5 text-2xl font-extrabold text-slate-900 dark:text-white">
                        {renewals.length}
                    </p>
                </div>

                <div className="rounded-xl border border-amber-100 bg-amber-50/70 p-3 dark:border-amber-900/40 dark:bg-amber-950/20">
                    <p className="text-xs text-amber-700 dark:text-amber-400">
                        Due within 7 days
                    </p>
                    <p className="mt-1.5 text-2xl font-extrabold text-amber-800 dark:text-amber-300">
                        {urgentCount}
                    </p>
                </div>

                <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 p-3 dark:border-indigo-900/40 dark:bg-indigo-950/20">
                    <p className="text-xs text-indigo-700 dark:text-indigo-300">
                        Warranties / Subscriptions
                    </p>
                    <p className="mt-1.5 text-2xl font-extrabold text-indigo-800 dark:text-indigo-300">
                        {warrantyCount}
                        <span className="mx-1 text-sm font-medium text-indigo-400">/</span>
                        {subscriptionCount}
                    </p>
                </div>
            </div>

            {/* Filter controls */}
            <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                    Renewal timeline
                </p>

                <div className="flex flex-wrap gap-1.5">
                    {FILTERS.map((item) => (
                        <button
                            key={item.value}
                            type="button"
                            onClick={() => setFilter(item.value)}
                            aria-pressed={filter === item.value}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20 ${filter === item.value
                                    ? "bg-indigo-600 text-white"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                                }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Renewal list */}
            {visibleRenewals.length === 0 ? (
                <div className="flex min-h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 px-5 text-center dark:border-slate-700">
                    <CalendarClock size={28} className="mb-3 text-slate-400" />

                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {renewals.length
                            ? "No matching renewals"
                            : "No upcoming renewals"}
                    </p>

                    <p className="mt-2 max-w-xs text-sm leading-5 text-slate-500 dark:text-slate-400">
                        {renewals.length
                            ? "Try selecting another renewal type."
                            : `No valid warranty expiries or active subscription billing dates were found within ${selectedPeriod} days.`}
                    </p>

                    {filter !== "all" && (
                        <button
                            type="button"
                            onClick={() => setFilter("all")}
                            className="mt-3 inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/40"
                        >
                            <RotateCcw size={13} />
                            Show all renewals
                        </button>
                    )}
                </div>
            ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {visibleRenewals.map((item, index) => (
                        <RenewalRow
                            key={`${item.type}-${item.id || item.title}-${item.date}-${index}`}
                            item={item}
                            index={index}
                        />
                    ))}
                </div>
            )}

            <p className="mt-4 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-400 dark:border-slate-800">
                Only valid, non-expired dates are shown. Urgent means due within 7
                calendar days. Reminder notifications require a separate notification
                service.
            </p>
        </section>
    );
}
