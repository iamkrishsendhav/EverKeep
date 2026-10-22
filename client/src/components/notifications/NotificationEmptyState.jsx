
import {
    Bell,
    CircleAlert,
    RefreshCw,
    Search,
} from "lucide-react";

export default function NotificationEmptyState({
    type = "empty",
    hasFilters = false,
    loading = false,
    error = null,
    onClear,
    onRetry,
}) {
    if (loading || type === "loading") {
        return (
            <div
                role="status"
                className="flex min-h-64 flex-col items-center justify-center gap-3 px-5 py-10 text-center"
            >
                <RefreshCw
                    size={26}
                    className="animate-spin text-indigo-500"
                    aria-hidden="true"
                />

                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                    Loading notifications...
                </h3>

                <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">
                    Fetching your latest updates.
                </p>
            </div>
        );
    }

    if (error || type === "error") {
        return (
            <div
                role="alert"
                className="flex min-h-64 flex-col items-center justify-center px-5 py-10 text-center"
            >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                    <CircleAlert size={25} aria-hidden="true" />
                </div>

                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                    Unable to load notifications
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {error || "Something went wrong while fetching your notifications."}
                </p>

                {onRetry && (
                    <button
                        type="button"
                        onClick={onRetry}
                        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20"
                    >
                        <RefreshCw size={15} aria-hidden="true" />
                        Try again
                    </button>
                )}
            </div>
        );
    }

    const filtered = hasFilters || type === "filtered";

    return (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 px-5 py-10 text-center dark:border-slate-700">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                {filtered ? (
                    <Search size={25} aria-hidden="true" />
                ) : (
                    <Bell size={25} aria-hidden="true" />
                )}
            </div>

            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                {filtered
                    ? "No matching notifications"
                    : "You're all caught up"}
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
                {filtered
                    ? "Try a different search term or category filter."
                    : "Updates about your assets, warranties and subscriptions will appear here when available."}
            </p>

            {filtered && onClear && (
                <button
                    type="button"
                    onClick={onClear}
                    className="mt-4 rounded-xl px-4 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-indigo-400 dark:hover:bg-indigo-950/40"
                >
                    Clear filters
                </button>
            )}
        </div>
    );
}
