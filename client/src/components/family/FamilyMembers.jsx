import { useMemo, useState } from "react";
import {
    Search,
    SlidersHorizontal,
    UserPlus,
    Users,
    X,
    ChevronRight,
    ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import FamilyMemberCard from "./FamilyMemberCard";
import EmptyFamilyState from "./EmptyFamilyState";

// ============================================================================
// HELPERS
// ============================================================================

const getMemberId = (member) => {
    return (
        member?._id || member?.id || member?.user?._id || member?.user?.id || null
    );
};

const getMemberName = (member) => {
    return (
        member?.name ||
        member?.user?.name ||
        member?.profile?.name ||
        member?.email ||
        member?.user?.email ||
        "Family member"
    );
};

const getMemberEmail = (member) => {
    return member?.email || member?.user?.email || member?.profile?.email || "";
};

const getMemberRole = (member) => {
    return member?.role || member?.memberRole || member?.userRole || "member";
};

const normalizeRole = (role) => {
    return String(role || "")
        .trim()
        .toLowerCase();
};

const getMemberStatus = (member) => {
    const status = member?.status || member?.invitationStatus || member?.state;

    if (!status) {
        return "active";
    }

    return String(status).trim().toLowerCase();
};

const getAccessLevel = (member) => {
    return (
        member?.access || member?.permission || member?.permissions?.level || "View"
    );
};

// ============================================================================
// COMPONENT
// ============================================================================

const FamilyMembers = ({
    members = [],
    family = null,
    onRemove,
    removingMemberId = null,
    onAddMember,
}) => {
    const navigate = useNavigate();

    // =========================================================================
    // UI STATE
    // =========================================================================

    const [searchQuery, setSearchQuery] = useState("");

    const [roleFilter, setRoleFilter] = useState("all");

    const [statusFilter, setStatusFilter] = useState("all");

    // =========================================================================
    // FILTER MEMBERS
    // =========================================================================

    const filteredMembers = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return members.filter((member) => {
            const name = getMemberName(member).toLowerCase();

            const email = getMemberEmail(member).toLowerCase();

            const role = normalizeRole(getMemberRole(member));

            const status = getMemberStatus(member);

            // -------------------------------------------------------------
            // SEARCH
            // -------------------------------------------------------------

            const matchesSearch =
                !query ||
                name.includes(query) ||
                email.includes(query) ||
                role.includes(query);

            // -------------------------------------------------------------
            // ROLE
            // -------------------------------------------------------------

            const matchesRole = roleFilter === "all" || role === roleFilter;

            // -------------------------------------------------------------
            // STATUS
            // -------------------------------------------------------------

            const matchesStatus = statusFilter === "all" || status === statusFilter;

            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [members, searchQuery, roleFilter, statusFilter]);

    // =========================================================================
    // AVAILABLE ROLES
    // =========================================================================

    const roles = useMemo(() => {
        const uniqueRoles = new Set();

        members.forEach((member) => {
            const role = normalizeRole(getMemberRole(member));

            if (role) {
                uniqueRoles.add(role);
            }
        });

        return Array.from(uniqueRoles);
    }, [members]);

    // =========================================================================
    // AVAILABLE STATUSES
    // =========================================================================

    const statuses = useMemo(() => {
        const uniqueStatuses = new Set();

        members.forEach((member) => {
            const status = getMemberStatus(member);

            if (status) {
                uniqueStatuses.add(status);
            }
        });

        return Array.from(uniqueStatuses);
    }, [members]);

    // =========================================================================
    // OPEN MEMBER DETAILS
    // =========================================================================

    const handleOpenMember = (member) => {
        const memberId = getMemberId(member);

        if (!memberId) {
            return;
        }

        navigate(`/family/members/${memberId}`);
    };

    // =========================================================================
    // CLEAR FILTERS
    // =========================================================================

    const clearFilters = () => {
        setSearchQuery("");

        setRoleFilter("all");

        setStatusFilter("all");
    };

    const hasActiveFilters =
        Boolean(searchQuery.trim()) ||
        roleFilter !== "all" ||
        statusFilter !== "all";

    // =========================================================================
    // NO MEMBERS
    // =========================================================================

    if (!members.length) {
        return (
            <div className="py-4">
                <EmptyFamilyState onAddMember={onAddMember} />
            </div>
        );
    }

    // =========================================================================
    // MAIN
    // =========================================================================

    return (
        <div className="space-y-5">
            {/* =================================================================
                TOOLBAR
            ================================================================= */}

            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    {/* =========================================================
                        SEARCH
                    ========================================================= */}

                    <div className="relative w-full lg:max-w-md">
                        <Search
                            size={17}
                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                        />

                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            placeholder="Search members by name or email..."
                            className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-10 text-sm font-medium text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:bg-white focus:ring-4 focus:ring-gray-100 dark:border-gray-800 dark:bg-gray-950 dark:text-white dark:placeholder:text-gray-600 dark:focus:border-gray-700 dark:focus:bg-gray-950 dark:focus:ring-gray-900"
                        />

                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center text-gray-400 transition hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-200"
                                aria-label="Clear search"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {/* =========================================================
                        ADD MEMBER
                    ========================================================= */}

                    <button
                        type="button"
                        onClick={onAddMember}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-900/10 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 dark:focus:ring-white/10"
                    >
                        <UserPlus size={16} />
                        Add member
                    </button>
                </div>

                {/* =============================================================
                    FILTERS
                ============================================================= */}

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                            <SlidersHorizontal size={14} />
                            Filters
                        </div>

                        {/* =====================================================
                            ROLE
                        ===================================================== */}

                        <select
                            value={roleFilter}
                            onChange={(event) => setRoleFilter(event.target.value)}
                            className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 outline-none transition hover:border-gray-300 focus:border-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
                        >
                            <option value="all">All roles</option>

                            {roles.map((role) => (
                                <option key={role} value={role}>
                                    {role.charAt(0).toUpperCase() + role.slice(1)}
                                </option>
                            ))}
                        </select>

                        {/* =====================================================
                            STATUS
                        ===================================================== */}

                        <select
                            value={statusFilter}
                            onChange={(event) => setStatusFilter(event.target.value)}
                            className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 outline-none transition hover:border-gray-300 focus:border-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
                        >
                            <option value="all">All statuses</option>

                            {statuses.map((status) => (
                                <option key={status} value={status}>
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </option>
                            ))}
                        </select>

                        {/* =====================================================
                            CLEAR
                        ===================================================== */}

                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                            >
                                <X size={13} />
                                Clear
                            </button>
                        )}
                    </div>

                    {/* =========================================================
                        RESULT COUNT
                    ========================================================= */}

                    <p className="text-xs font-medium text-gray-400 dark:text-gray-500">
                        Showing{" "}
                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                            {filteredMembers.length}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                            {members.length}
                        </span>{" "}
                        members
                    </p>
                </div>
            </div>

            {/* =================================================================
                EMPTY FILTER RESULT
            ================================================================= */}

            {filteredMembers.length === 0 && (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/70 px-5 py-12 text-center dark:border-gray-800 dark:bg-gray-950/50">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-gray-400 shadow-sm dark:bg-gray-900 dark:text-gray-500">
                        <Search size={21} />
                    </div>

                    <h3 className="mt-4 text-sm font-bold text-gray-900 dark:text-white">
                        No members found
                    </h3>

                    <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-gray-500 dark:text-gray-400">
                        Try changing your search or filters to find another family member.
                    </p>

                    <button
                        type="button"
                        onClick={clearFilters}
                        className="mt-5 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                        Reset filters
                    </button>
                </div>
            )}

            {/* =================================================================
                MEMBER GRID
            ================================================================= */}

            {filteredMembers.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredMembers.map((member, index) => {
                        const memberId = getMemberId(member) || `member-${index}`;

                        return (
                            <div key={memberId} className="group relative min-w-0">
                                {/* =================================================
                                        MEMBER CARD
                                    ================================================= */}

                                <div
                                    className="cursor-pointer"
                                    onClick={() => handleOpenMember(member)}
                                >
                                    <FamilyMemberCard
                                        member={member}
                                        onRemove={(event) => {
                                            /*
                                             * Prevent the card click
                                             * from opening details when
                                             * the remove action is used.
                                             */

                                            if (event?.stopPropagation) {
                                                event.stopPropagation();
                                            }

                                            onRemove?.(member);
                                        }}
                                        removing={String(removingMemberId) === String(memberId)}
                                    />
                                </div>

                                {/* =================================================
                                        QUICK DETAILS INDICATOR
                                    ================================================= */}

                                <div className="pointer-events-none absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white/90 text-gray-400 opacity-0 shadow-sm backdrop-blur transition duration-200 group-hover:opacity-100 dark:border-gray-700 dark:bg-gray-900/90 dark:text-gray-500">
                                    <ChevronRight size={15} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* =================================================================
                FOOTER INFORMATION
            ================================================================= */}

            <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-gray-50/70 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:bg-gray-950/50">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-gray-500 shadow-sm dark:bg-gray-900 dark:text-gray-400">
                        <ShieldCheck size={16} />
                    </div>

                    <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                            Family access is permission controlled
                        </p>

                        <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                            Members only see resources shared with them.
                        </p>
                    </div>
                </div>

                <div className="flex shrink-0 items-center gap-2 text-xs font-semibold text-gray-400 dark:text-gray-500">
                    <Users size={14} />
                    {members.length} {members.length === 1 ? "member" : "members"}
                </div>
            </div>
        </div>
    );
};

export default FamilyMembers;
