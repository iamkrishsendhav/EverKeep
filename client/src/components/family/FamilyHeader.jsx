import {
    Users,
    UserPlus,
    Bell,
    ShieldCheck,
    RefreshCw,
    ChevronRight,
} from "lucide-react";

// ============================================================================
// FAMILY HEADER
// ============================================================================
//
// Premium EverKeep Family workspace header.
//
// Responsibilities:
// - Family identity
// - Member count
// - Shared resource summary
// - Upcoming renewal summary
// - Notification indicator
// - Primary member invitation action
//
// This component intentionally contains NO API logic.
// Parent component controls all actions.
//
// ============================================================================

const FamilyHeader = ({
    family,
    memberCount = 0,
    sharedAssetCount = 0,
    upcomingRenewals = 0,
    notificationCount = 0,
    onAddMember,
    onRefresh,
    refreshing = false,
}) => {
    // =========================================================================
    // FAMILY DATA
    // =========================================================================

    const familyName = family?.name || "My Family";

    const familyDescription =
        family?.description || "Manage your shared EverKeep workspace";

    const familyInitial = familyName.trim().charAt(0).toUpperCase() || "F";

    // =========================================================================
    // STAT ITEMS
    // =========================================================================

    const stats = [
        {
            label: "Members",

            value: memberCount,

            icon: Users,
        },

        {
            label: "Shared assets",

            value: sharedAssetCount,

            icon: ShieldCheck,
        },

        {
            label: "Renewals",

            value: upcomingRenewals,

            icon: RefreshCw,
        },
    ];

    // =========================================================================
    // RENDER
    // =========================================================================

    return (
        <section className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:border-gray-800 dark:bg-gray-900">
            {/* ================================================================= */}
            {/* SUBTLE BACKGROUND */}
            {/* ================================================================= */}

            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden"
            >
                <div className="absolute -right-20 -top-28 h-64 w-64 rounded-full bg-gray-100/80 blur-3xl dark:bg-gray-800/40" />

                <div className="absolute -bottom-28 left-1/3 h-48 w-48 rounded-full bg-gray-100/60 blur-3xl dark:bg-gray-800/30" />
            </div>

            {/* ================================================================= */}
            {/* CONTENT */}
            {/* ================================================================= */}

            <div className="relative">
                {/* ============================================================= */}
                {/* TOP SECTION */}
                {/* ============================================================= */}

                <div className="flex flex-col gap-6 p-5 sm:p-6 lg:flex-row lg:items-start lg:justify-between lg:p-7">
                    {/* ========================================================= */}
                    {/* FAMILY IDENTITY */}
                    {/* ========================================================= */}

                    <div className="min-w-0 flex-1">
                        <div className="flex items-start gap-4">
                            {/* ================================================= */}
                            {/* FAMILY AVATAR */}
                            {/* ================================================= */}

                            <div className="relative shrink-0">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-900 text-xl font-semibold tracking-tight text-white shadow-sm sm:h-16 sm:w-16 sm:text-2xl dark:bg-white dark:text-gray-900">
                                    {familyInitial}
                                </div>

                                {/* Online / active indicator */}

                                <span
                                    aria-label="Active family"
                                    className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-4 border-white bg-emerald-500 dark:border-gray-900"
                                >
                                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                </span>
                            </div>

                            {/* ================================================= */}
                            {/* TEXT */}
                            {/* ================================================= */}

                            <div className="min-w-0 pt-0.5">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="truncate text-xl font-semibold tracking-tight text-gray-950 sm:text-2xl dark:text-white">
                                        {familyName}
                                    </h1>

                                    {/* Workspace badge */}

                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                        <ShieldCheck size={12} />
                                        Shared workspace
                                    </span>
                                </div>

                                <p className="mt-1.5 max-w-xl text-sm leading-6 text-gray-500 dark:text-gray-400">
                                    {familyDescription}
                                </p>

                                {/* Family metadata */}

                                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500 dark:text-gray-400">
                                    <span className="inline-flex items-center gap-1.5">
                                        <Users size={13} />
                                        {memberCount} {memberCount === 1 ? "member" : "members"}
                                    </span>

                                    <span
                                        aria-hidden="true"
                                        className="hidden h-1 w-1 rounded-full bg-gray-300 sm:block dark:bg-gray-700"
                                    />

                                    <span>
                                        {sharedAssetCount} shared{" "}
                                        {sharedAssetCount === 1 ? "asset" : "assets"}
                                    </span>

                                    {upcomingRenewals > 0 && (
                                        <>
                                            <span
                                                aria-hidden="true"
                                                className="hidden h-1 w-1 rounded-full bg-gray-300 sm:block dark:bg-gray-700"
                                            />

                                            <span className="font-medium text-gray-700 dark:text-gray-300">
                                                {upcomingRenewals} upcoming{" "}
                                                {upcomingRenewals === 1 ? "renewal" : "renewals"}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ========================================================= */}
                    {/* ACTIONS */}
                    {/* ========================================================= */}

                    <div className="flex shrink-0 items-center gap-2">
                        {/* Notification button */}

                        <button
                            type="button"
                            aria-label={
                                notificationCount > 0
                                    ? `${notificationCount} unread notifications`
                                    : "Notifications"
                            }
                            className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 active:scale-[0.97] dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-800 dark:hover:text-white"
                        >
                            <Bell size={18} strokeWidth={1.8} />

                            {notificationCount > 0 && (
                                <span className="absolute right-2 top-2 flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-60" />

                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                                </span>
                            )}
                        </button>

                        {/* Refresh */}

                        {onRefresh && (
                            <button
                                type="button"
                                onClick={onRefresh}
                                disabled={refreshing}
                                aria-label="Refresh family"
                                className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.97] dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-800 dark:hover:text-white"
                            >
                                <RefreshCw
                                    size={17}
                                    className={refreshing ? "animate-spin" : ""}
                                />
                            </button>
                        )}

                        {/* Add member */}

                        <button
                            type="button"
                            onClick={onAddMember}
                            className="group inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-gray-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-900/20 active:scale-[0.98] dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                        >
                            <UserPlus size={17} strokeWidth={2} />

                            <span className="hidden sm:inline">Add member</span>

                            <ChevronRight
                                size={15}
                                className="hidden opacity-50 transition-transform duration-200 group-hover:translate-x-0.5 sm:block"
                            />
                        </button>
                    </div>
                </div>

                {/* ============================================================= */}
                {/* METRIC STRIP */}
                {/* ============================================================= */}

                <div className="border-t border-gray-100 dark:border-gray-800">
                    <div className="grid grid-cols-3 divide-x divide-gray-100 dark:divide-gray-800">
                        {stats.map(({ label, value, icon: Icon }) => (
                            <div
                                key={label}
                                className="group px-4 py-4 transition-colors hover:bg-gray-50/70 sm:px-6 dark:hover:bg-gray-800/30"
                            >
                                <div className="flex items-center gap-2">
                                    <Icon
                                        size={14}
                                        className="text-gray-400 transition-colors group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300"
                                    />

                                    <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-gray-400 dark:text-gray-500">
                                        {label}
                                    </span>
                                </div>

                                <p className="mt-1.5 text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl dark:text-white">
                                    {value}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FamilyHeader;
