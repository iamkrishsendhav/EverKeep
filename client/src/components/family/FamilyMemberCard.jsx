import {
    Activity,
    Bell,
    Check,
    CreditCard,
    FileText,
    Loader2,
    Package,
    Shield,
    ShieldCheck,
    Trash2,
    UserRound,
    X,
} from "lucide-react";

// ============================================================================
// FAMILY MEMBER CARD
// ============================================================================
//
// Premium member card for the EverKeep Family Workspace.
//
// Responsibilities:
// - Member identity
// - Role
// - Access level
// - Resource permissions
// - Notification status
// - Member removal
//
// Business/API logic stays in the parent component.
// ============================================================================

const FamilyMemberCard = ({ member, onRemove, removing = false }) => {
    // =========================================================================
    // NORMALIZE MEMBER
    // =========================================================================

    const user = member?.user || member;

    const memberId = member?._id || member?.id || user?._id || user?.id || null;

    const name = user?.name || member?.name || "Family Member";

    const email = user?.email || member?.email || "";

    const role = member?.role || member?.memberRole || "Member";

    const accessLevel = member?.accessLevel || member?.access || "View";

    const relationship = member?.relationship || "";

    const avatar =
        user?.profileImage ||
        user?.avatar ||
        member?.profileImage ||
        member?.avatar ||
        "";

    const status = member?.status || member?.invitationStatus || "active";

    const normalizedRole = String(role).trim().toLowerCase();

    const normalizedStatus = String(status).trim().toLowerCase();

    const normalizedAccess = String(accessLevel).trim().toLowerCase();

    // =========================================================================
    // INITIALS
    // =========================================================================

    const initials =
        String(name)
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part.charAt(0))
            .join("")
            .toUpperCase() || "FM";

    // =========================================================================
    // ROLE
    // =========================================================================

    const isOwner = normalizedRole === "owner";

    const isAdmin =
        normalizedRole === "admin" || normalizedRole === "administrator";

    const roleLabel = isOwner ? "Owner" : isAdmin ? "Admin" : role;

    // =========================================================================
    // PERMISSIONS
    // =========================================================================

    const permissions = member?.permissions || {};

    const canAccess = (key) => {
        const value = permissions?.[key];

        return (
            value === true ||
            value === "View" ||
            value === "Edit" ||
            value === "view" ||
            value === "edit"
        );
    };

    const canEdit = (key) => {
        const value = permissions?.[key];

        return value === "Edit" || value === "edit";
    };

    // =========================================================================
    // NOTIFICATIONS
    // =========================================================================

    const notifications = member?.notifications || {};

    const renewalNotifications =
        notifications?.renewal ?? notifications?.renewals ?? false;

    const activityNotifications = notifications?.activity ?? false;

    // =========================================================================
    // RESOURCE CONFIGURATION
    // =========================================================================

    const resources = [
        {
            key: "assets",
            label: "Assets",
            icon: Package,
        },
        {
            key: "subscriptions",
            label: "Subscriptions",
            icon: CreditCard,
        },
        {
            key: "documents",
            label: "Documents",
            icon: FileText,
        },
        {
            key: "warranties",
            label: "Warranties",
            icon: Shield,
        },
    ];

    const activeResources = resources.filter((resource) =>
        canAccess(resource.key),
    );

    // =========================================================================
    // STATUS HELPERS
    // =========================================================================

    const isPending =
        normalizedStatus === "pending" ||
        normalizedStatus === "invited" ||
        normalizedStatus === "invitation_sent";

    const isInactive =
        normalizedStatus === "inactive" || normalizedStatus === "disabled";

    const statusLabel = isPending
        ? "Pending"
        : isInactive
            ? "Inactive"
            : "Active";

    // =========================================================================
    // REMOVE
    // =========================================================================

    const handleRemove = (event) => {
        // Critical:
        // Prevent the click from bubbling to the
        // FamilyMembers card navigation wrapper.

        event?.stopPropagation();

        if (removing || !onRemove || isOwner) {
            return;
        }

        onRemove(member);
    };

    // =========================================================================
    // RENDER
    // =========================================================================

    return (
        <article
            className="
                group
                relative
                overflow-hidden
                rounded-2xl
                border
                border-gray-200
                bg-white
                shadow-sm
                transition-all
                duration-200
                hover:-translate-y-[1px]
                hover:border-gray-300
                hover:shadow-[0_10px_35px_rgba(0,0,0,0.07)]
                dark:border-gray-800
                dark:bg-gray-900
                dark:hover:border-gray-700
                dark:hover:shadow-black/20
            "
        >
            {/* =================================================================
                SUBTLE TOP ACCENT
            ================================================================= */}

            <div
                aria-hidden="true"
                className="
                    absolute
                    inset-x-0
                    top-0
                    h-px
                    bg-gradient-to-r
                    from-transparent
                    via-gray-300
                    to-transparent
                    opacity-0
                    transition-opacity
                    duration-200
                    group-hover:opacity-100
                    dark:via-gray-600
                "
            />

            {/* =================================================================
                CONTENT
            ================================================================= */}

            <div className="p-4 sm:p-5">
                {/* =============================================================
                    HEADER
                ============================================================= */}

                <div className="flex items-start justify-between gap-3">
                    {/* =========================================================
                        IDENTITY
                    ========================================================= */}

                    <div className="flex min-w-0 items-center gap-3.5">
                        {/* =====================================================
                            AVATAR
                        ===================================================== */}

                        <div className="relative shrink-0">
                            {avatar ? (
                                <img
                                    src={avatar}
                                    alt={name}
                                    className="
                                        h-12
                                        w-12
                                        rounded-xl
                                        object-cover
                                        ring-1
                                        ring-black/5
                                        dark:ring-white/10
                                    "
                                />
                            ) : (
                                <div
                                    aria-hidden="true"
                                    className="
                                        flex
                                        h-12
                                        w-12
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-gray-900
                                        text-sm
                                        font-bold
                                        tracking-tight
                                        text-white
                                        dark:bg-white
                                        dark:text-gray-900
                                    "
                                >
                                    {initials}
                                </div>
                            )}

                            {/* =================================================
                                STATUS INDICATOR
                            ================================================= */}

                            <span
                                aria-label={statusLabel}
                                title={statusLabel}
                                className={`
                                    absolute
                                    -bottom-1
                                    -right-1
                                    h-3.5
                                    w-3.5
                                    rounded-full
                                    border-[3px]
                                    border-white
                                    dark:border-gray-900
                                    ${isPending
                                        ? "bg-amber-400"
                                        : isInactive
                                            ? "bg-gray-400"
                                            : "bg-emerald-500"
                                    }
                                `}
                            />
                        </div>

                        {/* =====================================================
                            NAME + EMAIL
                        ===================================================== */}

                        <div className="min-w-0">
                            <div className="flex min-w-0 flex-wrap items-center gap-2">
                                <h3
                                    title={name}
                                    className="
                                        max-w-[190px]
                                        truncate
                                        text-sm
                                        font-semibold
                                        tracking-tight
                                        text-gray-900
                                        dark:text-white
                                    "
                                >
                                    {name}
                                </h3>

                                {isOwner && (
                                    <span
                                        className="
                                            inline-flex
                                            items-center
                                            gap-1
                                            rounded-full
                                            bg-gray-100
                                            px-2
                                            py-0.5
                                            text-[10px]
                                            font-semibold
                                            text-gray-600
                                            dark:bg-gray-800
                                            dark:text-gray-300
                                        "
                                    >
                                        <ShieldCheck size={10} />
                                        Owner
                                    </span>
                                )}
                            </div>

                            <p
                                title={email}
                                className="
                                    mt-0.5
                                    max-w-[210px]
                                    truncate
                                    text-xs
                                    text-gray-500
                                    dark:text-gray-400
                                "
                            >
                                {email || "No email available"}
                            </p>
                        </div>
                    </div>

                    {/* =========================================================
                        REMOVE
                    ========================================================= */}

                    {!isOwner && (
                        <button
                            type="button"
                            onClick={handleRemove}
                            disabled={removing}
                            aria-label={`Remove ${name}`}
                            title={`Remove ${name}`}
                            className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                text-gray-400
                                opacity-0
                                transition-all
                                duration-200
                                hover:bg-red-50
                                hover:text-red-600
                                focus:opacity-100
                                focus:outline-none
                                focus:ring-2
                                focus:ring-red-500/20
                                group-hover:opacity-100
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                                dark:text-gray-500
                                dark:hover:bg-red-950/30
                                dark:hover:text-red-400
                            "
                        >
                            {removing ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Trash2 size={16} />
                            )}
                        </button>
                    )}
                </div>

                {/* =============================================================
                    MEMBER META
                ============================================================= */}

                <div className="mt-4 flex flex-wrap items-center gap-2">
                    {/* =========================================================
                        ROLE
                    ========================================================= */}

                    <span
                        className="
                            inline-flex
                            items-center
                            rounded-full
                            border
                            border-gray-200
                            bg-gray-50
                            px-2.5
                            py-1
                            text-[11px]
                            font-medium
                            text-gray-600
                            dark:border-gray-700
                            dark:bg-gray-800
                            dark:text-gray-300
                        "
                    >
                        {roleLabel}
                    </span>

                    {/* =========================================================
                        ACCESS
                    ========================================================= */}

                    <span
                        className={`
                            inline-flex
                            items-center
                            gap-1
                            rounded-full
                            px-2.5
                            py-1
                            text-[11px]
                            font-medium
                            ${normalizedAccess.includes("edit")
                                ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                                : "border border-gray-200 bg-white text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                            }
                        `}
                    >
                        {normalizedAccess.includes("edit") ? (
                            <Check size={11} />
                        ) : (
                            <ShieldCheck size={11} />
                        )}

                        {accessLevel}
                    </span>

                    {/* =========================================================
                        RELATIONSHIP
                    ========================================================= */}

                    {relationship && (
                        <span
                            className="
                                inline-flex
                                items-center
                                rounded-full
                                bg-gray-50
                                px-2.5
                                py-1
                                text-[11px]
                                font-medium
                                text-gray-500
                                dark:bg-gray-800
                                dark:text-gray-400
                            "
                        >
                            {relationship}
                        </span>
                    )}
                </div>

                {/* =============================================================
                    RESOURCE ACCESS
                ============================================================= */}

                <div
                    className="
                        mt-5
                        border-t
                        border-gray-100
                        pt-4
                        dark:border-gray-800
                    "
                >
                    <div className="flex items-center justify-between">
                        <p
                            className="
                                text-[11px]
                                font-semibold
                                uppercase
                                tracking-[0.08em]
                                text-gray-400
                                dark:text-gray-500
                            "
                        >
                            Resource access
                        </p>

                        <span
                            className="
                                text-[11px]
                                font-medium
                                text-gray-400
                                dark:text-gray-500
                            "
                        >
                            {activeResources.length}/{resources.length}
                        </span>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                        {resources.map(({ key, label, icon: Icon }) => {
                            const enabled = canAccess(key);

                            const editable = canEdit(key);

                            return (
                                <div
                                    key={key}
                                    className={`
                                            flex
                                            min-w-0
                                            items-center
                                            justify-between
                                            rounded-xl
                                            border
                                            px-2.5
                                            py-2
                                            transition-colors
                                            ${enabled
                                            ? "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/60"
                                            : "border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900"
                                        }
                                        `}
                                >
                                    <div className="flex min-w-0 items-center gap-2">
                                        <div
                                            className={`
                                                    flex
                                                    h-7
                                                    w-7
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-lg
                                                    ${enabled
                                                    ? "bg-white text-gray-700 shadow-sm dark:bg-gray-900 dark:text-gray-300"
                                                    : "bg-gray-50 text-gray-300 dark:bg-gray-800 dark:text-gray-600"
                                                }
                                                `}
                                        >
                                            <Icon size={13} />
                                        </div>

                                        <span
                                            className={`
                                                    truncate
                                                    text-[11px]
                                                    font-medium
                                                    ${enabled
                                                    ? "text-gray-700 dark:text-gray-300"
                                                    : "text-gray-400 dark:text-gray-600"
                                                }
                                                `}
                                        >
                                            {label}
                                        </span>
                                    </div>

                                    {enabled ? (
                                        editable ? (
                                            <span
                                                title="Edit access"
                                                className="
                                                        shrink-0
                                                        rounded-full
                                                        bg-gray-900
                                                        px-1.5
                                                        py-0.5
                                                        text-[9px]
                                                        font-semibold
                                                        uppercase
                                                        tracking-wide
                                                        text-white
                                                        dark:bg-white
                                                        dark:text-gray-900
                                                    "
                                            >
                                                Edit
                                            </span>
                                        ) : (
                                            <Check
                                                size={13}
                                                className="
                                                        shrink-0
                                                        text-emerald-500
                                                    "
                                            />
                                        )
                                    ) : (
                                        <X
                                            size={13}
                                            className="
                                                    shrink-0
                                                    text-gray-300
                                                    dark:text-gray-600
                                                "
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* =============================================================
                    NOTIFICATIONS
                ============================================================= */}

                <div
                    className="
                        mt-4
                        flex
                        items-center
                        justify-between
                        rounded-xl
                        bg-gray-50
                        px-3
                        py-2.5
                        dark:bg-gray-800/50
                    "
                >
                    <div className="flex min-w-0 items-center gap-2">
                        <div
                            className="
                                flex
                                h-7
                                w-7
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                bg-white
                                text-gray-500
                                shadow-sm
                                dark:bg-gray-900
                                dark:text-gray-400
                            "
                        >
                            <Bell size={13} />
                        </div>

                        <div className="min-w-0">
                            <p
                                className="
                                    text-[11px]
                                    font-medium
                                    text-gray-700
                                    dark:text-gray-300
                                "
                            >
                                Notifications
                            </p>

                            <p
                                className="
                                    text-[10px]
                                    text-gray-400
                                    dark:text-gray-500
                                "
                            >
                                Renewal & activity alerts
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <span
                            title={
                                renewalNotifications
                                    ? "Renewal notifications enabled"
                                    : "Renewal notifications disabled"
                            }
                            className={`
                                h-2
                                w-2
                                rounded-full
                                ${renewalNotifications
                                    ? "bg-emerald-500"
                                    : "bg-gray-300 dark:bg-gray-600"
                                }
                            `}
                        />

                        <span
                            title={
                                activityNotifications
                                    ? "Activity notifications enabled"
                                    : "Activity notifications disabled"
                            }
                            className={`
                                h-2
                                w-2
                                rounded-full
                                ${activityNotifications
                                    ? "bg-blue-500"
                                    : "bg-gray-300 dark:bg-gray-600"
                                }
                            `}
                        />
                    </div>
                </div>

                {/* =============================================================
                    LAST ACTIVE
                ============================================================= */}

                {member?.lastActiveAt && (
                    <div
                        className="
                            mt-3
                            flex
                            items-center
                            gap-1.5
                            text-[10px]
                            text-gray-400
                            dark:text-gray-500
                        "
                    >
                        <Activity size={11} />
                        Last active{" "}
                        {new Date(member.lastActiveAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                        })}
                    </div>
                )}
            </div>
        </article>
    );
};

export default FamilyMemberCard;
