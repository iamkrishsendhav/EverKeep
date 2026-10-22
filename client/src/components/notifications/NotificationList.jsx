
import { AnimatePresence } from "framer-motion";

import NotificationItem from "./NotificationItem.jsx";
import NotificationEmptyState from "./NotificationEmptyState.jsx";

export default function NotificationList({
    notifications = [],
    loading = false,
    error = null,
    actionLoading = false,
    hasFilters = false,
    onToggleRead,
    onDismiss,
    onClearFilters,
    onRetry,
}) {
    if (loading && notifications.length === 0) {
        return <NotificationEmptyState type="loading" />;
    }

    if (error && notifications.length === 0) {
        return (
            <NotificationEmptyState
                type="error"
                error={error}
                onRetry={onRetry}
            />
        );
    }

    if (notifications.length === 0) {
        return (
            <NotificationEmptyState
                type={hasFilters ? "filtered" : "empty"}
                hasFilters={hasFilters}
                onClear={onClearFilters}
            />
        );
    }

    return (
        <div
            className="divide-y divide-slate-100 dark:divide-slate-800"
            aria-busy={loading}
        >
            {error && (
                <div
                    role="alert"
                    className="border-b border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-950 dark:bg-rose-950/30 dark:text-rose-300"
                >
                    {error}

                    {onRetry && (
                        <button
                            type="button"
                            onClick={onRetry}
                            className="ml-2 font-semibold underline underline-offset-2"
                        >
                            Try again
                        </button>
                    )}
                </div>
            )}

            {loading && (
                <div
                    role="status"
                    className="flex items-center gap-2 border-b border-slate-100 px-4 py-2 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400"
                >
                    <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-500" />
                    Refreshing notifications...
                </div>
            )}

            <AnimatePresence initial={false}>
                {notifications.map((item) => (
                    <NotificationItem
                        key={item._id}
                        item={item}
                        onToggleRead={onToggleRead}
                        onDismiss={onDismiss}
                        actionLoading={actionLoading}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}
