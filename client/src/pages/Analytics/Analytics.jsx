import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    Activity,
    AlertCircle,
    ArrowDownRight,
    ArrowUpRight,
    CalendarClock,
    CalendarDays,
    CheckCircle2,
    ChevronRight,
    CreditCard,
    Download,
    FileBarChart,
    Filter,
    Package,
    RefreshCw,
    Search,
    ShieldAlert,
    ShieldCheck,
    Sparkles,
    Wallet,
    X,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { getAnalyticsOverview } from "../../services/analytics.service";

const PERIODS = [
    { label: "7 days", value: 7 },
    { label: "30 days", value: 30 },
    { label: "90 days", value: 90 },
];

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

const numberFormatter = new Intl.NumberFormat("en-IN");

const formatCurrency = (value, currency = "INR") => {
    const amount = Number.isFinite(Number(value)) ? Number(value) : 0;
    const code = /^[A-Z]{3}$/.test(String(currency)) ? currency : "INR";
    try {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: code,
            maximumFractionDigits: 0,
        }).format(amount);
    } catch {
        return `${code} ${numberFormatter.format(amount)}`;
    }
};

const formatNumber = (value) =>
    numberFormatter.format(Number.isFinite(Number(value)) ? Number(value) : 0);

const getDate = (value) => {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
};

const startOfDay = (value = new Date()) => {
    const date = new Date(value);
    date.setHours(0, 0, 0, 0);
    return date;
};

const getDaysRemaining = (value) => {
    const date = getDate(value);
    if (!date) return null;
    return Math.round(
        (startOfDay(date).getTime() - startOfDay().getTime()) / 86400000
    );
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

const getMonthlyAmount = (subscription) => {
    const amount = Number(subscription?.amount);
    if (!Number.isFinite(amount) || amount < 0) return null;

    let normalized;
    switch (String(subscription?.billingCycle || "monthly").toLowerCase()) {
        case "weekly":
            normalized = (amount * 52) / 12;
            break;
        case "monthly":
            normalized = amount;
            break;
        case "quarterly":
            normalized = amount / 3;
            break;
        case "half-yearly":
        case "half yearly":
            normalized = amount / 6;
            break;
        case "yearly":
        case "annually":
        case "annual":
            normalized = amount / 12;
            break;
        default:
            return null;
    }
    return Number.isFinite(normalized) ? normalized : null;
};

const downloadCSV = (filename, rows) => {
    if (!Array.isArray(rows) || !rows.length) return;

    const escapeCSV = (value) => {
        let text = String(value ?? "");
        // Prevent spreadsheet formula injection for user-controlled text fields.
        if (/^[\s]*[=+\-@]/.test(text)) text = `'${text}`;
        return `"${text.replace(/"/g, '""')}"`;
    };

    const csv = rows.map((row) => row.map(escapeCSV).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF" + csv], {
        type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};

function Card({ children, className = "" }) {
    return (
        <section
            className={`min-w-0 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 sm:p-5 ${className}`}
        >
            {children}
        </section>
    );
}

function SectionHeading({ title, description, icon: Icon, action }) {
    return (
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
                {Icon && (
                    <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                        <Icon size={19} aria-hidden="true" />
                    </div>
                )}
                <div className="min-w-0">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                        {title}
                    </h2>
                    <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
                        {description}
                    </p>
                </div>
            </div>
            {action}
        </div>
    );
}

function MetricCard({ title, value, description, icon: Icon, accent, index = 0, reduceMotion }) {
    return (
        <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.28, delay: reduceMotion ? 0 : index * 0.05 }}
            className="min-w-0"
        >
            <div className="group h-full rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
                        <p className="mt-3 break-words text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl" title={String(value)}>
                            {value}
                        </p>
                    </div>
                    <div className={`shrink-0 rounded-2xl p-3 transition-transform duration-300 group-hover:scale-105 ${accent}`}>
                        <Icon size={21} aria-hidden="true" />
                    </div>
                </div>
                <p className="mt-4 text-xs leading-5 text-slate-500 dark:text-slate-400">{description}</p>
            </div>
        </motion.div>
    );
}

