
import { motion, useReducedMotion } from "framer-motion";
import {
    BellRing,
    Check,
    Clock3,
    ExternalLink,
    X,
} from "lucide-react";

import {
    getNotificationCategory,
    getNotificationPriority,
    isNotificationRead,
} from "./notificationConfig.js";

const formatDate = (value) => {
    if (!value) return "Date unavailable";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Date unavailable";
    }

    return date.toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
};

const timeAgo = (value) => {
    if (!value) return "Date unavailable";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Date unavailable";
    }

    const diff = Date.now() - date.getTime();

    if (diff < 0) return formatDate(value);

    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);

    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);

    if (days < 7) return `${days}d ago`;

    return formatDate(value);
};

export default function NotificationItem({
    item,
    onToggleRead,
    onDismiss,
    actionLoading = false,
}) {
    const reduceMotion = useReducedMotion();

    const category = getNotificationCategory(item?.category);
    const priority = getNotificationPriority(item?.priority);

    const Icon = category.icon;
    const isRead = isNotificationRead(item);

    const handleToggleRead = () => {
        if (!actionLoading && item?._id) {
            onToggleRead?.(item._id);
        }
    };

    const handleDismiss = () => {
        if (!actionLoading && item?._id) {
            onDismiss?.(item._id);
        }
    };

    return (
        <motion.article
            layout={!reduceMotion}
            initial={
                reduceMotion
                    ? false
                    : { opacity: 0, y: 7 }
            }
            animate={{ opacity: 1, y: 0 }}
            exit={
                reduceMotion
                    ? undefined
                    : { opacity: 0, x: 12 }
            }
            transition={{
                duration: reduceMotion ? 0 : 0.2,
            }}
            className={`group relative flex min-w-0 gap-3 border-l-4 px-4 py-4 transition-colors sm:gap-4 sm:px-5 ${
                priority.border
            } ${
                isRead
                    ? "bg-white dark:bg-slate-900"
                    : "bg-indigo-50/50 dark:bg-indigo-950/15"
            }`}
        >
            {/* Category icon */}
            <div
                className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${category.tone}`}
            >
                <Icon size={20} aria-hidden="true" />
            </div>

            {/* Notification content */}
            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                    <h3
                        className={`break-words text-sm text-slate-900 dark:text-white ${
                            isRead ? "font-semibold" : "font-bold"
                        }`}
                    >
                        {item?.title || "Notification"}
                    </h3>

                    {!isRead && (
                        <span
                            className="h-2 w-2 shrink-0 rounded-full bg-indigo-600"
                            aria-label="Unread"
                            title="Unread"
                        />
                    )}

                    {["high", "critical"].includes(item?.priority) && (
                        <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${item.priority === "critical" ? "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-200" : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"}`}>
                            {priority.label}
                        </span>
                    )}
                </div>

                <p className="mt-1.5 whitespace-pre-line break-words text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {item?.message || ""}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    <span
                        className={`inline-flex items-center rounded-lg px-2 py-1 text-[11px] font-semibold ${category.tone}`}
                    >
                        {category.label}
                    </span>

                    <span
                        className="inline-flex items-center gap-1 text-xs text-slate-400"
                        title={formatDate(item?.createdAt)}
                    >
                        <Clock3 size={12} aria-hidden="true" />
                        {timeAgo(item?.createdAt)}
                    </span>
                </div>

                {item?.actionUrl &&
                    item.actionUrl.startsWith("/") &&
                    !item.actionUrl.startsWith("//") &&
                    !item.actionUrl.includes("\\") && (
                    <a
                        href={item.actionUrl}
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-indigo-400"
                    >
                        View details
                        <ExternalLink size={13} aria-hidden="true" />
                    </a>
                )}
            </div>

            {/* Actions */}
            <div className="flex shrink-0 flex-col items-end gap-1 self-start sm:flex-row sm:items-start">
                <button
                    type="button"
                    onClick={handleToggleRead}
                    disabled={actionLoading || !item?._id}
                    title={isRead ? "Mark as unread" : "Mark as read"}
                    aria-label={`Mark ${item?.title || "notification"} as ${
                        isRead ? "unread" : "read"
                    }`}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
                >
                    {isRead ? (
                        <BellRing size={16} aria-hidden="true" />
                    ) : (
                        <Check size={17} aria-hidden="true" />
                    )}
                </button>

                <button
                    type="button"
                    onClick={handleDismiss}
                    disabled={actionLoading || !item?._id}
                    title="Dismiss notification"
                    aria-label={`Dismiss ${item?.title || "notification"}`}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-slate-800"
                >
                    <X size={17} aria-hidden="true" />
                </button>
            </div>
        </motion.article>
    );
}
