import { useCallback, useEffect, useMemo, useState } from "react";

import {
    Activity,
    AlertCircle,
    Bell,
    Loader2,
    RefreshCw,
    Settings,
    ShieldCheck,
    UserPlus,
    Users,
    ArrowUpRight,
} from "lucide-react";

import FamilyHeader from "../../components/family/FamilyHeader";
import FamilyMembers from "../../components/family/FamilyMembers";
import FamilyActivity from "../../components/family/FamilyActivity";
import FamilyNotifications from "../../components/family/FamilyNotifications";
import FamilySettings from "../../components/family/FamilySettings";
import AddMemberModal from "../../components/family/AddMemberModal";
import EmptyFamilyState from "../../components/family/EmptyFamilyState";

import {
    getFamily,
    createFamily,
    getFamilyMembers,
    inviteFamilyMember,
    removeFamilyMember,
    getFamilyDashboard,
    getFamilyStats,
    getFamilyActivity,
    getFamilyNotifications,
    FamilyApiError,
} from "../../services/family.service";

/* ============================================================================
   HELPERS
============================================================================ */

const normalizeFamily = (response) => {
    if (!response) return null;

    if (response?.family) {
        return response.family;
    }

    if (response?.data?.family) {
        return response.data.family;
    }

    if (response?.data) {
        return response.data;
    }

    return response;
};

const normalizeArray = (response, key = null) => {
    if (Array.isArray(response)) {
        return response;
    }

    if (key && Array.isArray(response?.[key])) {
        return response[key];
    }

    if (Array.isArray(response?.data)) {
        return response.data;
    }

    if (key && Array.isArray(response?.data?.[key])) {
        return response.data[key];
    }

    return [];
};

const normalizeObject = (response, key = null) => {
    if (!response || typeof response !== "object") {
        return {};
    }

    if (key && response?.[key]) {
        return response[key];
    }

    if (response?.data && typeof response.data === "object") {
        if (key && response.data?.[key]) {
            return response.data[key];
        }

        return response.data;
    }

    return response;
};

/* ============================================================================
   SMALL UI COMPONENTS
============================================================================ */

const StatCard = ({
    label,
    value,
    icon: Icon,
    description,
}) => {
    return (
        <div
            className="
                group relative overflow-hidden
                rounded-2xl
                border border-slate-200/80
                bg-white
                p-5
                transition-all duration-200
                hover:-translate-y-0.5
                hover:border-slate-300
                hover:shadow-[0_12px_30px_-18px_rgba(15,23,42,0.35)]
                dark:border-slate-800
                dark:bg-slate-900
                dark:hover:border-slate-700
            "
        >
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400">
                        {label}
                    </p>

                    <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
                        {value}
                    </p>

                    {description && (
                        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                            {description}
                        </p>
                    )}
                </div>

                <div
                    className="
                        flex h-10 w-10 shrink-0 items-center justify-center
                        rounded-xl
                        bg-slate-100
                        text-slate-600
                        transition
                        group-hover:bg-slate-900
                        group-hover:text-white
                        dark:bg-slate-800
                        dark:text-slate-300
                        dark:group-hover:bg-white
                        dark:group-hover:text-slate-900
                    "
                >
                    <Icon size={18} strokeWidth={1.8} />
                </div>
            </div>
        </div>
    );
};

const SectionHeader = ({
    icon: Icon,
    title,
    description,
    action,
}) => {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
                <div
                    className="
                        flex h-10 w-10 shrink-0 items-center justify-center
                        rounded-xl
                        bg-slate-100
                        text-slate-600
                        dark:bg-slate-800
                        dark:text-slate-300
                    "
                >
                    <Icon size={18} strokeWidth={1.8} />
                </div>

                <div className="min-w-0">
                    <h2 className="text-sm font-semibold text-slate-950 dark:text-white">
                        {title}
                    </h2>

                    {description && (
                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                            {description}
                        </p>
                    )}
                </div>
            </div>

            {action}
        </div>
    );
};

/* ============================================================================
   COMPONENT
============================================================================ */

