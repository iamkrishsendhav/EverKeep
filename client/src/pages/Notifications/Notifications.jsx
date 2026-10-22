
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    Bell,
    CheckCheck,
    CircleHelp,
} from "lucide-react";

import { useNotifications } from "../../context/NotificationContext";

import NotificationHeader from "../../components/notifications/NotificationHeader.jsx";
import NotificationStats from "../../components/notifications/NotificationStats.jsx";
import NotificationFilters from "../../components/notifications/NotificationFilters.jsx";
import NotificationList from "../../components/notifications/NotificationList.jsx";
import NotificationPreferences from "../../components/notifications/NotificationPreferences.jsx";

const PAGE_SIZE = 20;

export default function Notifications() {
    const {
        notifications,
        unreadCount,
        pagination,
        counts,
        loading,
        actionLoading,
        error,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        dismissNotification,
        clearError,
    } = useNotifications();

    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [notice, setNotice] = useState("");
    const lastFilterKey = useRef("all\u0000");

    useEffect(() => {
        const timeout = window.setTimeout(
            () => setDebouncedSearch(search.trim()),
            250,
        );
        return () => window.clearTimeout(timeout);
    }, [search]);

    const getQueryParams = useCallback((page, selectedFilter = filter) => ({
        page,
        limit: pagination?.limit || PAGE_SIZE,
        ...(selectedFilter !== "all" && selectedFilter !== "unread"
            ? { category: selectedFilter }
            : {}),
        ...(selectedFilter === "unread" ? { unread: true } : {}),
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
    }), [filter, pagination?.limit, debouncedSearch]);

    useEffect(() => {
        const key = `${filter}\u0000${debouncedSearch}`;
        if (lastFilterKey.current === key) return;
        lastFilterKey.current = key;
        clearError();
        setNotice("");
        fetchNotifications(getQueryParams(1)).catch(() => {});
    }, [filter, debouncedSearch, clearError, fetchNotifications, getQueryParams]);

    // ========================================================================
    // FILTER NOTIFICATIONS
    // ========================================================================

    const visibleNotifications = useMemo(() => {
        const query = debouncedSearch.toLowerCase();

        return notifications.filter((item) => {
            if (filter === "unread" && item.readAt) {
                return false;
            }

            if (
                [
                    "warranty",
                    "subscription",
                    "asset",
                    "document",
                    "family",
                    "calendar",
                    "system",
                ].includes(filter) &&
                item.category !== filter
            ) {
                return false;
            }

            return (
                !query ||
                (item.title || "").toLowerCase().includes(query) ||
                (item.message || "").toLowerCase().includes(query) ||
                (item.category || "").toLowerCase().includes(query)
            );
        });
    }, [notifications, filter, debouncedSearch]);

    // ========================================================================
    // STATISTICS
    // ========================================================================

    const totalCount = counts?.total ?? pagination?.total ?? notifications.length;

    const readCount = counts?.read ?? 0;

    const importantCount = counts?.important ?? 0;

    // ========================================================================
    // REFRESH
    // ========================================================================

    const handleRefresh = useCallback(async () => {
        clearError();
        setNotice("");

        try {
            await fetchNotifications(getQueryParams(pagination?.page || 1));

            setNotice("Notifications refreshed successfully.");
        } catch {
            // The context manages the error state.
        }
    }, [
        clearError,
        fetchNotifications,
        pagination?.page,
        getQueryParams,
    ]);

    // ========================================================================
    // MARK ONE READ / UNREAD
    // ========================================================================

    const handleToggleRead = async (id) => {
        setNotice("");

        try {
            await markAsRead(id);
            setNotice("Notification status updated.");
        } catch {
            // The context manages the error state.
        }
    };

    // ========================================================================
    // MARK ALL READ
    // ========================================================================

    const handleMarkAllRead = async () => {
        setNotice("");

        try {
            await markAllAsRead();
            setNotice("All notifications marked as read.");
        } catch {
            // The context manages the error state.
        }
    };

    // ========================================================================
    // DISMISS
    // ========================================================================

    const handleDismiss = async (id) => {
        setNotice("");

        try {
            await dismissNotification(id);
            setNotice("Notification dismissed.");
        } catch {
            // The context manages the error state.
        }
    };

    // ========================================================================
    // FILTER CONTROLS
    // ========================================================================

    const clearFilters = () => {
        setFilter("all");
        setSearch("");
    };

    const handleFilterChange = (nextFilter) => {
        setFilter(nextFilter);
    };

    // ========================================================================
    // PAGINATION
    // ========================================================================

    const currentPage = pagination?.page || 1;
    const totalPages = pagination?.pages || 0;

    const handlePageChange = async (nextPage) => {
        if (
            nextPage < 1 ||
            nextPage > totalPages ||
            nextPage === currentPage ||
            loading
        ) {
            return;
        }

        clearError();
        setNotice("");

        try {
            await fetchNotifications({
                ...getQueryParams(nextPage),
            });
        } catch {
            // The context manages the error state.
        }
    };

    return (
        <div className="min-w-0 space-y-6 pb-8">
            <NotificationPreferences />
            {/* ============================================================= */}
            {/* HEADER */}
            {/* ============================================================= */}

            <NotificationHeader
                unreadCount={unreadCount}
                loading={loading}
                actionLoading={actionLoading}
                onRefresh={handleRefresh}
                onMarkAllRead={handleMarkAllRead}
            />

            {/* ============================================================= */}
            {/* STATISTICS */}
            {/* ============================================================= */}

            <NotificationStats
                total={totalCount}
                unread={unreadCount}
                important={importantCount}
                read={readCount}
            />

            {/* ============================================================= */}
            {/* STATUS MESSAGE */}
            {/* ============================================================= */}

            {notice && (
                <div
                    role="status"
                    className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300"
                >
                    <span>{notice}</span>

                    <button
                        type="button"
                        onClick={() => setNotice("")}
                        className="shrink-0 rounded-lg px-2 py-1 font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
                        aria-label="Dismiss status message"
                    >
                        Close
                    </button>
                </div>
            )}

            {/* ============================================================= */}
            {/* INBOX */}
            {/* ============================================================= */}

            <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <NotificationFilters
                    notifications={notifications}
                    counts={counts}
                    filter={filter}
                    onFilterChange={handleFilterChange}
                    search={search}
                    onSearchChange={setSearch}
                    onClearFilters={clearFilters}
                    disabled={loading}
                />

                <NotificationList
                    notifications={visibleNotifications}
                    loading={loading}
                    error={error}
                    actionLoading={actionLoading}
                    hasFilters={Boolean(search) || filter !== "all"}
                    onToggleRead={handleToggleRead}
                    onDismiss={handleDismiss}
                    onClearFilters={clearFilters}
                    onRetry={handleRefresh}
                />

                {/* ========================================================= */}
                {/* PAGINATION AND FOOTER */}
                {/* ========================================================= */}

                <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/70 px-4 py-4 dark:border-slate-800 dark:bg-slate-950/40 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                            <Bell size={13} className="mr-1 inline" />
                            {visibleNotifications.length} shown on this page
                        </p>

                        <p className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                            <CircleHelp size={13} />
                            Changes are saved to your account.
                        </p>
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() =>
                                    handlePageChange(currentPage - 1)
                                }
                                disabled={currentPage <= 1 || loading}
                                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                            >
                                Previous
                            </button>

                            <span className="min-w-20 text-center text-xs font-semibold text-slate-600 dark:text-slate-300">
                                Page {currentPage} of {totalPages}
                            </span>

                            <button
                                type="button"
                                onClick={() =>
                                    handlePageChange(currentPage + 1)
                                }
                                disabled={
                                    currentPage >= totalPages || loading
                                }
                                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Bottom spacing and visual balance */}
            <div className="flex items-center justify-center gap-2 py-1 text-xs text-slate-400 dark:text-slate-500">
                <CheckCheck size={14} />
                You're viewing your EverKeep notification center.
            </div>
        </div>
    );
}
