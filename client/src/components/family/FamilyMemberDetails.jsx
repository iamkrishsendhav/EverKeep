import { useCallback, useEffect, useMemo, useState } from "react";

import {
    ArrowLeft,
    CalendarDays,
    Check,
    CheckCircle2,
    ChevronRight,
    Clock3,
    Crown,
    FileText,
    Loader2,
    Mail,
    MoreHorizontal,
    Package,
    RefreshCw,
    Shield,
    ShieldCheck,
    UserRound,
    UserX,
    X,
} from "lucide-react";

import { getFamilyMember, FamilyApiError } from "../../services/family.service";

// ============================================================================
// ROLE CONFIG
// ============================================================================

const ROLE_CONFIG = {
    owner: {
        label: "Owner",
        icon: Crown,
        className:
            "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    },

    admin: {
        label: "Admin",
        icon: ShieldCheck,
        className:
            "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400",
    },

    member: {
        label: "Member",
        icon: UserRound,
        className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
    },
};

// ============================================================================
// STATUS CONFIG
// ============================================================================

const STATUS_CONFIG = {
    active: {
        label: "Active",
        icon: CheckCircle2,
        dot: "bg-emerald-500",
        className: "text-emerald-600 dark:text-emerald-400",
    },

    pending: {
        label: "Pending",
        icon: Clock3,
        dot: "bg-amber-500",
        className: "text-amber-600 dark:text-amber-400",
    },

    inactive: {
        label: "Inactive",
        icon: UserX,
        dot: "bg-gray-400",
        className: "text-gray-400 dark:text-gray-500",
    },
};

// ============================================================================
// RESOURCE CONFIG
// ============================================================================

const RESOURCE_CONFIG = [
    {
        key: "assets",
        label: "Assets",
        description: "Shared household and personal assets.",
        icon: Package,
    },

    {
        key: "subscriptions",
        label: "Subscriptions",
        description: "Shared subscription information.",
        icon: Shield,
    },

    {
        key: "warranties",
        label: "Warranties",
        description: "Warranty and protection records.",
        icon: ShieldCheck,
    },

    {
        key: "documents",
        label: "Documents",
        description: "Shared family documents.",
        icon: FileText,
    },

    {
        key: "calendar",
        label: "Calendar",
        description: "Shared events and reminders.",
        icon: CalendarDays,
    },
];

// ============================================================================
// HELPERS
// ============================================================================

const getInitials = (name = "") => {
    const parts = name.trim().split(/\s+/).filter(Boolean);

    if (!parts.length) {
        return "U";
    }

    return parts
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("");
};

const normalizeRole = (role) => {
    const value = String(role || "member")
        .trim()
        .toLowerCase();

    if (value === "owner" || value === "family_owner") {
        return "owner";
    }

    if (value === "admin" || value === "family_admin") {
        return "admin";
    }

    return "member";
};

const normalizeStatus = (member = {}) => {
    const value = String(member.status || member.invitationStatus || "active")
        .trim()
        .toLowerCase();

    if (value === "pending" || value === "invited") {
        return "pending";
    }

    if (value === "inactive" || value === "disabled") {
        return "inactive";
    }

    return "active";
};

const normalizeMember = (response) => {
    const source = response?.data || response?.member || response || {};

    const user = source.user || source.member || source.profile || {};

    return {
        id: source._id || source.id || user._id || user.id,

        name:
            user.name ||
            source.name ||
            source.fullName ||
            source.displayName ||
            "Family member",

        email: user.email || source.email || "",

        profileImage:
            user.profileImage ||
            user.avatar ||
            source.profileImage ||
            source.avatar ||
            "",

        role: normalizeRole(source.role || source.familyRole || user.role),

        status: normalizeStatus(source),

        joinedAt: source.joinedAt || source.createdAt || user.createdAt || null,

        lastActiveAt:
            source.lastActiveAt || source.lastSeenAt || user.lastActiveAt || null,

        permissions: source.permissions || {},

        isCurrentUser: Boolean(source.isCurrentUser),

        raw: source,
    };
};

const formatDate = (date) => {
    if (!date) {
        return "Not available";
    }

    const value = new Date(date);

    if (Number.isNaN(value.getTime())) {
        return "Not available";
    }

    return value.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};

const formatLastActive = (date) => {
    if (!date) {
        return "No recent activity";
    }

    const value = new Date(date);

    if (Number.isNaN(value.getTime())) {
        return "No recent activity";
    }

    const diff = Math.floor((Date.now() - value.getTime()) / 1000);

    if (diff < 60) {
        return "Active just now";
    }

    const minutes = Math.floor(diff / 60);

    if (minutes < 60) {
        return `Active ${minutes}m ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
        return `Active ${hours}h ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 7) {
        return `Active ${days}d ago`;
    }

    return `Last active ${formatDate(date)}`;
};

// ============================================================================
// COMPONENT
// ============================================================================

const FamilyMemberDetails = ({ memberId, onBack }) => {
    // =========================================================================
    // STATE
    // =========================================================================

    const [member, setMember] = useState(null);

    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] = useState(false);

    const [error, setError] = useState("");

    const [menuOpen, setMenuOpen] = useState(false);

    // =========================================================================
    // LOAD MEMBER
    // =========================================================================

    const loadMember = useCallback(
        async (isRefresh = false) => {
            if (!memberId) {
                setError("A family member ID is required.");

                setLoading(false);

                return;
            }

            try {
                if (isRefresh) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                setError("");

                const response = await getFamilyMember(memberId);

                setMember(normalizeMember(response));
            } catch (requestError) {
                console.error("Family member details error:", requestError);

                setError(
                    requestError instanceof FamilyApiError
                        ? requestError.message
                        : "Unable to load member details.",
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [memberId],
    );

    // =========================================================================
    // INITIAL LOAD
    // =========================================================================

    useEffect(() => {
        loadMember();
    }, [loadMember]);

    // =========================================================================
    // CLOSE MENU
    // =========================================================================

    useEffect(() => {
        const handleClick = () => {
            setMenuOpen(false);
        };

        if (menuOpen) {
            window.addEventListener("click", handleClick);
        }

        return () => {
            window.removeEventListener("click", handleClick);
        };
    }, [menuOpen]);

    // =========================================================================
    // PERMISSION COUNT
    // =========================================================================

    const permissionCount = useMemo(() => {
        if (!member) {
            return 0;
        }

        return RESOURCE_CONFIG.filter((resource) =>
            Boolean(member.permissions[resource.key]),
        ).length;
    }, [member]);

    // =========================================================================
    // LOADING
    // =========================================================================

    if (loading) {
        return <DetailsLoading />;
    }

    // =========================================================================
    // ERROR
    // =========================================================================

    if (!member) {
        return (
            <DetailsError
                error={error || "Family member not found."}
                refreshing={refreshing}
                onRetry={() => loadMember(true)}
                onBack={onBack}
            />
        );
    }

    // =========================================================================
    // CONFIG
    // =========================================================================

    const role = ROLE_CONFIG[member.role] || ROLE_CONFIG.member;

    const status = STATUS_CONFIG[member.status] || STATUS_CONFIG.active;

    const RoleIcon = role.icon;

    const StatusIcon = status.icon;

    // =========================================================================
    // RENDER
    // =========================================================================

    return (
        <div className="min-h-full bg-gray-50/50 dark:bg-gray-950">
            <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                {/* ============================================================= */}
                {/* TOP NAVIGATION */}
                {/* ============================================================= */}

                <div className="flex items-center justify-between gap-3">
                    <button
                        type="button"
                        onClick={onBack}
                        className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-600 transition hover:bg-gray-50 hover:text-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                    >
                        <ArrowLeft size={15} />

                        <span className="hidden sm:inline">Back to members</span>

                        <span className="sm:hidden">Back</span>
                    </button>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => loadMember(true)}
                            disabled={refreshing}
                            aria-label="Refresh member"
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                        >
                            {refreshing ? (
                                <Loader2 size={15} className="animate-spin" />
                            ) : (
                                <RefreshCw size={15} />
                            )}
                        </button>

                        <div className="relative">
                            <button
                                type="button"
                                onClick={(event) => {
                                    event.stopPropagation();

                                    setMenuOpen((current) => !current);
                                }}
                                aria-label="Member actions"
                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50 hover:text-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                            >
                                <MoreHorizontal size={17} />
                            </button>

                            {menuOpen && (
                                <div
                                    onClick={(event) => event.stopPropagation()}
                                    className="absolute right-0 top-12 z-30 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl dark:border-gray-700 dark:bg-gray-900"
                                >
                                    <button
                                        type="button"
                                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-[11px] font-medium text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
                                    >
                                        <ShieldCheck size={14} />
                                        Manage permissions
                                    </button>

                                    <button
                                        type="button"
                                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-[11px] font-medium text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
                                    >
                                        <Mail size={14} />
                                        Send email
                                    </button>

                                    {member.role !== "owner" && (
                                        <button
                                            type="button"
                                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-[11px] font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                                        >
                                            <UserX size={14} />
                                            Remove member
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ============================================================= */}
                {/* PROFILE HERO */}
                {/* ============================================================= */}

                <section className="mt-5 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <div className="h-24 bg-gray-950 sm:h-28 dark:bg-gray-800" />

                    <div className="px-5 pb-6 sm:px-7">
                        <div className="-mt-10 flex flex-col gap-4 sm:-mt-11 sm:flex-row sm:items-end sm:justify-between">
                            <div className="flex items-end gap-4">
                                <Avatar member={member} />

                                <div className="min-w-0 pb-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h1 className="truncate text-xl font-semibold tracking-tight text-gray-950 sm:text-2xl dark:text-white">
                                            {member.name}
                                        </h1>

                                        {member.isCurrentUser && (
                                            <span className="rounded-full bg-gray-100 px-2 py-1 text-[9px] font-semibold text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                                                You
                                            </span>
                                        )}
                                    </div>

                                    <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-gray-400 dark:text-gray-500">
                                        <Mail size={12} />

                                        {member.email || "No email available"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 sm:pb-1">
                                <span
                                    className={`
                                        inline-flex
                                        items-center
                                        gap-1.5
                                        rounded-full
                                        px-2.5
                                        py-1.5
                                        text-[10px]
                                        font-semibold
                                        ${role.className}
                                    `}
                                >
                                    <RoleIcon size={11} />

                                    {role.label}
                                </span>

                                <span
                                    className={`
                                        inline-flex
                                        items-center
                                        gap-1.5
                                        text-[10px]
                                        font-semibold
                                        ${status.className}
                                    `}
                                >
                                    <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />

                                    {status.label}
                                </span>
                            </div>
                        </div>

                        {/* HERO META */}

                        <div className="mt-6 grid gap-3 border-t border-gray-100 pt-5 sm:grid-cols-3 dark:border-gray-800">
                            <MetaItem
                                label="Joined"
                                value={formatDate(member.joinedAt)}
                                icon={CalendarDays}
                            />

                            <MetaItem
                                label="Last activity"
                                value={formatLastActive(member.lastActiveAt)}
                                icon={Clock3}
                            />

                            <MetaItem
                                label="Shared access"
                                value={`${permissionCount} resource${permissionCount === 1 ? "" : "s"
                                    }`}
                                icon={Shield}
                            />
                        </div>
                    </div>
                </section>

                {/* ============================================================= */}
                {/* CONTENT GRID */}
                {/* ============================================================= */}

                <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
                    {/* ========================================================= */}
                    {/* PERMISSIONS */}
                    {/* ========================================================= */}

                    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                                    Access & permissions
                                </h2>

                                <p className="mt-1 text-[11px] leading-5 text-gray-400 dark:text-gray-500">
                                    Resources currently available to this member.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="hidden items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-semibold text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 sm:inline-flex dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                            >
                                Manage
                                <ChevronRight size={12} />
                            </button>
                        </div>

                        <div className="mt-5 divide-y divide-gray-100 dark:divide-gray-800">
                            {RESOURCE_CONFIG.map((resource) => {
                                const Icon = resource.icon;

                                const enabled = Boolean(member.permissions[resource.key]);

                                return (
                                    <div
                                        key={resource.key}
                                        className="flex items-center gap-3 py-3.5"
                                    >
                                        <div
                                            className={`
                                                    flex
                                                    h-9
                                                    w-9
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-xl
                                                    ${enabled
                                                    ? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                                                    : "bg-gray-50 text-gray-300 dark:bg-gray-950 dark:text-gray-700"
                                                }
                                                `}
                                        >
                                            <Icon size={15} />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p
                                                className={`
                                                        text-xs
                                                        font-semibold
                                                        ${enabled
                                                        ? "text-gray-800 dark:text-gray-200"
                                                        : "text-gray-400 dark:text-gray-600"
                                                    }
                                                    `}
                                            >
                                                {resource.label}
                                            </p>

                                            <p className="mt-0.5 truncate text-[10px] text-gray-400 dark:text-gray-500">
                                                {resource.description}
                                            </p>
                                        </div>

                                        <div
                                            className={`
                                                    flex
                                                    h-6
                                                    w-6
                                                    items-center
                                                    justify-center
                                                    rounded-full
                                                    ${enabled
                                                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                                                    : "bg-gray-100 text-gray-300 dark:bg-gray-800 dark:text-gray-600"
                                                }
                                                `}
                                        >
                                            {enabled ? <Check size={12} /> : <X size={11} />}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* ========================================================= */}
                    {/* MEMBER INFORMATION */}
                    {/* ========================================================= */}

                    <div className="space-y-5">
                        {/* ACCOUNT INFO */}

                        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 dark:border-gray-800 dark:bg-gray-900">
                            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                                Member information
                            </h2>

                            <div className="mt-5 space-y-4">
                                <InfoRow label="Full name" value={member.name} />

                                <InfoRow
                                    label="Email"
                                    value={member.email || "Not available"}
                                />

                                <InfoRow label="Role" value={role.label} />

                                <InfoRow
                                    label="Member since"
                                    value={formatDate(member.joinedAt)}
                                />
                            </div>
                        </section>

                        {/* SECURITY */}

                        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 dark:border-gray-800 dark:bg-gray-900">
                            <div className="flex items-start gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                                    <ShieldCheck size={16} />
                                </div>

                                <div>
                                    <h2 className="text-xs font-semibold text-gray-900 dark:text-white">
                                        Family access
                                    </h2>

                                    <p className="mt-1 text-[10px] leading-5 text-gray-400 dark:text-gray-500">
                                        Access is controlled by the family workspace permissions.
                                        Changes can be applied at any time.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* DANGER AREA */}

                        {member.role !== "owner" && (
                            <section className="rounded-2xl border border-red-200 bg-white p-5 sm:p-6 dark:border-red-900/40 dark:bg-gray-900">
                                <h2 className="text-xs font-semibold text-red-700 dark:text-red-400">
                                    Remove member
                                </h2>

                                <p className="mt-1.5 text-[10px] leading-5 text-gray-400 dark:text-gray-500">
                                    Removing this member will revoke their access to the family
                                    workspace.
                                </p>

                                <button
                                    type="button"
                                    className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg border border-red-200 px-3 text-[10px] font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30"
                                >
                                    <UserX size={13} />
                                    Remove member
                                </button>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// AVATAR
// ============================================================================

const Avatar = ({ member }) => {
    if (member.profileImage) {
        return (
            <img
                src={member.profileImage}
                alt={member.name}
                className="h-20 w-20 shrink-0 rounded-2xl border-4 border-white object-cover shadow-md sm:h-[88px] sm:w-[88px] dark:border-gray-900"
            />
        );
    }

    return (
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-gray-900 text-lg font-semibold text-white shadow-md sm:h-[88px] sm:w-[88px] dark:border-gray-900 dark:bg-white dark:text-gray-900">
            {getInitials(member.name)}
        </div>
    );
};

// ============================================================================
// META ITEM
// ============================================================================

const MetaItem = ({ label, value, icon: Icon }) => (
    <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            <Icon size={14} />
        </div>

        <div className="min-w-0">
            <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-gray-400 dark:text-gray-500">
                {label}
            </p>

            <p className="mt-0.5 truncate text-[11px] font-medium text-gray-700 dark:text-gray-300">
                {value}
            </p>
        </div>
    </div>
);

// ============================================================================
// INFO ROW
// ============================================================================

const InfoRow = ({ label, value }) => (
    <div className="flex items-center justify-between gap-4">
        <span className="text-[10px] text-gray-400 dark:text-gray-500">
            {label}
        </span>

        <span className="max-w-[65%] truncate text-right text-[11px] font-medium text-gray-700 dark:text-gray-300">
            {value}
        </span>
    </div>
);

// ============================================================================
// LOADING
// ============================================================================

const DetailsLoading = () => (
    <div className="min-h-full bg-gray-50/50 dark:bg-gray-950">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            <div className="animate-pulse">
                <div className="h-10 w-32 rounded-xl bg-gray-200 dark:bg-gray-800" />

                <div className="mt-5 overflow-hidden rounded-3xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                    <div className="h-28 bg-gray-200 dark:bg-gray-800" />

                    <div className="px-5 pb-6">
                        <div className="-mt-10 flex items-end gap-4">
                            <div className="h-20 w-20 rounded-2xl bg-gray-300 dark:bg-gray-700" />

                            <div className="pb-1">
                                <div className="h-5 w-40 rounded bg-gray-200 dark:bg-gray-800" />

                                <div className="mt-2 h-3 w-52 rounded bg-gray-100 dark:bg-gray-800" />
                            </div>
                        </div>

                        <div className="mt-6 h-14 rounded-xl bg-gray-100 dark:bg-gray-800" />
                    </div>
                </div>

                <div className="mt-5 grid gap-5 lg:grid-cols-2">
                    <div className="h-96 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900" />

                    <div className="h-72 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900" />
                </div>
            </div>
        </div>
    </div>
);

// ============================================================================
// ERROR
// ============================================================================

const DetailsError = ({ error, refreshing, onRetry, onBack }) => (
    <div className="min-h-full bg-gray-50/50 dark:bg-gray-950">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            <button
                type="button"
                onClick={onBack}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400"
            >
                <ArrowLeft size={15} />
                Back
            </button>

            <div className="mt-5 rounded-2xl border border-red-200 bg-white p-10 text-center dark:border-red-900/40 dark:bg-gray-900">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
                    <UserRound size={21} />
                </div>

                <h2 className="mt-4 text-sm font-semibold text-gray-900 dark:text-white">
                    Unable to load member
                </h2>

                <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-gray-500 dark:text-gray-400">
                    {error}
                </p>

                <button
                    type="button"
                    onClick={onRetry}
                    disabled={refreshing}
                    className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-gray-900 px-4 text-xs font-semibold text-white disabled:opacity-50 dark:bg-white dark:text-gray-900"
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

export default FamilyMemberDetails;
