
import { useMemo } from "react";
import {
    ShieldCheck,
    CalendarClock,
    AlertTriangle,
    CreditCard,
    PackageCheck,
    Info,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const DAY_MS = 86400000;

const getDaysRemaining = (value) => {
    if (!value) return null;

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    return Math.round((date.getTime() - today.getTime()) / DAY_MS);
};

const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(Number.isFinite(value) ? value : 0);

const getMonthlyAmount = (subscription) => {
    const amount = Number(subscription?.amount);

    if (!Number.isFinite(amount) || amount < 0) return null;

    switch (subscription?.billingCycle) {
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

function StatItem({
    icon: Icon,
    label,
    value,
    detail,
    tone,
    reduceMotion,
    index,
}) {
    return (
        <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: reduceMotion ? 0 : 0.25,
                delay: reduceMotion ? 0 : index * 0.05,
            }}
            className="flex min-w-0 items-start gap-3 rounded-xl border border-slate-100 bg-white p-3.5 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/50 sm:p-4"
        >
            <div className={`shrink-0 rounded-xl p-2.5 ${tone}`}>
                <Icon size={19} aria-hidden="true" />
            </div>

            <div className="min-w-0 flex-1">
                <p className="text-xs font-medium leading-5 text-slate-500 dark:text-slate-400">
                    {label}
                </p>

                <p className="mt-1 break-words text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                    {value}
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    {detail}
                </p>
            </div>
        </motion.div>
    );
}

export default function Statistics({
    warranties = [],
    subscriptions = [],
    period = 30,
}) {
    const reduceMotion = useReducedMotion();

    const stats = useMemo(() => {
        const safeWarranties = Array.isArray(warranties) ? warranties : [];
        const safeSubscriptions = Array.isArray(subscriptions)
            ? subscriptions
            : [];

        let expired = 0;
        let expiringSoon = 0;
        let valid = 0;
        let invalidWarrantyDates = 0;

        safeWarranties.forEach((warranty) => {
            const days = getDaysRemaining(warranty?.expiryDate);

            if (days === null) {
                invalidWarrantyDates += 1;
                return;
            }

            if (days < 0) {
                expired += 1;
                return;
            }

            valid += 1;

            if (days <= period) {
                expiringSoon += 1;
            }
        });

        const activeSubscriptions = safeSubscriptions.filter(
            (subscription) =>
                String(subscription?.status || "").toLowerCase() === "active"
        );

        let monthlySpend = 0;
        let includedSubscriptions = 0;
        let excludedSubscriptions = 0;

        activeSubscriptions.forEach((subscription) => {
            const monthlyAmount = getMonthlyAmount(subscription);

            if (monthlyAmount === null) {
                excludedSubscriptions += 1;
                return;
            }

            monthlySpend += monthlyAmount;
            includedSubscriptions += 1;
        });

        return {
            totalWarranties: safeWarranties.length,
            expired,
            expiringSoon,
            valid,
            invalidWarrantyDates,
            activeSubscriptions: activeSubscriptions.length,
            monthlySpend,
            includedSubscriptions,
            excludedSubscriptions,
        };
    }, [warranties, subscriptions, period]);

    const items = [
        {
            icon: ShieldCheck,
            label: "Valid warranties",
            value: stats.valid,
            detail: "Not yet expired",
            tone:
                "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
        },
        {
            icon: CalendarClock,
            label: "Expiring soon",
            value: stats.expiringSoon,
            detail: `Within the next ${period} days`,
            tone:
                "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
        },
        {
            icon: AlertTriangle,
            label: "Expired warranties",
            value: stats.expired,
            detail: "May need your attention",
            tone:
                "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400",
        },
        {
            icon: CreditCard,
            label: "Estimated monthly cost",
            value: formatCurrency(stats.monthlySpend),
            detail: `${stats.includedSubscriptions} subscriptions included`,
            tone:
                "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400",
        },
    ];

    return (
        <motion.section
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.3 }}
            className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5"
        >
            <div className="mb-5 flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                    <PackageCheck size={21} aria-hidden="true" />
                </div>

                <div className="min-w-0 flex-1">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                        Financial & Warranty Summary
                    </h2>

                    <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
                        A quick overview of warranty protection and recurring costs.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {items.map((item, index) => (
                    <StatItem
                        key={item.label}
                        {...item}
                        index={index}
                        reduceMotion={reduceMotion}
                    />
                ))}
            </div>

            <div className="mt-4 flex items-start gap-2 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                <Info
                    size={15}
                    className="mt-0.5 shrink-0 text-slate-400"
                    aria-hidden="true"
                />

                <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
                    Monthly spending is estimated from active subscriptions with supported
                    billing cycles.{" "}
                    {stats.excludedSubscriptions > 0
                        ? `${stats.excludedSubscriptions} active subscription(s) were excluded because their amount or billing cycle could not be calculated.`
                        : "All active subscriptions with supported billing cycles are included."}
                    {stats.invalidWarrantyDates > 0 &&
                        ` ${stats.invalidWarrantyDates} warranty record(s) have missing or invalid expiry dates.`}
                </p>
            </div>
        </motion.section>
    );
}
