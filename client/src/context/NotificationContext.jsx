
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";

import { useAuth } from "./AuthContext";
import notificationService from "../services/notification.service.js";

const NotificationContext = createContext(null);

const INITIAL_PAGINATION = {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
};

const INITIAL_COUNTS = {
    total: 0,
    unread: 0,
    read: 0,
    important: 0,
    categories: {},
};

export const NotificationProvider = ({ children }) => {
    const { isAuthenticated, loading: authLoading } = useAuth();

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [pagination, setPagination] = useState(INITIAL_PAGINATION);
    const [counts, setCounts] = useState(INITIAL_COUNTS);

    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState(null);

    const requestIdRef = useRef(0);
    const lastQueryRef = useRef({ page: 1, limit: INITIAL_PAGINATION.limit });

    // ========================================================================
    // FETCH NOTIFICATIONS
    // ========================================================================

    const fetchNotifications = useCallback(
        async (params = {}) => {
            if (!isAuthenticated) {
                setNotifications([]);
                setUnreadCount(0);
                setPagination(INITIAL_PAGINATION);
                setCounts(INITIAL_COUNTS);
                return null;
            }

            lastQueryRef.current = { ...params };
            const requestId = ++requestIdRef.current;

            setLoading(true);
            setError(null);

            try {
                const response =
                    await notificationService.getNotifications(params);

                let data = response?.data ?? {};

                // Ignore stale responses from older requests.
                if (requestId !== requestIdRef.current) {
                    return data;
                }

                const requestedPage = Number(params.page) || 1;
                const lastPage = Math.max(1, Number(data.pagination?.pages) || 0);
                if (requestedPage > lastPage) {
                    const correctedParams = { ...params, page: lastPage };
                    lastQueryRef.current = correctedParams;
                    const correctedResponse = await notificationService.getNotifications(correctedParams);
                    if (requestId !== requestIdRef.current) return correctedResponse?.data ?? {};
                    data = correctedResponse?.data ?? {};
                }

                setNotifications(
                    Array.isArray(data.notifications)
                        ? data.notifications
                        : []
                );

                setUnreadCount(
                    Number(data.unreadCount ?? 0)
                );

                setCounts({
                    ...INITIAL_COUNTS,
                    ...(data.counts || {}),
                    categories: { ...(data.counts?.categories || {}) },
                });

                setPagination((previous) => ({
                    ...previous,
                    ...(data.pagination ?? {}),
                }));

                return data;
            } catch (err) {
                if (requestId === requestIdRef.current) {
                    setError(
                        err.response?.data?.message ||
                        err.message ||
                        "Failed to load notifications."
                    );
                }

                throw err;
            } finally {
                if (requestId === requestIdRef.current) {
                    setLoading(false);
                }
            }
        },
        [isAuthenticated]
    );

    // ========================================================================
    // REFRESH UNREAD COUNT
    // ========================================================================

    const refreshUnreadCount = useCallback(async () => {
        if (!isAuthenticated) {
            setUnreadCount(0);
            return 0;
        }

        try {
            const response =
                await notificationService.getUnreadCount();

            const data = response?.data ?? {};
            const count = Number(data.unreadCount ?? 0);

            setUnreadCount(count);

            return count;
        } catch {
            console.error("Failed to refresh unread notification count.");

            return null;
        }
    }, [isAuthenticated]);

    // ========================================================================
    // MARK ONE NOTIFICATION AS READ / UNREAD
    // ========================================================================

    const markAsRead = useCallback(
        async (id) => {
            if (!id) {
                throw new Error("Notification ID is required.");
            }

            if (!isAuthenticated) {
                throw new Error("Please log in to update notifications.");
            }

            setActionLoading(true);
            setError(null);

            const previousNotifications = notifications;
            const previousUnreadCount = unreadCount;
            const previousCounts = counts;
            const existing = notifications.find((item) => item._id === id);
            if (existing) {
                const willBeRead = !existing.readAt;
                setNotifications((current) => current.map((item) => item._id === id
                    ? { ...item, readAt: willBeRead ? new Date().toISOString() : null }
                    : item));
                setUnreadCount((current) => Math.max(0, current + (willBeRead ? -1 : 1)));
                setCounts((current) => ({ ...current, unread: Math.max(0, current.unread + (willBeRead ? -1 : 1)), read: Math.max(0, current.read + (willBeRead ? 1 : -1)) }));
            }

            try {
                await notificationService.markNotificationRead(id);
            } catch (err) {
                setNotifications(previousNotifications);
                setUnreadCount(previousUnreadCount);
                setCounts(previousCounts);
                setError(err.response?.data?.message || err.message || "Failed to update notification.");
                setActionLoading(false);
                throw err;
            }
            try {
                await Promise.all([
                    fetchNotifications({
                        ...lastQueryRef.current,
                        page: pagination.page,
                        limit: pagination.limit,
                    }),
                    refreshUnreadCount(),
                ]);
            } catch {
                // Keep the confirmed optimistic update; the next refresh will reconcile it.
            } finally {
                setActionLoading(false);
            }
            return true;
        },
        [
            isAuthenticated,
            fetchNotifications,
            refreshUnreadCount,
            notifications,
            unreadCount,
            counts,
            pagination.page,
            pagination.limit,
        ]
    );

    // ========================================================================
    // MARK ALL NOTIFICATIONS AS READ
    // ========================================================================

    const markAllAsRead = useCallback(async () => {
        if (!isAuthenticated) {
            throw new Error("Please log in to update notifications.");
        }

        setActionLoading(true);
        setError(null);

        const previousNotifications = notifications;
        const previousUnreadCount = unreadCount;
        const previousCounts = counts;
        setNotifications((current) => current.map((item) => item.readAt ? item : { ...item, readAt: new Date().toISOString() }));
        setUnreadCount(0);
        setCounts((current) => ({ ...current, read: current.read + current.unread, unread: 0 }));

        try {
            await notificationService.markAllNotificationsRead();
        } catch (err) {
            setNotifications(previousNotifications);
            setUnreadCount(previousUnreadCount);
            setCounts(previousCounts);
            setError(err.response?.data?.message || err.message || "Failed to mark all notifications as read.");
            setActionLoading(false);
            throw err;
        }
        try {
            await Promise.all([
                fetchNotifications({
                    ...lastQueryRef.current,
                    page: pagination.page,
                    limit: pagination.limit,
                }),
                refreshUnreadCount(),
            ]);
        } catch {
            // Keep the confirmed optimistic update; the next refresh will reconcile it.
        } finally {
            setActionLoading(false);
        }
        return true;
    }, [isAuthenticated, fetchNotifications, refreshUnreadCount, pagination.page, pagination.limit, notifications, unreadCount, counts]);

    // ========================================================================
    // DISMISS NOTIFICATION
    // ========================================================================

    const dismissNotification = useCallback(
        async (id) => {
            if (!id) {
                throw new Error("Notification ID is required.");
            }

            if (!isAuthenticated) {
                throw new Error("Please log in to dismiss notifications.");
            }

            setActionLoading(true);
            setError(null);

            const previousNotifications = notifications;
            const previousUnreadCount = unreadCount;
            const previousCounts = counts;
            const previousPagination = pagination;
            const removed = notifications.find((item) => item._id === id);
            setNotifications((current) => current.filter((item) => item._id !== id));
            if (removed && !removed.readAt) setUnreadCount((current) => Math.max(0, current - 1));
            setPagination((current) => ({ ...current, total: Math.max(0, current.total - (removed ? 1 : 0)) }));
            if (removed) setCounts((current) => ({ ...current, total: Math.max(0, current.total - 1), unread: Math.max(0, current.unread - (removed.readAt ? 0 : 1)), read: Math.max(0, current.read - (removed.readAt ? 1 : 0)), important: Math.max(0, current.important - (["high", "critical"].includes(removed.priority) ? 1 : 0)), categories: { ...current.categories, [removed.category]: Math.max(0, (current.categories[removed.category] || 0) - 1) } }));

            try {
                await notificationService.dismissNotification(id);
            } catch (err) {
                setNotifications(previousNotifications);
                setUnreadCount(previousUnreadCount);
                setCounts(previousCounts);
                setPagination(previousPagination);
                setError(err.response?.data?.message || err.message || "Failed to dismiss notification.");
                setActionLoading(false);
                throw err;
            }
            try {
                await Promise.all([
                    fetchNotifications({
                        ...lastQueryRef.current,
                        page: pagination.page,
                        limit: pagination.limit,
                    }),
                    refreshUnreadCount(),
                ]);

            } catch {
                // Keep the confirmed optimistic update; the next refresh will reconcile it.
            } finally {
                setActionLoading(false);
            }
            return true;
        },
        [isAuthenticated, fetchNotifications, refreshUnreadCount, notifications, unreadCount, counts, pagination]
    );

    // ========================================================================
    // CLEAR ERROR
    // ========================================================================

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // ========================================================================
    // LOAD NOTIFICATIONS AFTER AUTHENTICATION
    // ========================================================================

    useEffect(() => {
        if (authLoading) {
            return;
        }

        if (!isAuthenticated) {
            // Invalidate outstanding notification requests.
            requestIdRef.current += 1;

            setNotifications([]);
            setUnreadCount(0);
            setPagination(INITIAL_PAGINATION);
            setCounts(INITIAL_COUNTS);
            setLoading(false);
            setActionLoading(false);
            setError(null);

            return;
        }

        let cancelled = false;

        const loadInitialNotifications = async () => {
            try {
                await fetchNotifications({
                    page: 1,
                    limit: INITIAL_PAGINATION.limit,
                });

                if (!cancelled) {
                    await refreshUnreadCount();
                }
            } catch {
                // fetchNotifications already sets the error state.
            }
        };

        loadInitialNotifications();

        return () => {
            cancelled = true;
        };
    }, [
        authLoading,
        isAuthenticated,
        fetchNotifications,
        refreshUnreadCount,
    ]);

    // ========================================================================
    // CONTEXT VALUE
    // ========================================================================

    const value = {
        notifications,
        unreadCount,
        pagination,
        counts,
        loading,
        actionLoading,
        error,

        fetchNotifications,
        refreshUnreadCount,
        markAsRead,
        markAllAsRead,
        dismissNotification,
        clearError,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

// ============================================================================
// CUSTOM HOOK
// ============================================================================

export const useNotifications = () => {
    const context = useContext(NotificationContext);

    if (!context) {
        throw new Error(
            "useNotifications must be used inside NotificationProvider."
        );
    }

    return context;
};

export default NotificationContext;
