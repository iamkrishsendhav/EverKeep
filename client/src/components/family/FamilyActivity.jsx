import { useCallback, useEffect, useMemo, useState } from "react";

import {
    Activity,
    CalendarDays,
    CheckCircle2,
    Clock3,
    CreditCard,
    FileText,
    Loader2,
    Package,
    RefreshCw,
    Settings,
    ShieldCheck,
    UserPlus,
    UserRoundPlus,
    Users,
    XCircle,
} from "lucide-react";

import {
    getFamilyActivity,
    FamilyApiError,
} from "../../services/family.service";

// ============================================================================
// HELPERS
// ============================================================================

const getInitials = (name = "") => {
    const parts = String(name).trim().split(/\s+/).filter(Boolean);

    if (!parts.length) {
        return "U";
    }

    return parts
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("");
};

const getValidDate = (value) => {
    const date = new Date(value);

    return Number.isNaN(date.getTime()) ? null : date;
};

const getDateKey = (date) => {
    const value = getValidDate(date);

    if (!value) {
        return "unknown";
    }

    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");

    const day = String(value.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const formatDateGroup = (date) => {
    const value = getValidDate(date);

    if (!value) {
        return "Recent activity";
    }

    const now = new Date();

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const target = new Date(
        value.getFullYear(),
        value.getMonth(),
        value.getDate(),
    );

    const difference = Math.round(
        (today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (difference === 0) {
        return "Today";
    }

    if (difference === 1) {
        return "Yesterday";
    }

    return value.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: value.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
};

const formatTime = (date) => {
    const value = getValidDate(date);

    if (!value) {
        return "";
    }

    return value.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
    });
};

const getRelativeTime = (date) => {
    const value = getValidDate(date);

    if (!value) {
        return "";
    }

    const seconds = Math.max(
        0,
        Math.floor((Date.now() - value.getTime()) / 1000),
    );

    if (seconds < 60) {
        return "Just now";
    }

    const minutes = Math.floor(seconds / 60);

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

    return formatDateGroup(value);
};

// ============================================================================
// ACTION CONFIG
// ============================================================================

const ACTION_CONFIG = {
    created: {
        label: "created",
        icon: CheckCircle2,
        className:
            "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
    },

    added: {
        label: "added",
        icon: UserPlus,
        className:
            "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
    },

    updated: {
        label: "updated",
        icon: RefreshCw,
        className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
    },

    edited: {
        label: "edited",
        icon: Settings,
        className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
    },

    removed: {
        label: "removed",
        icon: XCircle,
        className: "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400",
    },

    deleted: {
        label: "deleted",
        icon: XCircle,
        className: "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400",
    },

    shared: {
        label: "shared",
        icon: Users,
        className:
            "bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400",
    },

    invited: {
        label: "invited",
        icon: UserRoundPlus,
        className:
            "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400",
    },

    completed: {
        label: "completed",
        icon: CheckCircle2,
        className:
            "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
    },

    default: {
        label: "activity",
        icon: Activity,
        className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
    },
};

// ============================================================================
// RESOURCE CONFIG
// ============================================================================

const RESOURCE_CONFIG = {
    asset: {
        label: "Asset",
        icon: Package,
    },

    assets: {
        label: "Assets",
        icon: Package,
    },

    subscription: {
        label: "Subscription",
        icon: CreditCard,
    },

    subscriptions: {
        label: "Subscriptions",
        icon: CreditCard,
    },

    warranty: {
        label: "Warranty",
        icon: ShieldCheck,
    },

    warranties: {
        label: "Warranties",
        icon: ShieldCheck,
    },

    document: {
        label: "Document",
        icon: FileText,
    },

    documents: {
        label: "Documents",
        icon: FileText,
    },

    calendar: {
        label: "Calendar",
        icon: CalendarDays,
    },

    family: {
        label: "Family",
        icon: Users,
    },

    member: {
        label: "Member",
        icon: UserRoundPlus,
    },

    settings: {
        label: "Settings",
        icon: Settings,
    },

    default: {
        label: "Resource",
        icon: Activity,
    },
};

// ============================================================================
// NORMALIZE BACKEND ACTIVITY
// ============================================================================

const normalizeActivity = (item = {}, index = 0) => {
    const actor = item.actor || item.user || item.member || item.createdBy || {};

    const actorName =
        actor.name ||
        item.actorName ||
        item.userName ||
        item.memberName ||
        "Family member";

    const action = String(
        item.action || item.type || item.event || "default",
    ).toLowerCase();

    const resourceType = String(
        item.resourceType || item.resource || item.entityType || "default",
    ).toLowerCase();

    const resource =
        item.resourceName ||
        item.resourceTitle ||
        item.entityName ||
        item.title ||
        item.name ||
        "";

    const date =
        item.createdAt ||
        item.timestamp ||
        item.date ||
        item.updatedAt ||
        new Date().toISOString();

    return {
        id: item._id || item.id || `${date}-${index}`,

        actorName,

        actorEmail: actor.email || item.actorEmail || item.userEmail || "",

        action,

        resourceType,

        resource,

        description: item.description || item.message || "",

        date,

        metadata: item.metadata || {},
    };
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const FamilyActivity = () => {
    // =========================================================================
    // STATE
    // =========================================================================

    const [activities, setActivities] = useState([]);

    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] = useState(false);

    const [error, setError] = useState("");

    // =========================================================================
    // LOAD ACTIVITY
    // =========================================================================

    const loadActivity = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const response = await getFamilyActivity();

            const data =
                response?.data ??
                response?.activities ??
                response?.activity ??
                response ??
                [];

            const normalized = Array.isArray(data) ? data.map(normalizeActivity) : [];

            setActivities(normalized);
        } catch (requestError) {
            console.error("Family activity load error:", requestError);

            setError(
                requestError instanceof FamilyApiError
                    ? requestError.message
                    : "Unable to load family activity.",
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
        loadActivity();
    }, [loadActivity]);

    // =========================================================================
    // GROUP + SORT
    // =========================================================================

    const groupedActivities = useMemo(() => {
        const groups = {};

        activities.forEach((activity) => {
            const key = getDateKey(activity.date);

            if (!groups[key]) {
                groups[key] = [];
            }

            groups[key].push(activity);
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
                    const first = getValidDate(a.date)?.getTime() || 0;

                    const second = getValidDate(b.date)?.getTime() || 0;

                    return second - first;
                });

                return {
                    dateKey,
                    items: sortedItems,
                };
            });
    }, [activities]);

    // =========================================================================
    // LOADING
    // =========================================================================

    if (loading) {
        return <ActivityLoading />;
    }

    // =========================================================================
    // ERROR
    // =========================================================================

    if (error) {
        return (
            <ActivityError
                error={error}
                refreshing={refreshing}
                onRetry={() => loadActivity(true)}
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

                <ActivityHeader
                    refreshing={refreshing}
                    onRefresh={() => loadActivity(true)}
                />

                {/* =============================================================
                    CONTENT
                ============================================================= */}

                {activities.length === 0 ? (
                    <EmptyActivity />
                ) : (
                    <div
                        className="
                            mt-8
                            space-y-8
                        "
                    >
                        {groupedActivities.map(({ dateKey, items }) => (
                            <section key={dateKey}>
                                {/* =================================================
                                        DATE HEADER
                                    ================================================= */}

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
                                                text-[11px]
                                                font-semibold
                                                uppercase
                                                tracking-[0.1em]
                                                text-gray-400
                                                dark:text-gray-500
                                            "
                                    >
                                        {formatDateGroup(items[0]?.date)}
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

                                {/* =================================================
                                        TIMELINE
                                    ================================================= */}

                                <div
                                    className="
                                            relative
                                        "
                                >
                                    <div
                                        aria-hidden="true"
                                        className="
                                                absolute
                                                bottom-6
                                                left-[17px]
                                                top-6
                                                w-px
                                                bg-gray-200
                                                dark:bg-gray-800
                                            "
                                    />

                                    <div
                                        className="
                                                space-y-2
                                            "
                                    >
                                        {items.map((activity, index) => (
                                            <ActivityItem
                                                key={activity.id || index}
                                                activity={activity}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </section>
                        ))}
                    </div>
                )}

                {/* =============================================================
                    FOOTER
                ============================================================= */}

                {activities.length > 0 && (
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
                        <Clock3 size={12} />
                        Showing your family workspace activity
                    </div>
                )}
            </div>
        </div>
    );
};

// ============================================================================
// HEADER
// ============================================================================

const ActivityHeader = ({ refreshing, onRefresh }) => {
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
                        <Activity size={19} />
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
                            Family activity
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
                            A timeline of important changes across your family workspace.
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onRefresh}
                    disabled={refreshing}
                    aria-label="Refresh activity"
                    title="Refresh activity"
                    className="
                        flex
                        h-10
                        w-10
                        shrink-0
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
                        disabled:opacity-60
                        dark:border-gray-800
                        dark:bg-gray-900
                        dark:text-gray-400
                        dark:hover:bg-gray-800
                        dark:hover:text-white
                    "
                >
                    {refreshing ? (
                        <Loader2 size={16} className="animate-spin" />
                    ) : (
                        <RefreshCw size={16} />
                    )}
                </button>
            </div>
        </header>
    );
};

// ============================================================================
// ACTIVITY ITEM
// ============================================================================

const ActivityItem = ({ activity }) => {
    const actionConfig = ACTION_CONFIG[activity.action] || ACTION_CONFIG.default;

    const resourceConfig =
        RESOURCE_CONFIG[activity.resourceType] || RESOURCE_CONFIG.default;

    const ActionIcon = actionConfig.icon;

    const ResourceIcon = resourceConfig.icon;

    return (
        <article
            className="
                group
                relative
                flex
                gap-3
            "
        >
            {/* =============================================================
                TIMELINE ICON
            ============================================================= */}

            <div
                className="
                    relative
                    z-10
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white
                    bg-gray-100
                    text-gray-600
                    shadow-sm
                    dark:border-gray-950
                    dark:bg-gray-800
                    dark:text-gray-300
                "
            >
                <ActionIcon size={15} strokeWidth={1.8} />
            </div>

            {/* =============================================================
                ACTIVITY CARD
            ============================================================= */}

            <div
                className="
                    min-w-0
                    flex-1
                    rounded-2xl
                    border
                    border-gray-200
                    bg-white
                    px-4
                    py-4
                    shadow-sm
                    transition
                    duration-200
                    hover:border-gray-300
                    hover:shadow-md
                    dark:border-gray-800
                    dark:bg-gray-900
                    dark:hover:border-gray-700
                "
            >
                <div
                    className="
                        flex
                        items-start
                        justify-between
                        gap-4
                    "
                >
                    {/* =====================================================
                        ACTOR
                    ===================================================== */}

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
                                flex
                                h-8
                                w-8
                                shrink-0
                                items-center
                                justify-center
                                overflow-hidden
                                rounded-full
                                bg-gray-900
                                text-[10px]
                                font-semibold
                                text-white
                                dark:bg-white
                                dark:text-gray-900
                            "
                        >
                            {getInitials(activity.actorName)}
                        </div>

                        <div
                            className="
                                min-w-0
                            "
                        >
                            <p
                                className="
                                    text-sm
                                    leading-5
                                    text-gray-800
                                    dark:text-gray-200
                                "
                            >
                                <span
                                    className="
                                        font-semibold
                                        text-gray-950
                                        dark:text-white
                                    "
                                >
                                    {activity.actorName}
                                </span>

                                <span
                                    className="
                                        mx-1.5
                                        text-gray-400
                                    "
                                >
                                    {actionConfig.label}
                                </span>

                                {activity.resource && (
                                    <span
                                        className="
                                            font-medium
                                            text-gray-700
                                            dark:text-gray-300
                                        "
                                    >
                                        {activity.resource}
                                    </span>
                                )}
                            </p>

                            {activity.description && (
                                <p
                                    className="
                                        mt-1
                                        text-xs
                                        leading-5
                                        text-gray-500
                                        dark:text-gray-500
                                    "
                                >
                                    {activity.description}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* =====================================================
                        DESKTOP TIME
                    ===================================================== */}

                    <time
                        dateTime={activity.date}
                        title={getValidDate(activity.date)?.toLocaleString("en-IN") || ""}
                        className="
                            hidden
                            shrink-0
                            text-[11px]
                            text-gray-400
                            sm:block
                            dark:text-gray-500
                        "
                    >
                        {getRelativeTime(activity.date)}
                    </time>
                </div>

                {/* =========================================================
                    META
                ========================================================= */}

                <div
                    className="
                        mt-3
                        flex
                        flex-wrap
                        items-center
                        gap-2
                    "
                >
                    {/* =====================================================
                        ACTION
                    ===================================================== */}

                    <span
                        className={`
                            inline-flex
                            items-center
                            gap-1.5
                            rounded-full
                            px-2
                            py-1
                            text-[10px]
                            font-semibold
                            ${actionConfig.className}
                        `}
                    >
                        <ActionIcon size={11} />

                        {actionConfig.label}
                    </span>

                    {/* =====================================================
                        RESOURCE
                    ===================================================== */}

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
                        <ResourceIcon size={11} />

                        {resourceConfig.label}
                    </span>

                    {/* =====================================================
                        MOBILE TIME
                    ===================================================== */}

                    <span
                        className="
                            ml-auto
                            text-[10px]
                            text-gray-400
                            sm:hidden
                            dark:text-gray-500
                        "
                    >
                        {formatTime(activity.date)}
                    </span>
                </div>
            </div>
        </article>
    );
};

// ============================================================================
// LOADING
// ============================================================================

const ActivityLoading = () => {
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
                <ActivityHeader refreshing={false} onRefresh={() => { }} />

                <div
                    className="
                        mt-8
                        space-y-8
                    "
                >
                    {[1, 2, 3].map((group) => (
                        <div
                            key={group}
                            className="
                                    animate-pulse
                                "
                        >
                            <div
                                className="
                                        h-3
                                        w-20
                                        rounded
                                        bg-gray-200
                                        dark:bg-gray-800
                                    "
                            />

                            <div
                                className="
                                        mt-4
                                        overflow-hidden
                                        rounded-2xl
                                        border
                                        border-gray-200
                                        bg-white
                                        dark:border-gray-800
                                        dark:bg-gray-900
                                    "
                            >
                                {[1, 2, 3].map((item) => (
                                    <div
                                        key={item}
                                        className="
                                                    flex
                                                    gap-3
                                                    border-b
                                                    border-gray-100
                                                    p-5
                                                    last:border-b-0
                                                    dark:border-gray-800
                                                "
                                    >
                                        <div
                                            className="
                                                        h-9
                                                        w-9
                                                        shrink-0
                                                        rounded-full
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
                                                            w-36
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
                    ))}
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// ERROR
// ============================================================================

const ActivityError = ({ error, refreshing, onRetry }) => {
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
                <ActivityHeader refreshing={refreshing} onRefresh={onRetry} />

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
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-full
                            bg-red-50
                            text-red-600
                            dark:bg-red-950/40
                            dark:text-red-400
                        "
                    >
                        <Activity size={20} />
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
                        Activity could not be loaded
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
                            <Loader2 size={14} className="animate-spin" />
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

const EmptyActivity = () => {
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
                    <Activity size={23} strokeWidth={1.7} />
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
                    No activity yet
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
                    When something important happens in your family workspace, you'll see
                    it here.
                </p>

                <div
                    className="
                        mx-auto
                        mt-7
                        flex
                        max-w-md
                        flex-wrap
                        justify-center
                        gap-2
                    "
                >
                    {["Members", "Assets", "Subscriptions", "Warranties"].map((item) => (
                        <span
                            key={item}
                            className="
                                rounded-full
                                border
                                border-gray-200
                                bg-gray-50
                                px-3
                                py-1.5
                                text-[11px]
                                font-medium
                                text-gray-500
                                dark:border-gray-700
                                dark:bg-gray-800
                                dark:text-gray-400
                            "
                        >
                            {item}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FamilyActivity;