function EmptyState({ message, icon: Icon = Activity }) {
    return (
        <div className="flex min-h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 px-5 py-8 text-center dark:border-slate-700">
            <div className="mb-3 rounded-2xl bg-slate-100 p-3 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <Icon size={25} aria-hidden="true" />
            </div>
            <p className="max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">{message}</p>
        </div>
    );
}

function DonutChart({ data = [] }) {
    const total = data.reduce((sum, item) => sum + Math.max(0, Number(item.value) || 0), 0);
    const radius = 56;
    const circumference = 2 * Math.PI * radius;

    const segments = useMemo(() => {
        let offset = 0;
        return data
            .map((item, index) => {
                const value = Math.max(0, Number(item.value) || 0);
                const percentage = total ? (value / total) * 100 : 0;
                const dash = (percentage / 100) * circumference;
                const segment = {
                    ...item,
                    value,
                    percentage,
                    dash,
                    offset,
                    color: item.color || COLORS[index % COLORS.length],
                };
                offset += dash;
                return segment;
            })
            .filter((item) => item.value > 0);
    }, [data, total, circumference]);

    if (!total) {
        return <EmptyState message="Add assets to see how your records are distributed by category." icon={Package} />;
    }

    return (
        <div className="flex min-w-0 flex-col items-center gap-6 md:flex-row md:gap-8">
            <div className="relative w-full max-w-52 shrink-0">
                <svg viewBox="0 0 160 160" className="w-full" role="img" aria-label={`Asset distribution across ${segments.length} categories`}>
                    <circle cx="80" cy="80" r={radius} fill="none" stroke="currentColor" strokeOpacity="0.09" strokeWidth="19" />
                    {segments.map((item) => (
                        <circle
                            key={item.label}
                            cx="80"
                            cy="80"
                            r={radius}
                            fill="none"
                            stroke={item.color}
                            strokeWidth="19"
                            strokeDasharray={`${item.dash} ${circumference - item.dash}`}
                            strokeDashoffset={-item.offset}
                            transform="rotate(-90 80 80)"
                            className="transition-all duration-500"
                        >
                            <title>{`${item.label}: ${item.value} assets (${item.percentage.toFixed(1)}%)`}</title>
                        </circle>
                    ))}
                    <text x="80" y="76" textAnchor="middle" fontSize="27" fontWeight="700" fill="currentColor">{total}</text>
                    <text x="80" y="96" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.65">Total assets</text>
                </svg>
            </div>

            <div className="w-full min-w-0 space-y-4">
                {segments.map((item) => (
                    <div key={item.label} className="min-w-0">
                        <div className="mb-2 flex items-center justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-2">
                                <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">{item.label}</span>
                            </div>
                            <div className="shrink-0 text-right">
                                <span className="text-sm font-bold text-slate-900 dark:text-white">{item.value}</span>
                                <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">{item.percentage.toFixed(0)}%</span>
                            </div>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${item.percentage}%` }} transition={{ duration: 0.55 }} className="h-full rounded-full" style={{ backgroundColor: item.color }} />
                        </div>
                    </div>
                ))}
                <p className="border-t border-slate-100 pt-3 text-xs text-slate-400 dark:border-slate-800">
                    Distribution is based on the category field in your asset records.
                </p>
            </div>
        </div>
    );
}

function SpendingChart({ data = [] }) {
    const currencies = [...new Set(data.flatMap((item) => Object.keys(item.amounts || {})))];
    if (!data.length || !currencies.length) {
        return <EmptyState message="No supported active subscription costs are available yet." icon={Wallet} />;
    }

    return (
        <div className="space-y-6">
            {currencies.map((currency) => {
                const amounts = data.map((item) => Number(item.amounts?.[currency]) || 0);
                const maxValue = Math.max(1, ...amounts);
                const current = amounts.at(-1) || 0;
                const previous = amounts.at(-2) || 0;
                const change = previous > 0 ? ((current - previous) / previous) * 100 : null;
                return (
                    <div key={currency} className="space-y-3">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{currency}</p>
                            <p className="text-lg font-bold text-slate-900 dark:text-white">{formatCurrency(current, currency)} <span className="text-xs font-medium text-slate-500">estimated monthly</span></p>
                        </div>
                        {change !== null && <p className="text-xs text-slate-500 dark:text-slate-400">{change > 0 ? "Up" : change < 0 ? "Down" : "Unchanged"} {Math.abs(change).toFixed(1)}% from the prior month estimate</p>}
                        <div className="space-y-3">
                            {data.map((item, index) => {
                                const amount = amounts[index];
                                const width = Math.max(0, (amount / maxValue) * 100);
                                return (
                                    <div key={`${currency}-${item.label}`}>
                                        <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                                            <span className="text-slate-600 dark:text-slate-300">{item.label}</span>
                                            <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(amount, currency)}</span>
                                        </div>
                                        <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                            <motion.div initial={{ width: 0 }} animate={{ width: `${width}%` }} transition={{ duration: 0.55, delay: index * 0.035 }} className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500" />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function RenewalItem({ item }) {
    const expired = item.days !== null && item.days < 0;
    const urgent = item.days !== null && item.days >= 0 && item.days <= 7;
    const iconClass = expired
        ? "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400"
        : urgent
            ? "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400"
            : "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400";

    const statusText = item.days === null
        ? "Date unavailable"
        : expired
            ? `${Math.abs(item.days)}d overdue`
            : item.days === 0
                ? "Due today"
                : item.days === 1
                    ? "Tomorrow"
                    : `${item.days}d left`;

    return (
        <div className="flex min-w-0 items-center gap-3 py-4">
            <div className={`shrink-0 rounded-xl p-3 ${iconClass}`}>
                {item.type === "warranty" ? <ShieldCheck size={19} aria-hidden="true" /> : <CalendarClock size={19} aria-hidden="true" />}
            </div>
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{item.title}</p>
                <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">{item.subtitle} · {formatDate(item.date)}</p>
                <span className="mt-2 inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {item.type === "warranty" ? "Warranty" : "Subscription"}
                </span>
            </div>
            <div className="shrink-0 text-right">
                <p className={`text-xs font-bold ${expired ? "text-rose-600 dark:text-rose-400" : urgent ? "text-amber-600 dark:text-amber-400" : "text-slate-500 dark:text-slate-400"}`}>{statusText}</p>
            </div>
        </div>
    );
}

function SkeletonCard() {
    return (
        <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="h-4 w-28 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="mt-5 h-8 w-36 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="mt-4 h-3 w-44 max-w-full rounded bg-slate-100 dark:bg-slate-800" />
        </div>
    );
}

function RecordHealth({ assets, warranties }) {
    const health = useMemo(() => {
        const validAssets = Array.isArray(assets) ? assets : [];
        const validWarranties = Array.isArray(warranties) ? warranties : [];
        const activeAssets = validAssets.filter((item) => String(item?.status || "").toLowerCase() === "active").length;
        const datedWarranties = validWarranties.filter((item) => getDaysRemaining(item?.expiryDate) !== null);
        const validWarrantiesCount = datedWarranties.filter((item) => getDaysRemaining(item.expiryDate) >= 0).length;
        const expiredWarrantiesCount = datedWarranties.length - validWarrantiesCount;
        const invalidWarrantyDates = validWarranties.length - datedWarranties.length;

        // This is a transparent record-status ratio, not a medical/security risk score.
        const totalWarrantiesWithDates = datedWarranties.length;
        const warrantyRatio = totalWarrantiesWithDates ? (validWarrantiesCount / totalWarrantiesWithDates) * 100 : null;
        const assetRatio = validAssets.length ? (activeAssets / validAssets.length) * 100 : null;

        return {
            activeAssets,
            totalAssets: validAssets.length,
            validWarrantiesCount,
            expiredWarrantiesCount,
            invalidWarrantyDates,
            warrantyRatio,
            assetRatio,
        };
    }, [assets, warranties]);

    const score = health.warrantyRatio === null ? null : Math.round(health.warrantyRatio);
    const radius = 47;
    const circumference = 2 * Math.PI * radius;
    const dash = score === null ? 0 : (score / 100) * circumference;

    return (
        <Card>
            <SectionHeading title="Record Health" description="A transparent view of active assets and warranty status." icon={ShieldCheck} />
            <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
                <div className="relative w-40 shrink-0">
                    <svg viewBox="0 0 120 120" className="w-full" role="img" aria-label={score === null ? "Warranty health unavailable" : `${score}% of dated warranties are not expired`}>
                        <circle cx="60" cy="60" r={radius} fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth="11" />
                        {score !== null && (
                            <circle cx="60" cy="60" r={radius} fill="none" stroke={score >= 80 ? "#10b981" : score >= 50 ? "#f59e0b" : "#f43f5e"} strokeWidth="11" strokeLinecap="round" strokeDasharray={`${dash} ${circumference - dash}`} transform="rotate(-90 60 60)" className="transition-all duration-700" />
                        )}
                        <text x="60" y="57" textAnchor="middle" fontSize="23" fontWeight="700" fill="currentColor">{score === null ? "—" : `${score}%`}</text>
                        <text x="60" y="74" textAnchor="middle" fontSize="8" fill="currentColor" opacity="0.65">WARRANTY STATUS</text>
                    </svg>
                </div>
                <div className="w-full min-w-0 space-y-3">
                    <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                        <span className="text-sm text-slate-600 dark:text-slate-300">Active assets</span>
                        <span className="font-bold text-slate-900 dark:text-white">{health.activeAssets} / {health.totalAssets}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 rounded-xl bg-emerald-50/70 p-3 dark:bg-emerald-950/20">
                        <span className="text-sm text-emerald-800 dark:text-emerald-300">Valid warranties</span>
                        <span className="font-bold text-emerald-800 dark:text-emerald-300">{health.validWarrantiesCount}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 rounded-xl bg-rose-50/70 p-3 dark:bg-rose-950/20">
                        <span className="text-sm text-rose-800 dark:text-rose-300">Expired warranties</span>
                        <span className="font-bold text-rose-800 dark:text-rose-300">{health.expiredWarrantiesCount}</span>
                    </div>
                    {health.invalidWarrantyDates > 0 && (
                        <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">{health.invalidWarrantyDates} warranty record(s) have missing or invalid expiry dates and are excluded from the percentage.</p>
                    )}
                    {score === null && <p className="text-xs text-slate-500 dark:text-slate-400">Add warranties with expiry dates to calculate this ratio.</p>}
                </div>
            </div>
            <p className="mt-4 border-t border-slate-100 pt-3 text-xs leading-5 text-slate-400 dark:border-slate-800">Percentage = non-expired warranties ÷ warranties with valid expiry dates. It is a record-status indicator, not a prediction of asset condition.</p>
        </Card>
    );
}

export default function Analytics() {
    const reduceMotion = useReducedMotion();
    const [period, setPeriod] = useState(30);
    const [assets, setAssets] = useState([]);
    const [warranties, setWarranties] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [showAllRenewals, setShowAllRenewals] = useState(false);
    const requestIdRef = useRef(0);

    const loadAnalytics = useCallback(async (isRefresh = false) => {
        const requestId = ++requestIdRef.current;
        if (isRefresh) setRefreshing(true);
        else setLoading(true);
        setError("");

        try {
            const overview = await getAnalyticsOverview();
            if (requestId !== requestIdRef.current) return;
            setAssets(overview.assets);
            setWarranties(overview.warranties);
            setSubscriptions(overview.subscriptions);
        } catch (err) {
            if (requestId !== requestIdRef.current) return;
            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Unable to load analytics. Please try again.",
            );
        } finally {
            if (requestId === requestIdRef.current) {
                setLoading(false);
                setRefreshing(false);
            }
        }
    }, []);

    useEffect(() => {
        loadAnalytics();
        const handleDataChange = () => loadAnalytics(true);
        const events = [
            "everkeep:assets:changed",
            "everkeep:warranties:changed",
            "everkeep:subscriptions:changed",
        ];
        events.forEach((eventName) => window.addEventListener(eventName, handleDataChange));
        return () => events.forEach((eventName) => window.removeEventListener(eventName, handleDataChange));
    }, [loadAnalytics]);

    const analytics = useMemo(() => {
        const safeAssets = Array.isArray(assets) ? assets : [];
        const safeWarranties = Array.isArray(warranties) ? warranties : [];
        const safeSubscriptions = Array.isArray(subscriptions) ? subscriptions : [];
        const activeAssets = safeAssets.filter((item) => String(item?.status || "").toLowerCase() === "active");
        const activeSubscriptions = safeSubscriptions.filter((item) => String(item?.status || "").toLowerCase() === "active");

        const totalAssetValue = safeAssets.reduce((sum, item) => {
            const value = Number(item?.purchasePrice);
            return sum + (Number.isFinite(value) && value > 0 ? value : 0);
        }, 0);

        const monthlySpendByCurrency = {};
        activeSubscriptions.forEach((item) => {
            const amount = getMonthlyAmount(item);
            if (amount === null) return;
            const currency = String(item?.currency || "INR").trim().toUpperCase();
            if (!/^[A-Z]{3}$/.test(currency)) return;
            monthlySpendByCurrency[currency] = (monthlySpendByCurrency[currency] || 0) + amount;
        });
        const unsupportedBillingCycles = activeSubscriptions.filter((item) =>
            getMonthlyAmount(item) === null ||
            !/^[A-Z]{3}$/.test(String(item?.currency || "INR").trim().toUpperCase())
        ).length;

        const categoryCounts = safeAssets.reduce((result, item) => {
            const category = String(item?.category || "Other").trim() || "Other";
            result[category] = (result[category] || 0) + 1;
            return result;
        }, {});

        const categoryData = Object.entries(categoryCounts)
            .map(([label, value], index) => ({ label, value, color: COLORS[index % COLORS.length] }))
            .sort((a, b) => b.value - a.value);

        const warrantyRenewals = safeWarranties.map((item) => ({
            id: item?._id || item?.id || item?.title || "warranty",
            title: item?.title || item?.name || "Warranty",
            subtitle: item?.provider || item?.company || "Warranty provider",
            date: item?.expiryDate,
            days: getDaysRemaining(item?.expiryDate),
            type: "warranty",
        }));

        const subscriptionRenewals = activeSubscriptions.map((item) => ({
            id: item?._id || item?.id || item?.name || "subscription",
            title: item?.name || item?.title || "Subscription",
            subtitle: item?.provider || item?.billingCycle || "Subscription provider",
            date: item?.nextBillingDate,
            days: getDaysRemaining(item?.nextBillingDate),
            type: "subscription",
        }));

        const allRenewals = [...warrantyRenewals, ...subscriptionRenewals]
            .filter((item) => item.days !== null)
            .sort((a, b) => a.days - b.days);

        const upcomingRenewals = allRenewals.filter((item) => item.days >= 0 && item.days <= period);
        const expiredWarranties = warrantyRenewals.filter((item) => item.days !== null && item.days < 0).length;
        const expiringWarranties = warrantyRenewals.filter((item) => item.days !== null && item.days >= 0 && item.days <= period).length;

        const now = new Date();
        const monthlyData = Array.from({ length: 6 }, (_, index) => {
            const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
            return {
                label: date.toLocaleDateString("en-IN", { month: "short", year: "2-digit" }),
                month: date.getMonth(),
                year: date.getFullYear(),
                amounts: {},
            };
        });

        activeSubscriptions.forEach((item) => {
            const startDate = getDate(item?.startDate);
            const amount = getMonthlyAmount(item);
            if (amount === null) return;
            const currency = String(item?.currency || "INR").trim().toUpperCase();
            if (!/^[A-Z]{3}$/.test(currency)) return;
            monthlyData.forEach((month) => {
                const monthDate = new Date(month.year, month.month, 1);
                if (!startDate || startOfDay(startDate) <= monthDate) {
                    month.amounts[currency] = (month.amounts[currency] || 0) + amount;
                }
            });
        });

        return {
            totalAssetValue,
            activeAssets: activeAssets.length,
            monthlySpendByCurrency,
            activeSubscriptions: activeSubscriptions.length,
            unsupportedBillingCycles,
            categoryData,
            monthlyData,
            upcomingRenewals,
            allRenewals,
            expiredWarranties,
            expiringWarranties,
        };
    }, [assets, warranties, subscriptions, period]);

    const filteredRenewals = useMemo(() => {
        const query = search.trim().toLowerCase();
        return analytics.upcomingRenewals.filter((item) => {
            const matchesSearch = !query || item.title.toLowerCase().includes(query) || item.subtitle.toLowerCase().includes(query);
            const matchesType = typeFilter === "all" || item.type === typeFilter;
            return matchesSearch && matchesType;
        });
    }, [analytics.upcomingRenewals, search, typeFilter]);

    const exportReport = useCallback(() => {
        const rows = [
            ["EverKeep Analytics Report"],
            ["Generated at", new Date().toLocaleString("en-IN")],
            [],
            ["Summary"],
            ["Metric", "Value"],
            ["Total assets", assets.length],
            ["Active assets", analytics.activeAssets],
            ["Total asset value (INR)", analytics.totalAssetValue],
            ["Active subscriptions", analytics.activeSubscriptions],
            ...Object.entries(analytics.monthlySpendByCurrency).map(
                ([currency, amount]) => [`Estimated monthly spend (${currency})`, amount],
            ),
            ["Expired warranties", analytics.expiredWarranties],
            [`Upcoming renewals in next ${period} days`, analytics.upcomingRenewals.length],
            [],
            ["Upcoming Renewals"],
            ["Type", "Title", "Provider", "Date", "Days remaining"],
            ...analytics.upcomingRenewals.map((item) => [item.type, item.title, item.subtitle, formatDate(item.date), item.days]),
            [],
            ["Asset Categories"],
            ["Category", "Asset count", "Share (%)"],
            ...analytics.categoryData.map((item) => [item.label, item.value, assets.length ? ((item.value / assets.length) * 100).toFixed(1) : 0]),
        ];
        downloadCSV(`everkeep-analytics-${new Date().toISOString().slice(0, 10)}.csv`, rows);
    }, [assets, analytics, period]);

    if (loading) {
        return (
            <div className="space-y-7 pb-8">
                <div className="animate-pulse">
                    <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="mt-3 h-8 w-64 max-w-full rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="mt-3 h-4 w-80 max-w-full rounded bg-slate-100 dark:bg-slate-800" />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <SkeletonCard key={index} />)}</div>
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-2"><SkeletonCard /><SkeletonCard /></div>
            </div>
        );
    }

    if (error && !assets.length && !warranties.length && !subscriptions.length) {
        return (
            <div className="mx-auto max-w-xl py-12">
                <Card>
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400"><AlertCircle size={28} /></div>
                    <h2 className="text-center text-lg font-bold text-slate-900 dark:text-white">Analytics unavailable</h2>
                    <p className="mt-2 text-center text-sm leading-6 text-slate-500 dark:text-slate-400">{error}</p>
                    <button type="button" onClick={() => loadAnalytics(true)} disabled={refreshing} className="mx-auto mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60">
                        <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} /> Try again
                    </button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-w-0 space-y-7 pb-8">
            <div className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-5 dark:border-indigo-950 dark:from-indigo-950/50 dark:via-slate-900 dark:to-violet-950/30 sm:p-7 lg:p-8">
                <div className="pointer-events-none absolute -right-10 -top-14 h-48 w-48 rounded-full bg-indigo-300/20 blur-3xl dark:bg-indigo-500/10" />
                <div className="pointer-events-none absolute -bottom-20 right-1/3 h-40 w-40 rounded-full bg-violet-300/20 blur-3xl dark:bg-violet-500/10" />
                <div className="relative flex flex-col justify-between gap-5 md:flex-row md:items-center">
                    <div className="min-w-0">
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:border-indigo-800 dark:bg-slate-900/80 dark:text-indigo-300"><Sparkles size={14} /> INSIGHTS & REPORTS</div>
                        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl lg:text-4xl">Analytics Overview</h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">A clearer view of your assets, recurring expenses and upcoming renewals — all in one place.</p>
                        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                            <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-500" /> Account records</span>
                            <span className="inline-flex items-center gap-1.5"><CalendarDays size={14} /> {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
                        </div>
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-2">
                        <button type="button" onClick={exportReport} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"><Download size={16} /> Export CSV</button>
                        <button type="button" onClick={() => loadAnalytics(true)} disabled={refreshing} className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"><RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />{refreshing ? "Refreshing..." : "Refresh"}</button>
                    </div>
                </div>
            </div>

            {error && <div role="status" className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300"><AlertCircle size={18} className="mt-0.5 shrink-0" /><p>{error}</p></div>}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard index={0} reduceMotion={reduceMotion} title="Total Assets" value={formatNumber(assets.length)} description={`${formatNumber(analytics.activeAssets)} currently active`} icon={Package} accent="bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400" />
                <MetricCard index={1} reduceMotion={reduceMotion} title="Total Asset Value" value={formatCurrency(analytics.totalAssetValue)} description="Sum of recorded purchase prices" icon={Wallet} accent="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400" />
                <MetricCard index={2} reduceMotion={reduceMotion} title="Monthly Subscription Cost" value={Object.entries(analytics.monthlySpendByCurrency).length ? Object.entries(analytics.monthlySpendByCurrency).map(([currency, amount]) => formatCurrency(amount, currency)).join(" · ") : "—"} description="Estimated cost, shown separately by currency" icon={CreditCard} accent="bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400" />
                <MetricCard index={3} reduceMotion={reduceMotion} title="Active Subscriptions" value={formatNumber(analytics.activeSubscriptions)} description={`${analytics.upcomingRenewals.filter((item) => item.type === "subscription").length} upcoming in selected period`} icon={CalendarClock} accent="bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-4 rounded-2xl border border-rose-100 bg-rose-50/70 p-4 dark:border-rose-950 dark:bg-rose-950/20 sm:p-5">
                    <div className="rounded-xl bg-white p-3 text-rose-600 shadow-sm dark:bg-slate-900 dark:text-rose-400"><ShieldAlert size={22} /></div>
                    <div className="min-w-0"><p className="text-sm font-medium text-rose-800 dark:text-rose-300">Expired warranties</p><p className="mt-1 text-2xl font-bold text-rose-700 dark:text-rose-200">{formatNumber(analytics.expiredWarranties)}</p></div>
                    <ArrowDownRight className="ml-auto shrink-0 text-rose-500" size={22} />
                </div>
                <div className="flex items-center gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 dark:border-emerald-950 dark:bg-emerald-950/20 sm:p-5">
                    <div className="rounded-xl bg-white p-3 text-emerald-600 shadow-sm dark:bg-slate-900 dark:text-emerald-400"><ShieldCheck size={22} /></div>
                    <div className="min-w-0"><p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">Warranties expiring in {period} days</p><p className="mt-1 text-2xl font-bold text-emerald-700 dark:text-emerald-200">{formatNumber(analytics.expiringWarranties)}</p></div>
                    <ArrowUpRight className="ml-auto shrink-0 text-emerald-500" size={22} />
                </div>
            </div>

            <div className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-2">
                <Card>
                    <SectionHeading title="Asset Distribution" description="Understand how your assets are spread across categories." icon={Package} />
                    <DonutChart data={analytics.categoryData} />
                </Card>
                <Card>
                    <SectionHeading title="Subscription Spending" description="Estimated monthly cost by currency, based on active subscriptions and their start dates." icon={Wallet} action={<span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-950/60 dark:text-violet-300">6 months</span>} />
                    <SpendingChart data={analytics.monthlyData} />
                    <p className="mt-5 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-500 dark:border-slate-800 dark:text-slate-400">These are estimates based on current active subscriptions and their start dates. They are not historical payment transactions.{analytics.unsupportedBillingCycles > 0 ? ` ${analytics.unsupportedBillingCycles} subscription(s) have unsupported billing cycles, amounts, or currency codes and are excluded from spending totals.` : ""}</p>
                </Card>
            </div>

            <RecordHealth assets={assets} warranties={warranties} />

            <Card>
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                    <SectionHeading title="Upcoming Renewals" description="Find warranty expiries and subscription billing dates." icon={CalendarClock} />
                    <div className="flex flex-wrap items-center gap-2">
                        {PERIODS.map((item) => (
                            <button key={item.value} type="button" onClick={() => { setPeriod(item.value); setShowAllRenewals(false); }} aria-pressed={period === item.value} className={`rounded-xl px-3 py-2 text-xs font-semibold transition sm:text-sm ${period === item.value ? "bg-indigo-600 text-white shadow-sm" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"}`}>{item.label}</button>
                        ))}
                    </div>
                </div>

                <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_190px]">
                    <div className="relative min-w-0">
                        <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name or provider..." aria-label="Search upcoming renewals" className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
                        {search && <button type="button" onClick={() => setSearch("")} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white"><X size={16} /></button>}
                    </div>
                    <div className="relative">
                        <Filter size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} aria-label="Filter renewals by type" className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
                            <option value="all">All types</option><option value="warranty">Warranties</option><option value="subscription">Subscriptions</option>
                        </select>
                    </div>
                </div>

                <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>{filteredRenewals.length} result{filteredRenewals.length === 1 ? "" : "s"} · Next {period} days</span>
                    {(search || typeFilter !== "all") && <button type="button" onClick={() => { setSearch(""); setTypeFilter("all"); }} className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">Clear filters</button>}
                </div>

                {filteredRenewals.length ? (
                    <>
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {(showAllRenewals ? filteredRenewals : filteredRenewals.slice(0, 6)).map((item, index) => (
                                <motion.div key={`${item.type}-${item.id}-${index}`} initial={reduceMotion ? false : { opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.2, delay: reduceMotion ? 0 : Math.min(index * 0.025, 0.2) }}>
                                    <RenewalItem item={item} />
                                </motion.div>
                            ))}
                        </div>
                        {filteredRenewals.length > 6 && <button type="button" onClick={() => setShowAllRenewals((current) => !current)} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">{showAllRenewals ? "Show less" : "View all renewals"}<ChevronRight size={16} className={`transition-transform ${showAllRenewals ? "-rotate-90" : "rotate-90"}`} /></button>}
                    </>
                ) : (
                    <EmptyState icon={Search} message={search || typeFilter !== "all" ? "No renewals match your search or selected filter." : `No upcoming expiries or billing dates in the next ${period} days.`} />
                )}
            </Card>

            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/50 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-white p-2.5 text-slate-600 shadow-sm dark:bg-slate-800 dark:text-slate-300"><FileBarChart size={19} /></div>
                    <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Your analytics report</p>
                        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">Values are calculated from records returned by your APIs. Spending history is an estimate, not a record of past payments.</p>
                    </div>
                </div>
                <button type="button" onClick={exportReport} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:text-indigo-300"><Download size={16} /> Download report</button>
            </div>
        </div>
    );
}
