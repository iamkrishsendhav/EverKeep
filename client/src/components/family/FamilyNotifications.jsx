import { useCallback, useEffect, useMemo, useState } from "react";

import {
    Activity,
    Bell,
    BellOff,
    CalendarDays,
    Check,
    CheckCheck,
    ChevronRight,
    CreditCard,
    FileText,
    Loader2,
    Package,
    RefreshCw,
    ShieldCheck,
    UserPlus,
    Users,
    XCircle,
} from "lucide-react";

import {
    getFamilyNotifications,
    markFamilyNotificationRead,
    markAllFamilyNotificationsRead,
    FamilyApiError,
} from "../../services/family.service";

// ============================================================================
// HELPERS
// ============================================================================

const getValidDate = (value) => {
    const date = new Date(value);

    return Number.isNaN(date.getTime()) ? null : date;
};

const formatNotificationTime = (date) => {
    const value = getValidDate(date);

    if (!value) {
        return "";
    }

    const diff = Math.max(0, Math.floor((Date.now() - value.getTime()) / 1000));

    if (diff < 60) {
        return "Just now";
    }

    const minutes = Math.floor(diff / 60);

    if (minutes < 60) {
        return `${minutes}m ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
        return `${hours}h ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 7) {
        return `${days}d ago`;
    }

    return value.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year:
            value.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
    });
};

