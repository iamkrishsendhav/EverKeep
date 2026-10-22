
import {
    Bell,
    CreditCard,
    FileText,
    UsersRound,
    CalendarDays,
    Package,
    ShieldCheck,
    Wrench,
} from "lucide-react";

export const NOTIFICATION_FILTERS = [
    { value: "all", label: "All" },
    { value: "unread", label: "Unread" },
    { value: "warranty", label: "Warranties" },
    { value: "subscription", label: "Subscriptions" },
    { value: "asset", label: "Assets" },
    { value: "document", label: "Documents" },
    { value: "family", label: "Family" },
    { value: "calendar", label: "Calendar" },
    { value: "system", label: "System" },
];

export const NOTIFICATION_CATEGORIES = {
    warranty: {
        label: "Warranty",
        icon: ShieldCheck,
        tone: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    },

    subscription: {
        label: "Subscription",
        icon: CreditCard,
        tone: "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300",
    },

    asset: {
        label: "Asset",
        icon: Package,
        tone: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300",
    },

    document: {
        label: "Document",
        icon: FileText,
        tone: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
    },

    family: {
        label: "Family",
        icon: UsersRound,
        tone: "bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-950/40 dark:text-fuchsia-300",
    },

    calendar: {
        label: "Calendar",
        icon: CalendarDays,
        tone: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300",
    },

    system: {
        label: "System",
        icon: Wrench,
        tone: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    },
};

export const NOTIFICATION_PRIORITIES = {
    critical: {
        label: "Critical",
        border: "border-l-red-700",
    },
    high: {
        label: "Important",
        border: "border-l-rose-500",
    },

    medium: {
        label: "Medium",
        border: "border-l-amber-500",
    },

    low: {
        label: "Low",
        border: "border-l-indigo-400",
    },
};

export const DEFAULT_NOTIFICATION_CATEGORY = {
    label: "Notification",
    icon: Bell,
    tone: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

export const DEFAULT_NOTIFICATION_PRIORITY =
    NOTIFICATION_PRIORITIES.low;

export const getNotificationCategory = (category) =>
    NOTIFICATION_CATEGORIES[category] ||
    DEFAULT_NOTIFICATION_CATEGORY;

export const getNotificationPriority = (priority) =>
    NOTIFICATION_PRIORITIES[priority] ||
    DEFAULT_NOTIFICATION_PRIORITY;

export const isNotificationRead = (notification) =>
    Boolean(notification?.readAt);