const Family = () => {
    /* =========================================================================
       DATA STATE
    ========================================================================= */

    const [family, setFamily] = useState(null);
    const [members, setMembers] = useState([]);
    const [dashboard, setDashboard] = useState({});
    const [stats, setStats] = useState({});
    const [activity, setActivity] = useState([]);
    const [notifications, setNotifications] = useState([]);

    /* =========================================================================
       UI STATE
    ========================================================================= */

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [removingMemberId, setRemovingMemberId] = useState(null);
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [activeSection, setActiveSection] = useState("overview");
    const [error, setError] = useState("");
    const [actionError, setActionError] = useState("");

    /* =========================================================================
       LOAD FAMILY DATA
    ========================================================================= */

    const loadFamilyData = useCallback(
        async ({ silent = false } = {}) => {
            try {
                if (silent) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                setError("");

                /* -------------------------------------------------------------
                   PRIMARY FAMILY
                ------------------------------------------------------------- */

                const familyResponse = await getFamily();

                const normalizedFamily =
                    normalizeFamily(familyResponse);

                setFamily(normalizedFamily);

                /* -------------------------------------------------------------
                   NO FAMILY
                ------------------------------------------------------------- */

                if (!normalizedFamily) {
                    setMembers([]);
                    setDashboard({});
                    setStats({});
                    setActivity([]);
                    setNotifications([]);

                    return;
                }

                /* -------------------------------------------------------------
                   SECONDARY DATA
                ------------------------------------------------------------- */

                const results = await Promise.allSettled([
                    getFamilyMembers(),

                    getFamilyDashboard(),

                    getFamilyStats(),

                    getFamilyActivity({
                        limit: 10,
                    }),

                    getFamilyNotifications({
                        limit: 10,
                    }),
                ]);

                /* -------------------------------------------------------------
                   MEMBERS
                ------------------------------------------------------------- */

                if (results[0].status === "fulfilled") {
                    setMembers(
                        normalizeArray(
                            results[0].value,
                            "members",
                        ),
                    );
                }

                /* -------------------------------------------------------------
                   DASHBOARD
                ------------------------------------------------------------- */

                if (results[1].status === "fulfilled") {
                    setDashboard(
                        normalizeObject(
                            results[1].value,
                            "dashboard",
                        ),
                    );
                }

                /* -------------------------------------------------------------
                   STATS
                ------------------------------------------------------------- */

                if (results[2].status === "fulfilled") {
                    setStats(
                        normalizeObject(
                            results[2].value,
                            "stats",
                        ),
                    );
                }

                /* -------------------------------------------------------------
                   ACTIVITY
                ------------------------------------------------------------- */

                if (results[3].status === "fulfilled") {
                    setActivity(
                        normalizeArray(
                            results[3].value,
                            "activity",
                        ),
                    );
                }

                /* -------------------------------------------------------------
                   NOTIFICATIONS
                ------------------------------------------------------------- */

                if (results[4].status === "fulfilled") {
                    setNotifications(
                        normalizeArray(
                            results[4].value,
                            "notifications",
                        ),
                    );
                }

                /* -------------------------------------------------------------
                   OPTIONAL FAILURES
                ------------------------------------------------------------- */

                const failedRequests = results.filter(
                    (result) =>
                        result.status === "rejected",
                );

                if (failedRequests.length > 0) {
                    console.warn(
                        "Some Family endpoints failed:",
                        failedRequests,
                    );
                }
            } catch (requestError) {
                console.error(
                    "Family page loading error:",
                    requestError,
                );

                if (
                    requestError instanceof FamilyApiError
                ) {
                    setError(requestError.message);
                } else {
                    setError(
                        "Unable to load your Family workspace.",
                    );
                }
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [],
    );

    /* =========================================================================
       INITIAL LOAD
    ========================================================================= */

    useEffect(() => {
        loadFamilyData();
    }, [loadFamilyData]);

    /* =========================================================================
       CREATE FAMILY
    ========================================================================= */

    const handleCreateFamily = async () => {
        try {
            setActionLoading(true);
            setActionError("");

            const response = await createFamily({
                name: "My Family",
            });

            setFamily(normalizeFamily(response));

            await loadFamilyData({
                silent: true,
            });
        } catch (requestError) {
            console.error(
                "Create family error:",
                requestError,
            );

            setActionError(
                requestError?.message ||
                    "Unable to create your family.",
            );
        } finally {
            setActionLoading(false);
        }
    };

    /* =========================================================================
       INVITE MEMBER
    ========================================================================= */

    const handleInviteMember = async (memberData) => {
        try {
            setActionLoading(true);
            setActionError("");

            await inviteFamilyMember(memberData);

            setShowAddMemberModal(false);

            await loadFamilyData({
                silent: true,
            });
        } catch (requestError) {
            console.error(
                "Invite member error:",
                requestError,
            );

            setActionError(
                requestError?.message ||
                    "Unable to send family invitation.",
            );
        } finally {
            setActionLoading(false);
        }
    };

    /* =========================================================================
       REMOVE MEMBER
    ========================================================================= */

    const handleRemoveMember = async (member) => {
        const memberId =
            member?._id ||
            member?.id ||
            member?.user?._id ||
            member?.user?.id;

        if (!memberId) {
            setActionError(
                "Unable to identify this family member.",
            );

            return;
        }

        const memberName =
            member?.name ||
            member?.user?.name ||
            member?.user?.email ||
            "this member";

        const confirmed = window.confirm(
            `Remove ${memberName} from your family?`,
        );

        if (!confirmed) {
            return;
        }

        try {
            setRemovingMemberId(memberId);
            setActionError("");

            await removeFamilyMember(memberId);

            setMembers((currentMembers) =>
                currentMembers.filter(
                    (currentMember) => {
                        const currentId =
                            currentMember?._id ||
                            currentMember?.id ||
                            currentMember?.user?._id ||
                            currentMember?.user?.id;

                        return (
                            String(currentId) !==
                            String(memberId)
                        );
                    },
                ),
            );

            await loadFamilyData({
                silent: true,
            });
        } catch (requestError) {
            console.error(
                "Remove member error:",
                requestError,
            );

            setActionError(
                requestError?.message ||
                    "Unable to remove family member.",
            );
        } finally {
            setRemovingMemberId(null);
        }
    };

    /* =========================================================================
       REFRESH
    ========================================================================= */

    const handleRefresh = async () => {
        await loadFamilyData({
            silent: true,
        });
    };

    /* =========================================================================
       DERIVED DATA
    ========================================================================= */

    const memberCount = members.length;

    const sharedAssetCount =
        stats?.sharedAssets ??
        dashboard?.sharedAssets ??
        dashboard?.summary?.sharedAssets ??
        0;

    const upcomingRenewals =
        stats?.upcomingRenewals ??
        dashboard?.upcomingRenewals ??
        dashboard?.summary?.upcomingRenewals ??
        0;

    const unreadNotificationCount =
        notifications.filter(
            (notification) =>
                !notification?.read &&
                !notification?.isRead,
        ).length;

    const familyActivity =
        activity.length > 0
            ? activity
            : normalizeArray(
                  dashboard?.activity,
              );

    const familyName =
        family?.name ||
        family?.title ||
        "Family";

    const currentMembers = useMemo(
        () => members,
        [members],
    );

    /* =========================================================================
       NAVIGATION
    ========================================================================= */

    const navigation = [
        {
            id: "overview",
            label: "Overview",
            icon: Users,
        },
        {
            id: "activity",
            label: "Activity",
            icon: Activity,
        },
        {
            id: "notifications",
            label: "Notifications",
            icon: Bell,
            count: unreadNotificationCount,
        },
        {
            id: "settings",
            label: "Settings",
            icon: Settings,
        },
    ];

    /* =========================================================================
       LOADING
    ========================================================================= */

    if (loading) {
        return (
            <div className="min-h-full bg-[#f8fafc] dark:bg-slate-950">
                <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <div className="animate-pulse space-y-6">
                        <div className="space-y-3">
                            <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-800" />

                            <div className="h-9 w-56 rounded-lg bg-slate-200 dark:bg-slate-800" />

                            <div className="h-4 w-80 rounded bg-slate-200 dark:bg-slate-800" />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {[1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="h-32 rounded-2xl bg-slate-200 dark:bg-slate-800"
                                />
                            ))}
                        </div>

                        <div className="h-16 rounded-2xl bg-slate-200 dark:bg-slate-800" />

                        <div className="h-96 rounded-2xl bg-slate-200 dark:bg-slate-800" />
                    </div>
                </div>
            </div>
        );
    }

    /* =========================================================================
       ERROR
    ========================================================================= */

    if (error && !family) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center bg-[#f8fafc] px-4 dark:bg-slate-950">
                <div
                    className="
                        w-full max-w-md
                        rounded-2xl
                        border border-slate-200
                        bg-white
                        p-8
                        text-center
                        shadow-[0_20px_50px_-25px_rgba(15,23,42,0.25)]
                        dark:border-slate-800
                        dark:bg-slate-900
                    "
                >
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
                        <AlertCircle size={22} />
                    </div>

                    <h2 className="mt-5 text-lg font-semibold text-slate-950 dark:text-white">
                        Unable to load Family
                    </h2>

                    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            loadFamilyData()
                        }
                        className="
                            mt-6
                            inline-flex
                            items-center
                            gap-2
                            rounded-xl
                            bg-slate-950
                            px-4
                            py-2.5
                            text-sm
                            font-semibold
                            text-white
                            transition
                            hover:bg-slate-800
                            dark:bg-white
                            dark:text-slate-950
                            dark:hover:bg-slate-100
                        "
                    >
                        <RefreshCw size={15} />
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    /* =========================================================================
       EMPTY FAMILY
    ========================================================================= */

    if (!family) {
        return (
            <div className="min-h-full bg-[#f8fafc] dark:bg-slate-950">
                <div className="mx-auto flex min-h-[75vh] max-w-4xl items-center justify-center px-4 py-10 sm:px-6">
                    <div className="w-full">
                        {actionError && (
                            <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
                                <AlertCircle
                                    size={17}
                                    className="mt-0.5 shrink-0"
                                />

                                <span>
                                    {actionError}
                                </span>
                            </div>
                        )}

                        <EmptyFamilyState
                            onAddMember={
                                handleCreateFamily
                            }
                        />
                    </div>
                </div>
            </div>
        );
    }

    /* =========================================================================
       MAIN PAGE
    ========================================================================= */

    return (
        <div className="min-h-full bg-[#f8fafc] text-slate-900 dark:bg-slate-950 dark:text-white">
            <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
                {/* =============================================================
                    TOP ERROR
                ============================================================= */}

                {actionError && (
                    <div
                        className="
                            mb-5
                            flex items-start gap-3
                            rounded-xl
                            border border-red-200
                            bg-red-50
                            px-4 py-3
                            text-sm text-red-700
                            dark:border-red-900/40
                            dark:bg-red-950/30
                            dark:text-red-300
                        "
                    >
                        <AlertCircle
                            size={17}
                            className="mt-0.5 shrink-0"
                        />

                        <div className="min-w-0 flex-1">
                            <p className="font-semibold">
                                Something went wrong
                            </p>

                            <p className="mt-0.5 opacity-90">
                                {actionError}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setActionError("")
                            }
                            className="text-xs font-semibold opacity-60 transition hover:opacity-100"
                        >
                            Dismiss
                        </button>
                    </div>
                )}

                {/* =============================================================
                    FAMILY HEADER
                ============================================================= */}

                <FamilyHeader
                    family={family}
                    memberCount={memberCount}
                    sharedAssetCount={
                        sharedAssetCount
                    }
                    upcomingRenewals={
                        upcomingRenewals
                    }
                    notificationCount={
                        unreadNotificationCount
                    }
                    onAddMember={() =>
                        setShowAddMemberModal(true)
                    }
                />

                {/* =============================================================
                    PAGE INTRO
                ============================================================= */}

                <div className="mt-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                                Family workspace
                            </span>
                        </div>

                        <h1 className="mt-2 truncate text-2xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
                            {familyName}
                        </h1>

                        <p className="mt-1.5 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                            Manage your family members,
                            shared assets and important
                            updates from one place.
                        </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                        <button
                            type="button"
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                px-3.5
                                py-2.5
                                text-sm
                                font-medium
                                text-slate-700
                                shadow-sm
                                transition
                                hover:border-slate-300
                                hover:bg-slate-50
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                                dark:border-slate-800
                                dark:bg-slate-900
                                dark:text-slate-200
                                dark:hover:border-slate-700
                                dark:hover:bg-slate-800
                            "
                        >
                            {refreshing ? (
                                <Loader2
                                    size={15}
                                    className="animate-spin"
                                />
                            ) : (
                                <RefreshCw size={15} />
                            )}

                            <span className="hidden sm:inline">
                                Refresh
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                setShowAddMemberModal(
                                    true,
                                )
                            }
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-slate-950
                                px-4
                                py-2.5
                                text-sm
                                font-semibold
                                text-white
                                shadow-sm
                                transition
                                hover:bg-slate-800
                                active:scale-[0.98]
                                dark:bg-white
                                dark:text-slate-950
                                dark:hover:bg-slate-100
                            "
                        >
                            <UserPlus size={15} />
                            Add member
                        </button>
                    </div>
                </div>

                {/* =============================================================
                    NAVIGATION
                ============================================================= */}

                <div className="mt-7 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex overflow-x-auto">
                        <div className="flex min-w-max gap-1">
                            {navigation.map(
                                ({
                                    id,
                                    label,
                                    icon: Icon,
                                    count,
                                }) => {
                                    const active =
                                        activeSection ===
                                        id;

                                    return (
                                        <button
                                            key={id}
                                            type="button"
                                            onClick={() =>
                                                setActiveSection(
                                                    id,
                                                )
                                            }
                                            className={`
                                                relative
                                                inline-flex
                                                items-center
                                                gap-2
                                                px-3.5
                                                py-3
                                                text-sm
                                                font-medium
                                                transition
                                                ${
                                                    active
                                                        ? "text-slate-950 dark:text-white"
                                                        : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                                                }
                                            `}
                                        >
                                            <Icon
                                                size={15}
                                                strokeWidth={
                                                    active
                                                        ? 2
                                                        : 1.8
                                                }
                                            />

                                            <span>
                                                {label}
                                            </span>

                                            {count > 0 && (
                                                <span
                                                    className="
                                                        min-w-5
                                                        rounded-full
                                                        bg-slate-950
                                                        px-1.5
                                                        py-0.5
                                                        text-center
                                                        text-[10px]
                                                        font-bold
                                                        text-white
                                                        dark:bg-white
                                                        dark:text-slate-950
                                                    "
                                                >
                                                    {count}
                                                </span>
                                            )}

                                            {active && (
                                                <span
                                                    className="
                                                        absolute
                                                        inset-x-2
                                                        -bottom-px
                                                        h-0.5
                                                        rounded-full
                                                        bg-slate-950
                                                        dark:bg-white
                                                    "
                                                />
                                            )}
                                        </button>
                                    );
                                },
                            )}
                        </div>
                    </div>
                </div>

                {/* =============================================================
                    CONTENT
                ============================================================= */}

                <main className="mt-6">
                    {/* =========================================================
                        OVERVIEW
                    ========================================================= */}

                    {activeSection ===
                        "overview" && (
                        <div className="space-y-6">
                            {/* -------------------------------------------------
                                STATS
                            ------------------------------------------------- */}

                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                <StatCard
                                    label="Family members"
                                    value={memberCount}
                                    icon={Users}
                                    description="People in your workspace"
                                />

                                <StatCard
                                    label="Shared assets"
                                    value={
                                        sharedAssetCount
                                    }
                                    icon={ShieldCheck}
                                    description="Assets shared with family"
                                />

                                <StatCard
                                    label="Upcoming renewals"
                                    value={
                                        upcomingRenewals
                                    }
                                    icon={Activity}
                                    description="Renewals that need attention"
                                />
                            </div>

                            {/* -------------------------------------------------
                                MEMBERS
                            ------------------------------------------------- */}

                            <section
                                className="
                                    overflow-hidden
                                    rounded-2xl
                                    border
                                    border-slate-200/80
                                    bg-white
                                    shadow-[0_8px_30px_-24px_rgba(15,23,42,0.3)]
                                    dark:border-slate-800
                                    dark:bg-slate-900
                                "
                            >
                                <div className="border-b border-slate-100 px-5 py-5 dark:border-slate-800 sm:px-6">
                                    <SectionHeader
                                        icon={Users}
                                        title="Family members"
                                        description="People who have access to this family workspace."
                                        action={
                                            <div className="hidden items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 sm:flex">
                                                <ShieldCheck
                                                    size={
                                                        14
                                                    }
                                                />
                                                Permission controlled
                                            </div>
                                        }
                                    />
                                </div>

                                <div className="p-4 sm:p-6">
                                    <FamilyMembers
                                        members={
                                            currentMembers
                                        }
                                        family={family}
                                        onRemove={
                                            handleRemoveMember
                                        }
                                        removingMemberId={
                                            removingMemberId
                                        }
                                        onAddMember={() =>
                                            setShowAddMemberModal(
                                                true,
                                            )
                                        }
                                    />
                                </div>
                            </section>

                            {/* -------------------------------------------------
                                ACTIVITY + NOTIFICATIONS
                            ------------------------------------------------- */}

                            <div className="grid gap-6 lg:grid-cols-2">
                                {/* Activity */}

                                <section
                                    className="
                                        overflow-hidden
                                        rounded-2xl
                                        border
                                        border-slate-200/80
                                        bg-white
                                        shadow-[0_8px_30px_-24px_rgba(15,23,42,0.3)]
                                        dark:border-slate-800
                                        dark:bg-slate-900
                                    "
                                >
                                    <div className="border-b border-slate-100 px-5 py-5 dark:border-slate-800">
                                        <SectionHeader
                                            icon={
                                                Activity
                                            }
                                            title="Recent activity"
                                            description="Latest updates from your family."
                                        />
                                    </div>

                                    <div className="p-4 sm:p-5">
                                        <FamilyActivity
                                            activity={
                                                familyActivity
                                            }
                                            family={
                                                family
                                            }
                                        />
                                    </div>
                                </section>

                                {/* Notifications */}

                                <section
                                    className="
                                        overflow-hidden
                                        rounded-2xl
                                        border
                                        border-slate-200/80
                                        bg-white
                                        shadow-[0_8px_30px_-24px_rgba(15,23,42,0.3)]
                                        dark:border-slate-800
                                        dark:bg-slate-900
                                    "
                                >
                                    <div className="border-b border-slate-100 px-5 py-5 dark:border-slate-800">
                                        <SectionHeader
                                            icon={Bell}
                                            title="Notifications"
                                            description="Family updates and alerts."
                                            action={
                                                unreadNotificationCount >
                                                    0 && (
                                                    <span
                                                        className="
                                                            rounded-full
                                                            bg-slate-100
                                                            px-2.5
                                                            py-1
                                                            text-[11px]
                                                            font-semibold
                                                            text-slate-700
                                                            dark:bg-slate-800
                                                            dark:text-slate-200
                                                        "
                                                    >
                                                        {
                                                            unreadNotificationCount
                                                        }{" "}
                                                        new
                                                    </span>
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="p-4 sm:p-5">
                                        <FamilyNotifications
                                            notifications={
                                                notifications
                                            }
                                            family={
                                                family
                                            }
                                        />
                                    </div>
                                </section>
                            </div>

                            {/* -------------------------------------------------
                                SECURITY NOTE
                            ------------------------------------------------- */}

                            <div
                                className="
                                    flex
                                    items-start
                                    gap-3
                                    rounded-2xl
                                    border
                                    border-slate-200/80
                                    bg-slate-50
                                    px-4
                                    py-4
                                    dark:border-slate-800
                                    dark:bg-slate-900/60
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
                                        rounded-lg
                                        bg-white
                                        text-slate-500
                                        shadow-sm
                                        dark:bg-slate-800
                                        dark:text-slate-300
                                    "
                                >
                                    <ShieldCheck
                                        size={16}
                                    />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                                        Your family workspace
                                    </p>

                                    <p className="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
                                        Access to shared
                                        assets and information
                                        is controlled by family
                                        member permissions.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* =========================================================
                        ACTIVITY
                    ========================================================= */}

                    {activeSection ===
                        "activity" && (
                        <section
                            className="
                                overflow-hidden
                                rounded-2xl
                                border
                                border-slate-200/80
                                bg-white
                                shadow-[0_8px_30px_-24px_rgba(15,23,42,0.3)]
                                dark:border-slate-800
                                dark:bg-slate-900
                            "
                        >
                            <div className="border-b border-slate-100 px-5 py-5 dark:border-slate-800 sm:px-6">
                                <SectionHeader
                                    icon={Activity}
                                    title="Family activity"
                                    description="A complete timeline of changes in your family workspace."
                                />
                            </div>

                            <div className="p-4 sm:p-6">
                                <FamilyActivity
                                    activity={
                                        familyActivity
                                    }
                                    family={family}
                                    full
                                />
                            </div>
                        </section>
                    )}

                    {/* =========================================================
                        NOTIFICATIONS
                    ========================================================= */}

                    {activeSection ===
                        "notifications" && (
                        <section
                            className="
                                overflow-hidden
                                rounded-2xl
                                border
                                border-slate-200/80
                                bg-white
                                shadow-[0_8px_30px_-24px_rgba(15,23,42,0.3)]
                                dark:border-slate-800
                                dark:bg-slate-900
                            "
                        >
                            <div className="border-b border-slate-100 px-5 py-5 dark:border-slate-800 sm:px-6">
                                <SectionHeader
                                    icon={Bell}
                                    title="Family notifications"
                                    description="Invitations, sharing updates and important family changes."
                                    action={
                                        unreadNotificationCount >
                                            0 && (
                                            <span
                                                className="
                                                    rounded-full
                                                    bg-slate-950
                                                    px-2.5
                                                    py-1
                                                    text-[11px]
                                                    font-semibold
                                                    text-white
                                                    dark:bg-white
                                                    dark:text-slate-950
                                                "
                                            >
                                                {
                                                    unreadNotificationCount
                                                }{" "}
                                                unread
                                            </span>
                                        )
                                    }
                                />
                            </div>

                            <div className="p-4 sm:p-6">
                                <FamilyNotifications
                                    notifications={
                                        notifications
                                    }
                                    family={family}
                                    full
                                />
                            </div>
                        </section>
                    )}

                    {/* =========================================================
                        SETTINGS
                    ========================================================= */}

                    {activeSection ===
                        "settings" && (
                        <section
                            className="
                                overflow-hidden
                                rounded-2xl
                                border
                                border-slate-200/80
                                bg-white
                                shadow-[0_8px_30px_-24px_rgba(15,23,42,0.3)]
                                dark:border-slate-800
                                dark:bg-slate-900
                            "
                        >
                            <div className="border-b border-slate-100 px-5 py-5 dark:border-slate-800 sm:px-6">
                                <SectionHeader
                                    icon={Settings}
                                    title="Family settings"
                                    description="Configure your family workspace and member access."
                                />
                            </div>

                            <div className="p-4 sm:p-6">
                                <FamilySettings
                                    family={family}
                                    members={
                                        currentMembers
                                    }
                                    onUpdated={
                                        loadFamilyData
                                    }
                                />
                            </div>
                        </section>
                    )}
                </main>
            </div>

            {/* ================================================================
                ADD MEMBER MODAL
            ================================================================ */}

            {showAddMemberModal && (
                <AddMemberModal
                    isOpen={showAddMemberModal}
                    onClose={() => {
                        if (actionLoading) {
                            return;
                        }

                        setShowAddMemberModal(
                            false,
                        );

                        setActionError("");
                    }}
                    onSubmit={handleInviteMember}
                    loading={actionLoading}
                />
            )}
        </div>
    );
};

export default Family;