const getDateGroupKey = (date) => {
    const value = getValidDate(date);

    if (!value) {
        return "unknown";
    }

    const year = value.getFullYear();

    const month = String(value.getMonth() + 1).padStart(2, "0");

    const day = String(value.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const getDateGroupLabel = (date) => {
    const value = getValidDate(date);

    if (!value) {
        return "Recent";
    }

    const now = new Date();

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const target = new Date(
        value.getFullYear(),
        value.getMonth(),
        value.getDate(),
    );

    const diff = Math.round(
        (today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diff === 0) {
        return "Today";
    }

    if (diff === 1) {
        return "Yesterday";
    }

    return value.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: value.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
};

// ============================================================================
// NOTIFICATION TYPE CONFIG
// ============================================================================

const TYPE_CONFIG = {
    member: {
        icon: UserPlus,
        label: "Members",
        className:
            "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
    },

    family: {
        icon: Users,
        label: "Family",
        className:
            "bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400",
    },

    asset: {
        icon: Package,
        label: "Assets",
        className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
    },

    subscription: {
        icon: CreditCard,
        label: "Subscriptions",
        className:
            "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
    },

    warranty: {
        icon: ShieldCheck,
        label: "Warranties",
        className:
            "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
    },

    document: {
        icon: FileText,
        label: "Documents",
        className:
            "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400",
    },

    calendar: {
        icon: CalendarDays,
        label: "Calendar",
        className:
            "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400",
    },

    activity: {
        icon: Activity,
        label: "Activity",
        className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
    },

    default: {
        icon: Bell,
        label: "Notification",
        className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
    },
};

// ============================================================================
// PRIORITY CONFIG
// ============================================================================

const PRIORITY_CONFIG = {
    high: {
        dot: "bg-red-500",
        label: "Important",
    },

    medium: {
        dot: "bg-amber-500",
        label: "Attention",
    },

    low: {
        dot: "bg-gray-400",
        label: "Info",
    },

    default: {
        dot: "bg-gray-400",
        label: "Info",
    },
};

// ============================================================================
// NORMALIZE NOTIFICATION
// ============================================================================

const normalizeNotification = (item = {}, index = 0) => {
    const type = String(
        item.type || item.category || item.resourceType || "default",
    ).toLowerCase();

    const sender = item.sender || item.actor || item.user || {};

    const createdAt =
        item.createdAt ||
        item.timestamp ||
        item.date ||
        item.updatedAt ||
        new Date().toISOString();

    return {
        id: item._id || item.id || `${createdAt}-${index}`,

        title: item.title || item.subject || "Family notification",

        message: item.message || item.description || item.body || "",

        type,

        priority: String(item.priority || "low").toLowerCase(),

        read: Boolean(item.read ?? item.isRead ?? false),

        createdAt,

        senderName: sender.name || item.senderName || "",

        senderEmail: sender.email || item.senderEmail || "",

        resourceId: item.resourceId || item.entityId || null,

        resourceType: item.resourceType || null,

        metadata: item.metadata || {},
    };
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const FamilyNotifications = () => {
    // =========================================================================
    // STATE
    // =========================================================================

    const [notifications, setNotifications] = useState([]);

    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] = useState(false);

    const [markingId, setMarkingId] = useState(null);

    const [markingAll, setMarkingAll] = useState(false);

    const [filter, setFilter] = useState("all");

    const [error, setError] = useState("");

    // =========================================================================
    // LOAD NOTIFICATIONS
    // =========================================================================

    const loadNotifications = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const response = await getFamilyNotifications();

            const data =
                response?.data ??
                response?.notifications ??
                response?.items ??
                response ??
                [];

            const normalized = Array.isArray(data)
                ? data.map(normalizeNotification)
                : [];

            setNotifications(normalized);
        } catch (requestError) {
            console.error("Family notifications error:", requestError);

            setError(
                requestError instanceof FamilyApiError
                    ? requestError.message
                    : "Unable to load notifications.",
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    // =========================================================================
    // INITIAL LOAD
    // =========================================================================

    useEffect(() => {
        loadNotifications();
    }, [loadNotifications]);

    // =========================================================================
    // COUNTS
    // =========================================================================

    const unreadCount = useMemo(
        () => notifications.filter((notification) => !notification.read).length,
        [notifications],
    );

    const readCount = notifications.length - unreadCount;

    // =========================================================================
    // FILTER
    // =========================================================================

    const filteredNotifications = useMemo(() => {
        if (filter === "unread") {
            return notifications.filter((notification) => !notification.read);
        }

        return notifications;
    }, [notifications, filter]);

    // =========================================================================
    // GROUP + SORT
    // =========================================================================

    const groupedNotifications = useMemo(() => {
        const groups = {};

        filteredNotifications.forEach((notification) => {
            const dateKey = getDateGroupKey(notification.createdAt);

            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }

            groups[dateKey].push(notification);
        });

        return Object.entries(groups)
            .sort(([firstKey], [secondKey]) => {
                if (firstKey === "unknown") {
                    return 1;
                }

                if (secondKey === "unknown") {
                    return -1;
                }

                return new Date(secondKey).getTime() - new Date(firstKey).getTime();
            })
            .map(([dateKey, items]) => {
                const sortedItems = [...items].sort((a, b) => {
                    const first = getValidDate(a.createdAt)?.getTime() || 0;

                    const second = getValidDate(b.createdAt)?.getTime() || 0;

                    return second - first;
                });

                return [dateKey, sortedItems];
            });
    }, [filteredNotifications]);

    // =========================================================================
    // MARK ONE AS READ
    // =========================================================================

    const handleMarkRead = async (notification) => {
        if (notification.read || markingId || markingAll) {
            return;
        }

        try {
            setMarkingId(notification.id);

            setError("");

            await markFamilyNotificationRead(notification.id);

            setNotifications((current) =>
                current.map((item) =>
                    item.id === notification.id
                        ? {
                            ...item,
                            read: true,
                        }
                        : item,
                ),
            );
        } catch (requestError) {
            console.error("Mark notification read error:", requestError);

            setError(
                requestError instanceof FamilyApiError
                    ? requestError.message
                    : "Unable to update notification.",
            );
        } finally {
            setMarkingId(null);
        }
    };

    // =========================================================================
    // MARK ALL AS READ
    // =========================================================================

    const handleMarkAllRead = async () => {
        if (markingAll || unreadCount === 0 || markingId) {
            return;
        }

        try {
            setMarkingAll(true);
            setError("");

            await markAllFamilyNotificationsRead();

            setNotifications((current) =>
                current.map((notification) => ({
                    ...notification,
                    read: true,
                })),
            );
        } catch (requestError) {
            console.error("Mark all notifications read error:", requestError);

            setError(
                requestError instanceof FamilyApiError
                    ? requestError.message
                    : "Unable to mark notifications as read.",
            );
        } finally {
            setMarkingAll(false);
        }
    };

    // =========================================================================
    // LOADING
    // =========================================================================

    if (loading) {
        return <NotificationLoading />;
    }

    // =========================================================================
    // FULL ERROR
    // =========================================================================

    if (error && notifications.length === 0) {
        return (
            <NotificationError
                error={error}
                refreshing={refreshing}
                onRetry={() => loadNotifications(true)}
            />
        );
    }

    // =========================================================================
    // RENDER
    // =========================================================================

    return (
        <div
            className="
                min-h-full
                bg-gray-50/50
                dark:bg-gray-950
            "
        >
            <div
                className="
                    mx-auto
                    max-w-4xl
                    px-4
                    py-6
                    sm:px-6
                    sm:py-8
                    lg:px-8
                "
            >
                {/* =============================================================
                    HEADER
                ============================================================= */}

                <NotificationHeader
                    unreadCount={unreadCount}
                    refreshing={refreshing}
                    markingAll={markingAll}
                    onRefresh={() => loadNotifications(true)}
                    onMarkAll={handleMarkAllRead}
                />

                {/* =============================================================
                    INLINE ERROR
                ============================================================= */}

                {error && (
                    <div
                        className="
                            mt-5
                            flex
                            items-start
                            gap-2
                            rounded-xl
                            border
                            border-red-200
                            bg-red-50
                            px-4
                            py-3
                            text-xs
                            text-red-700
                            dark:border-red-900/40
                            dark:bg-red-950/30
                            dark:text-red-300
                        "
                    >
                        <XCircle
                            size={15}
                            className="
                                mt-0.5
                                shrink-0
                            "
                        />

                        <span>{error}</span>
                    </div>
                )}

                {/* =============================================================
                    SUMMARY
                ============================================================= */}

                <NotificationSummary
                    total={notifications.length}
                    unread={unreadCount}
                    read={readCount}
                />

                {/* =============================================================
                    FILTERS
                ============================================================= */}

                <div
                    className="
                        mt-6
                        flex
                        items-center
                        justify-between
                        gap-3
                    "
                >
                    <div
                        className="
                            inline-flex
                            rounded-xl
                            border
                            border-gray-200
                            bg-white
                            p-1
                            dark:border-gray-800
                            dark:bg-gray-900
                        "
                    >
                        <FilterButton
                            active={filter === "all"}
                            onClick={() => setFilter("all")}
                        >
                            All
                            <span
                                className="
                                    ml-1.5
                                    text-[10px]
                                    text-gray-400
                                "
                            >
                                {notifications.length}
                            </span>
                        </FilterButton>

                        <FilterButton
                            active={filter === "unread"}
                            onClick={() => setFilter("unread")}
                        >
                            Unread
                            {unreadCount > 0 && (
                                <span
                                    className="
                                        ml-1.5
                                        rounded-full
                                        bg-gray-900
                                        px-1.5
                                        py-0.5
                                        text-[9px]
                                        font-semibold
                                        text-white
                                        dark:bg-white
                                        dark:text-gray-900
                                    "
                                >
                                    {unreadCount}
                                </span>
                            )}
                        </FilterButton>
                    </div>

                    {unreadCount > 0 && (
                        <span
                            className="
                                hidden
                                text-[11px]
                                text-gray-400
                                sm:block
                                dark:text-gray-500
                            "
                        >
                            {unreadCount} unread notification
                            {unreadCount !== 1 ? "s" : ""}
                        </span>
                    )}
                </div>

                {/* =============================================================
                    NOTIFICATION CONTENT
                ============================================================= */}

                {filteredNotifications.length === 0 ? (
                    <EmptyNotifications unreadOnly={filter === "unread"} />
                ) : (
                    <div
                        className="
                            mt-5
                            space-y-8
                        "
                    >
                        {groupedNotifications.map(([dateKey, items]) => (
                            <section key={dateKey}>
                                <div
                                    className="
                                            mb-3
                                            flex
                                            items-center
                                            gap-3
                                        "
                                >
                                    <span
                                        className="
                                                text-[10px]
                                                font-semibold
                                                uppercase
                                                tracking-[0.12em]
                                                text-gray-400
                                                dark:text-gray-500
                                            "
                                    >
                                        {getDateGroupLabel(items[0]?.createdAt)}
                                    </span>

                                    <div
                                        className="
                                                h-px
                                                flex-1
                                                bg-gray-200
                                                dark:bg-gray-800
                                            "
                                    />
                                </div>

                                <div
                                    className="
                                            space-y-2
                                        "
                                >
                                    {items.map((notification) => (
                                        <NotificationCard
                                            key={notification.id}
                                            notification={notification}
                                            marking={markingId === notification.id}
                                            onMarkRead={handleMarkRead}
                                        />
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                )}

                {/* =============================================================
                    FOOTER
                ============================================================= */}

                {notifications.length > 0 && (
                    <div
                        className="
                            mt-10
                            flex
                            items-center
                            justify-center
                            gap-2
                            text-[11px]
                            text-gray-400
                            dark:text-gray-500
                        "
                    >
                        <Check size={12} />
                        You're all caught up with family activity.
                    </div>
                )}
            </div>
        </div>
    );
};

// ============================================================================
// HEADER
// ============================================================================

const NotificationHeader = ({
    unreadCount,
    refreshing,
    markingAll,
    onRefresh,
    onMarkAll,
}) => {
    return (
        <header>
            <div
                className="
                    flex
                    items-start
                    justify-between
                    gap-4
                "
            >
                <div
                    className="
                        flex
                        min-w-0
                        items-start
                        gap-3
                    "
                >
                    <div
                        className="
                            relative
                            flex
                            h-11
                            w-11
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-gray-900
                            text-white
                            shadow-sm
                            dark:bg-white
                            dark:text-gray-900
                        "
                    >
                        <Bell size={19} strokeWidth={1.8} />

                        {unreadCount > 0 && (
                            <span
                                className="
                                    absolute
                                    -right-1.5
                                    -top-1.5
                                    flex
                                    h-5
                                    min-w-5
                                    items-center
                                    justify-center
                                    rounded-full
                                    border-2
                                    border-gray-50
                                    bg-red-500
                                    px-1
                                    text-[9px]
                                    font-bold
                                    text-white
                                    dark:border-gray-950
                                "
                            >
                                {unreadCount > 99 ? "99+" : unreadCount}
                            </span>
                        )}
                    </div>

                    <div
                        className="
                            min-w-0
                        "
                    >
                        <h1
                            className="
                                text-xl
                                font-semibold
                                tracking-tight
                                text-gray-950
                                sm:text-2xl
                                dark:text-white
                            "
                        >
                            Notifications
                        </h1>

                        <p
                            className="
                                mt-1
                                text-sm
                                leading-6
                                text-gray-500
                                dark:text-gray-400
                            "
                        >
                            Stay up to date with important family activity.
                        </p>
                    </div>
                </div>

                <div
                    className="
                        flex
                        shrink-0
                        items-center
                        gap-2
                    "
                >
                    <button
                        type="button"
                        onClick={onRefresh}
                        disabled={refreshing}
                        aria-label="Refresh notifications"
                        title="Refresh notifications"
                        className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-gray-200
                            bg-white
                            text-gray-500
                            transition
                            hover:bg-gray-50
                            hover:text-gray-900
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                            dark:border-gray-800
                            dark:bg-gray-900
                            dark:text-gray-400
                            dark:hover:bg-gray-800
                            dark:hover:text-white
                        "
                    >
                        {refreshing ? (
                            <Loader2
                                size={16}
                                className="
                                    animate-spin
                                "
                            />
                        ) : (
                            <RefreshCw size={16} />
                        )}
                    </button>

                    {unreadCount > 0 && (
                        <button
                            type="button"
                            onClick={onMarkAll}
                            disabled={markingAll}
                            className="
                                hidden
                                h-10
                                items-center
                                gap-2
                                rounded-xl
                                border
                                border-gray-200
                                bg-white
                                px-3
                                text-xs
                                font-semibold
                                text-gray-700
                                transition
                                hover:bg-gray-50
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                                sm:inline-flex
                                dark:border-gray-800
                                dark:bg-gray-900
                                dark:text-gray-300
                                dark:hover:bg-gray-800
                            "
                        >
                            {markingAll ? (
                                <Loader2
                                    size={14}
                                    className="
                                        animate-spin
                                    "
                                />
                            ) : (
                                <CheckCheck size={14} />
                            )}
                            Mark all read
                        </button>
                    )}
                </div>
            </div>

            {/* Mobile mark all */}

            {unreadCount > 0 && (
                <button
                    type="button"
                    onClick={onMarkAll}
                    disabled={markingAll}
                    className="
                        mt-4
                        inline-flex
                        h-9
                        items-center
                        gap-2
                        rounded-xl
                        border
                        border-gray-200
                        bg-white
                        px-3
                        text-[11px]
                        font-semibold
                        text-gray-700
                        transition
                        hover:bg-gray-50
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                        sm:hidden
                        dark:border-gray-800
                        dark:bg-gray-900
                        dark:text-gray-300
                    "
                >
                    {markingAll ? (
                        <Loader2
                            size={13}
                            className="
                                animate-spin
                            "
                        />
                    ) : (
                        <CheckCheck size={13} />
                    )}
                    Mark all as read
                </button>
            )}
        </header>
    );
};

// ============================================================================
// SUMMARY
// ============================================================================

const NotificationSummary = ({ total, unread, read }) => {
    if (total === 0) {
        return null;
    }

    return (
        <div
            className="
                mt-6
                grid
                grid-cols-2
                gap-2
                sm:grid-cols-3
            "
        >
            <SummaryCard label="Total" value={total} />

            <SummaryCard label="Unread" value={unread} emphasis={unread > 0} />

            <SummaryCard
                label="Read"
                value={read}
                className="
                    hidden
                    sm:block
                "
            />
        </div>
    );
};

const SummaryCard = ({ label, value, emphasis, className = "" }) => {
    return (
        <div
            className={`
                rounded-xl
                border
                border-gray-200
                bg-white
                px-4
                py-3
                dark:border-gray-800
                dark:bg-gray-900
                ${className}
            `}
        >
            <div
                className="
                    flex
                    items-center
                    justify-between
                    gap-3
                "
            >
                <span
                    className="
                        text-[10px]
                        font-medium
                        uppercase
                        tracking-[0.1em]
                        text-gray-400
                        dark:text-gray-500
                    "
                >
                    {label}
                </span>

                <span
                    className={`
                        text-sm
                        font-semibold
                        ${emphasis
                            ? "text-gray-950 dark:text-white"
                            : "text-gray-700 dark:text-gray-300"
                        }
                    `}
                >
                    {value}
                </span>
            </div>
        </div>
    );
};

// ============================================================================
// FILTER BUTTON
// ============================================================================

const FilterButton = ({ active, onClick, children }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                rounded-lg
                px-3
                py-1.5
                text-[11px]
                font-semibold
                transition
                ${active
                    ? "bg-gray-900 text-white shadow-sm dark:bg-white dark:text-gray-900"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                }
            `}
        >
            {children}
        </button>
    );
};

// ============================================================================
// NOTIFICATION CARD
// ============================================================================

const NotificationCard = ({ notification, marking, onMarkRead }) => {
    const config = TYPE_CONFIG[notification.type] || TYPE_CONFIG.default;

    const priority =
        PRIORITY_CONFIG[notification.priority] || PRIORITY_CONFIG.default;

    const Icon = config.icon;

    return (
        <article
            className={`
                group
                relative
                overflow-hidden
                rounded-2xl
                border
                bg-white
                transition-all
                duration-200
                hover:-translate-y-[1px]
                hover:shadow-md
                dark:bg-gray-900
                ${notification.read
                    ? "border-gray-200 dark:border-gray-800"
                    : "border-gray-300 shadow-sm dark:border-gray-700"
                }
            `}
        >
            {/* =============================================================
                UNREAD ACCENT
            ============================================================= */}

            {!notification.read && (
                <div
                    aria-hidden="true"
                    className="
                        absolute
                        bottom-0
                        left-0
                        top-0
                        w-0.5
                        bg-gray-900
                        dark:bg-white
                    "
                />
            )}

            <div
                className="
                    flex
                    gap-3.5
                    p-4
                    sm:p-5
                "
            >
                {/* =========================================================
                    ICON
                ========================================================= */}

                <div
                    className={`
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        ${config.className}
                    `}
                >
                    <Icon size={17} strokeWidth={1.8} />
                </div>

                {/* =========================================================
                    CONTENT
                ========================================================= */}

                <div
                    className="
                        min-w-0
                        flex-1
                    "
                >
                    <div
                        className="
                            flex
                            items-start
                            justify-between
                            gap-3
                        "
                    >
                        <div
                            className="
                                min-w-0
                            "
                        >
                            <div
                                className="
                                    flex
                                    flex-wrap
                                    items-center
                                    gap-2
                                "
                            >
                                <h2
                                    className={`
                                        text-sm
                                        leading-5
                                        ${notification.read
                                            ? "font-medium text-gray-700 dark:text-gray-300"
                                            : "font-semibold text-gray-950 dark:text-white"
                                        }
                                    `}
                                >
                                    {notification.title}
                                </h2>

                                {!notification.read && (
                                    <span
                                        aria-label="Unread"
                                        className="
                                            h-1.5
                                            w-1.5
                                            shrink-0
                                            rounded-full
                                            bg-gray-900
                                            dark:bg-white
                                        "
                                    />
                                )}
                            </div>

                            {notification.message && (
                                <p
                                    className="
                                        mt-1
                                        text-xs
                                        leading-5
                                        text-gray-500
                                        dark:text-gray-500
                                    "
                                >
                                    {notification.message}
                                </p>
                            )}
                        </div>

                        {/* Desktop time */}

                        <time
                            dateTime={notification.createdAt}
                            title={
                                getValidDate(notification.createdAt)?.toLocaleString("en-IN") ||
                                ""
                            }
                            className="
                                hidden
                                shrink-0
                                text-[10px]
                                text-gray-400
                                sm:block
                                dark:text-gray-500
                            "
                        >
                            {formatNotificationTime(notification.createdAt)}
                        </time>
                    </div>

                    {/* =====================================================
                        META
                    ===================================================== */}

                    <div
                        className="
                            mt-3
                            flex
                            flex-wrap
                            items-center
                            gap-2
                        "
                    >
                        <span
                            className={`
                                inline-flex
                                items-center
                                gap-1.5
                                rounded-full
                                px-2
                                py-1
                                text-[10px]
                                font-medium
                                ${config.className}
                            `}
                        >
                            <Icon size={10} />

                            {config.label}
                        </span>

                        <span
                            className="
                                inline-flex
                                items-center
                                gap-1.5
                                rounded-full
                                border
                                border-gray-200
                                bg-gray-50
                                px-2
                                py-1
                                text-[10px]
                                font-medium
                                text-gray-500
                                dark:border-gray-700
                                dark:bg-gray-800
                                dark:text-gray-400
                            "
                        >
                            <span
                                className={`
                                    h-1.5
                                    w-1.5
                                    rounded-full
                                    ${priority.dot}
                                `}
                            />

                            {priority.label}
                        </span>

                        {/* Mobile time */}

                        <span
                            className="
                                ml-auto
                                text-[10px]
                                text-gray-400
                                sm:hidden
                                dark:text-gray-500
                            "
                        >
                            {formatNotificationTime(notification.createdAt)}
                        </span>
                    </div>

                    {/* =====================================================
                        MARK AS READ
                    ===================================================== */}

                    {!notification.read && (
                        <div
                            className="
                                mt-3
                            "
                        >
                            <button
                                type="button"
                                onClick={() => onMarkRead(notification)}
                                disabled={marking}
                                className="
                                    inline-flex
                                    h-8
                                    items-center
                                    gap-1.5
                                    rounded-lg
                                    text-[10px]
                                    font-semibold
                                    text-gray-500
                                    transition
                                    hover:text-gray-900
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                    dark:text-gray-400
                                    dark:hover:text-white
                                "
                            >
                                {marking ? (
                                    <Loader2
                                        size={12}
                                        className="
                                            animate-spin
                                        "
                                    />
                                ) : (
                                    <Check size={12} />
                                )}
                                Mark as read
                                <ChevronRight size={11} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
};

// ============================================================================
// LOADING
// ============================================================================

const NotificationLoading = () => {
    return (
        <div
            className="
                    min-h-full
                    bg-gray-50/50
                    dark:bg-gray-950
                "
        >
            <div
                className="
                        mx-auto
                        max-w-4xl
                        px-4
                        py-6
                        sm:px-6
                        sm:py-8
                        lg:px-8
                    "
            >
                <NotificationHeader
                    unreadCount={0}
                    refreshing={false}
                    markingAll={false}
                    onRefresh={() => { }}
                    onMarkAll={() => { }}
                />

                <div
                    className="
                            mt-8
                            space-y-2
                            animate-pulse
                        "
                >
                    {[1, 2, 3, 4, 5].map((item) => (
                        <div
                            key={item}
                            className="
                                        flex
                                        gap-4
                                        rounded-2xl
                                        border
                                        border-gray-200
                                        bg-white
                                        p-5
                                        dark:border-gray-800
                                        dark:bg-gray-900
                                    "
                        >
                            <div
                                className="
                                            h-10
                                            w-10
                                            shrink-0
                                            rounded-xl
                                            bg-gray-200
                                            dark:bg-gray-800
                                        "
                            />

                            <div
                                className="
                                            flex-1
                                        "
                            >
                                <div
                                    className="
                                                h-3
                                                w-52
                                                max-w-full
                                                rounded
                                                bg-gray-200
                                                dark:bg-gray-800
                                            "
                                />

                                <div
                                    className="
                                                mt-2
                                                h-2.5
                                                w-80
                                                max-w-full
                                                rounded
                                                bg-gray-100
                                                dark:bg-gray-800
                                            "
                                />

                                <div
                                    className="
                                                mt-3
                                                h-2
                                                w-16
                                                rounded
                                                bg-gray-100
                                                dark:bg-gray-800
                                            "
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// ERROR
// ============================================================================

const NotificationError = ({ error, refreshing, onRetry }) => {
    return (
        <div
            className="
                min-h-full
                bg-gray-50/50
                dark:bg-gray-950
            "
        >
            <div
                className="
                    mx-auto
                    max-w-4xl
                    px-4
                    py-6
                    sm:px-6
                    sm:py-8
                    lg:px-8
                "
            >
                <NotificationHeader
                    unreadCount={0}
                    refreshing={refreshing}
                    markingAll={false}
                    onRefresh={onRetry}
                    onMarkAll={() => { }}
                />

                <div
                    className="
                        mt-8
                        rounded-2xl
                        border
                        border-red-200
                        bg-white
                        p-8
                        text-center
                        shadow-sm
                        dark:border-red-900/40
                        dark:bg-gray-900
                    "
                >
                    <div
                        className="
                            mx-auto
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-2xl
                            bg-red-50
                            text-red-600
                            dark:bg-red-950/40
                            dark:text-red-400
                        "
                    >
                        <BellOff size={21} />
                    </div>

                    <h2
                        className="
                            mt-4
                            text-sm
                            font-semibold
                            text-gray-900
                            dark:text-white
                        "
                    >
                        Notifications unavailable
                    </h2>

                    <p
                        className="
                            mx-auto
                            mt-2
                            max-w-sm
                            text-xs
                            leading-5
                            text-gray-500
                            dark:text-gray-400
                        "
                    >
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={onRetry}
                        disabled={refreshing}
                        className="
                            mt-5
                            inline-flex
                            h-10
                            items-center
                            gap-2
                            rounded-xl
                            bg-gray-900
                            px-4
                            text-xs
                            font-semibold
                            text-white
                            transition
                            hover:bg-gray-800
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                            dark:bg-white
                            dark:text-gray-900
                            dark:hover:bg-gray-100
                        "
                    >
                        {refreshing ? (
                            <Loader2
                                size={14}
                                className="
                                    animate-spin
                                "
                            />
                        ) : (
                            <RefreshCw size={14} />
                        )}
                        Try again
                    </button>
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// EMPTY STATE
// ============================================================================

const EmptyNotifications = ({ unreadOnly }) => {
    return (
        <div
            className="
                mt-8
                overflow-hidden
                rounded-2xl
                border
                border-gray-200
                bg-white
                dark:border-gray-800
                dark:bg-gray-900
            "
        >
            <div
                className="
                    px-5
                    py-14
                    text-center
                    sm:px-8
                    sm:py-16
                "
            >
                <div
                    className="
                        mx-auto
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        rounded-2xl
                        bg-gray-100
                        text-gray-500
                        dark:bg-gray-800
                        dark:text-gray-400
                    "
                >
                    {unreadOnly ? (
                        <CheckCheck size={23} strokeWidth={1.7} />
                    ) : (
                        <Bell size={23} strokeWidth={1.7} />
                    )}
                </div>

                <h2
                    className="
                        mt-5
                        text-base
                        font-semibold
                        text-gray-900
                        dark:text-white
                    "
                >
                    {unreadOnly ? "You're all caught up" : "No notifications yet"}
                </h2>

                <p
                    className="
                        mx-auto
                        mt-2
                        max-w-sm
                        text-sm
                        leading-6
                        text-gray-500
                        dark:text-gray-400
                    "
                >
                    {unreadOnly
                        ? "There are no unread notifications waiting for you."
                        : "Important updates from your family workspace will appear here."}
                </p>
            </div>
        </div>
    );
};

export default FamilyNotifications;
