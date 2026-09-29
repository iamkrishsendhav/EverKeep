import { useEffect, useMemo, useState } from "react";

import {
    X,
    UserPlus,
    Mail,
    UserRound,
    ShieldCheck,
    ChevronDown,
    Check,
    Package,
    CreditCard,
    FileText,
    Shield,
    Bell,
    Info,
    Loader2,
} from "lucide-react";

// ============================================================================
// DEFAULT FORM
// ============================================================================

const DEFAULT_FORM = {
    name: "",
    email: "",
    relationship: "",
    access: "View",

    permissions: {
        assets: true,
        subscriptions: true,
        documents: true,
        warranties: true,
    },

    notifications: {
        renewal: true,
        activity: false,
    },
};

// ============================================================================
// RESOURCE CONFIG
// ============================================================================

const RESOURCE_OPTIONS = [
    {
        key: "assets",
        label: "Assets",
        description: "Shared personal assets",
        icon: Package,
    },

    {
        key: "subscriptions",
        label: "Subscriptions",
        description: "Subscription information",
        icon: CreditCard,
    },

    {
        key: "documents",
        label: "Documents",
        description: "Important documents",
        icon: FileText,
    },

    {
        key: "warranties",
        label: "Warranties",
        description: "Warranty information",
        icon: Shield,
    },
];

// ============================================================================
// ACCESS OPTIONS
// ============================================================================

const ACCESS_OPTIONS = [
    {
        value: "View",
        label: "View only",
        description: "Can view shared information but cannot modify it.",
    },

    {
        value: "Edit",
        label: "Can edit",
        description: "Can view and modify shared information.",
    },
];

// ============================================================================
// RELATIONSHIP OPTIONS
// ============================================================================

const RELATIONSHIP_OPTIONS = [
    "Parent",
    "Spouse",
    "Sibling",
    "Child",
    "Partner",
    "Relative",
    "Friend",
    "Other",
];

// ============================================================================
// COMPONENT
// ============================================================================

const AddMemberModal = ({
    isOpen = true,
    onClose,
    onSubmit,
    loading = false,
}) => {
    // =========================================================================
    // STATE
    // =========================================================================

    const [form, setForm] = useState(DEFAULT_FORM);

    const [errors, setErrors] = useState({});

    const [submitError, setSubmitError] = useState("");

    // =========================================================================
    // RESET
    // =========================================================================

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        setForm(DEFAULT_FORM);

        setErrors({});

        setSubmitError("");
    }, [isOpen]);

    // =========================================================================
    // ESCAPE KEY
    // =========================================================================

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handleKeyDown = (event) => {
            if (event.key === "Escape" && !loading) {
                onClose?.();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, loading, onClose]);

    // =========================================================================
    // BODY SCROLL LOCK
    // =========================================================================

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const previousOverflow = document.body.style.overflow;

        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isOpen]);

    // =========================================================================
    // FIELD UPDATE
    // =========================================================================

    const updateField = (field, value) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));

        setErrors((current) => ({
            ...current,
            [field]: "",
        }));

        setSubmitError("");
    };

    // =========================================================================
    // PERMISSION UPDATE
    // =========================================================================

    const updatePermission = (key, value) => {
        setForm((current) => ({
            ...current,

            permissions: {
                ...current.permissions,
                [key]: value,
            },
        }));

        setSubmitError("");
    };

    // =========================================================================
    // NOTIFICATION UPDATE
    // =========================================================================

    const updateNotification = (key, value) => {
        setForm((current) => ({
            ...current,

            notifications: {
                ...current.notifications,
                [key]: value,
            },
        }));

        setSubmitError("");
    };

    // =========================================================================
    // SELECT ALL PERMISSIONS
    // =========================================================================

    const allPermissionsEnabled = useMemo(
        () => RESOURCE_OPTIONS.every(({ key }) => form.permissions[key]),
        [form.permissions],
    );

    const toggleAllPermissions = () => {
        const nextValue = !allPermissionsEnabled;

        const permissions = {};

        RESOURCE_OPTIONS.forEach(({ key }) => {
            permissions[key] = nextValue;
        });

        setForm((current) => ({
            ...current,
            permissions,
        }));

        setSubmitError("");
    };

    // =========================================================================
    // VALIDATION
    // =========================================================================

    const validate = () => {
        const nextErrors = {};

        const trimmedName = form.name.trim();

        const trimmedEmail = form.email.trim();

        if (!trimmedName) {
            nextErrors.name = "Member name is required.";
        } else if (trimmedName.length < 2) {
            nextErrors.name = "Name must contain at least 2 characters.";
        }

        if (!trimmedEmail) {
            nextErrors.email = "Email address is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            nextErrors.email = "Enter a valid email address.";
        }

        setErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    };

    // =========================================================================
    // SUBMIT
    // =========================================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (loading) {
            return;
        }

        setSubmitError("");

        if (!validate()) {
            return;
        }

        try {
            await onSubmit?.({
                name: form.name.trim(),

                email: form.email.trim().toLowerCase(),

                relationship: form.relationship,

                access: form.access,

                permissions: form.permissions,

                notifications: form.notifications,
            });
        } catch (error) {
            console.error("Add member form error:", error);

            setSubmitError(error?.message || "Unable to send invitation.");
        }
    };

    // =========================================================================
    // CLOSE
    // =========================================================================

    const handleClose = () => {
        if (loading) {
            return;
        }

        onClose?.();
    };

    // =========================================================================
    // NOT OPEN
    // =========================================================================

    if (!isOpen) {
        return null;
    }

    // =========================================================================
    // RENDER
    // =========================================================================

    return (
        <div
            className="
                fixed
                inset-0
                z-[100]
                flex
                items-end
                justify-center
                sm:items-center
            "
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-family-member-title"
        >
            {/* ================================================================= */}
            {/* BACKDROP */}
            {/* ================================================================= */}

            <button
                type="button"
                aria-label="Close modal"
                onClick={handleClose}
                disabled={loading}
                className="
                    absolute
                    inset-0
                    cursor-default
                    bg-gray-950/45
                    backdrop-blur-[3px]
                    transition-opacity
                    disabled:cursor-default
                "
            />

            {/* ================================================================= */}
            {/* MODAL */}
            {/* ================================================================= */}

            <div
                className="
                    relative
                    flex
                    max-h-[94vh]
                    w-full
                    flex-col
                    overflow-hidden
                    rounded-t-3xl
                    border
                    border-gray-200
                    bg-white
                    shadow-[0_24px_80px_rgba(0,0,0,0.18)]
                    sm:max-w-2xl
                    sm:rounded-3xl
                    dark:border-gray-800
                    dark:bg-gray-950
                    dark:shadow-black/40
                "
            >
                {/* ============================================================= */}
                {/* HEADER */}
                {/* ============================================================= */}

                <div
                    className="
                        flex
                        shrink-0
                        items-start
                        justify-between
                        gap-4
                        border-b
                        border-gray-100
                        px-5
                        py-4
                        sm:px-6
                        sm:py-5
                        dark:border-gray-800
                    "
                >
                    <div className="flex min-w-0 items-center gap-3.5">
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
                            <UserPlus size={19} />
                        </div>

                        <div className="min-w-0">
                            <h2
                                id="add-family-member-title"
                                className="
                                    text-base
                                    font-semibold
                                    tracking-tight
                                    text-gray-950
                                    sm:text-lg
                                    dark:text-white
                                "
                            >
                                Add family member
                            </h2>

                            <p
                                className="
                                    mt-0.5
                                    text-xs
                                    leading-5
                                    text-gray-500
                                    sm:text-sm
                                    dark:text-gray-400
                                "
                            >
                                Invite someone to your EverKeep workspace.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={loading}
                        aria-label="Close"
                        className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            text-gray-400
                            transition
                            hover:bg-gray-100
                            hover:text-gray-700
                            focus:outline-none
                            focus:ring-2
                            focus:ring-gray-900/10
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                            dark:text-gray-500
                            dark:hover:bg-gray-800
                            dark:hover:text-gray-200
                        "
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* ============================================================= */}
                {/* FORM */}
                {/* ============================================================= */}

                <form
                    onSubmit={handleSubmit}
                    className="
                        min-h-0
                        overflow-y-auto
                    "
                >
                    <div className="space-y-7 px-5 py-5 sm:px-6 sm:py-6">
                        {/* ===================================================== */}
                        {/* ERROR */}
                        {/* ===================================================== */}

                        {submitError && (
                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-red-200
                                    bg-red-50
                                    px-3.5
                                    py-3
                                    text-sm
                                    text-red-700
                                    dark:border-red-900/50
                                    dark:bg-red-950/30
                                    dark:text-red-300
                                "
                            >
                                {submitError}
                            </div>
                        )}

                        {/* ===================================================== */}
                        {/* BASIC INFORMATION */}
                        {/* ===================================================== */}

                        <section>
                            <div className="mb-4">
                                <p
                                    className="
                                        text-[11px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.1em]
                                        text-gray-400
                                        dark:text-gray-500
                                    "
                                >
                                    Member information
                                </p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                {/* NAME */}

                                <div>
                                    <label
                                        htmlFor="family-member-name"
                                        className="
                                            mb-1.5
                                            block
                                            text-xs
                                            font-medium
                                            text-gray-700
                                            dark:text-gray-300
                                        "
                                    >
                                        Full name
                                    </label>

                                    <div className="relative">
                                        <UserRound
                                            size={16}
                                            className="
                                                pointer-events-none
                                                absolute
                                                left-3
                                                top-1/2
                                                -translate-y-1/2
                                                text-gray-400
                                            "
                                        />

                                        <input
                                            id="family-member-name"
                                            type="text"
                                            value={form.name}
                                            onChange={(event) =>
                                                updateField("name", event.target.value)
                                            }
                                            placeholder="e.g. Rahul Sharma"
                                            autoComplete="name"
                                            disabled={loading}
                                            className={`
                                                h-11
                                                w-full
                                                rounded-xl
                                                border
                                                bg-white
                                                pl-10
                                                pr-3
                                                text-sm
                                                text-gray-900
                                                outline-none
                                                transition
                                                placeholder:text-gray-400
                                                focus:ring-2
                                                disabled:cursor-not-allowed
                                                disabled:bg-gray-50
                                                dark:bg-gray-900
                                                dark:text-white
                                                dark:disabled:bg-gray-900/50
                                                ${errors.name
                                                    ? "border-red-300 focus:border-red-400 focus:ring-red-500/10 dark:border-red-800"
                                                    : "border-gray-200 focus:border-gray-400 focus:ring-gray-900/10 dark:border-gray-700 dark:focus:border-gray-500"
                                                }
                                            `}
                                        />
                                    </div>

                                    {errors.name && (
                                        <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* EMAIL */}

                                <div>
                                    <label
                                        htmlFor="family-member-email"
                                        className="
                                            mb-1.5
                                            block
                                            text-xs
                                            font-medium
                                            text-gray-700
                                            dark:text-gray-300
                                        "
                                    >
                                        Email address
                                    </label>

                                    <div className="relative">
                                        <Mail
                                            size={16}
                                            className="
                                                pointer-events-none
                                                absolute
                                                left-3
                                                top-1/2
                                                -translate-y-1/2
                                                text-gray-400
                                            "
                                        />

                                        <input
                                            id="family-member-email"
                                            type="email"
                                            value={form.email}
                                            onChange={(event) =>
                                                updateField("email", event.target.value)
                                            }
                                            placeholder="name@example.com"
                                            autoComplete="email"
                                            disabled={loading}
                                            className={`
                                                h-11
                                                w-full
                                                rounded-xl
                                                border
                                                bg-white
                                                pl-10
                                                pr-3
                                                text-sm
                                                text-gray-900
                                                outline-none
                                                transition
                                                placeholder:text-gray-400
                                                focus:ring-2
                                                disabled:cursor-not-allowed
                                                disabled:bg-gray-50
                                                dark:bg-gray-900
                                                dark:text-white
                                                dark:disabled:bg-gray-900/50
                                                ${errors.email
                                                    ? "border-red-300 focus:border-red-400 focus:ring-red-500/10 dark:border-red-800"
                                                    : "border-gray-200 focus:border-gray-400 focus:ring-gray-900/10 dark:border-gray-700 dark:focus:border-gray-500"
                                                }
                                            `}
                                        />
                                    </div>

                                    {errors.email && (
                                        <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                {/* RELATIONSHIP */}

                                <div className="sm:col-span-2">
                                    <label
                                        htmlFor="family-member-relationship"
                                        className="
                                            mb-1.5
                                            block
                                            text-xs
                                            font-medium
                                            text-gray-700
                                            dark:text-gray-300
                                        "
                                    >
                                        Relationship
                                        <span className="ml-1 font-normal text-gray-400">
                                            optional
                                        </span>
                                    </label>

                                    <div className="relative">
                                        <select
                                            id="family-member-relationship"
                                            value={form.relationship}
                                            onChange={(event) =>
                                                updateField("relationship", event.target.value)
                                            }
                                            disabled={loading}
                                            className="
                                                h-11
                                                w-full
                                                appearance-none
                                                rounded-xl
                                                border
                                                border-gray-200
                                                bg-white
                                                px-3
                                                pr-10
                                                text-sm
                                                text-gray-900
                                                outline-none
                                                transition
                                                focus:border-gray-400
                                                focus:ring-2
                                                focus:ring-gray-900/10
                                                disabled:cursor-not-allowed
                                                disabled:bg-gray-50
                                                dark:border-gray-700
                                                dark:bg-gray-900
                                                dark:text-white
                                                dark:disabled:bg-gray-900/50
                                            "
                                        >
                                            <option value="">Select relationship</option>

                                            {RELATIONSHIP_OPTIONS.map((relationship) => (
                                                <option key={relationship} value={relationship}>
                                                    {relationship}
                                                </option>
                                            ))}
                                        </select>

                                        <ChevronDown
                                            size={16}
                                            className="
                                                pointer-events-none
                                                absolute
                                                right-3
                                                top-1/2
                                                -translate-y-1/2
                                                text-gray-400
                                            "
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ===================================================== */}
                        {/* ACCESS */}
                        {/* ===================================================== */}

                        <section>
                            <div className="mb-4">
                                <p
                                    className="
                                        text-[11px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.1em]
                                        text-gray-400
                                        dark:text-gray-500
                                    "
                                >
                                    Access level
                                </p>

                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Choose what this member can do with shared information.
                                </p>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                {ACCESS_OPTIONS.map((option) => {
                                    const selected = form.access === option.value;

                                    return (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => updateField("access", option.value)}
                                            disabled={loading}
                                            className={`
                                                    relative
                                                    rounded-2xl
                                                    border
                                                    p-4
                                                    text-left
                                                    transition-all
                                                    duration-200
                                                    disabled:cursor-not-allowed
                                                    ${selected
                                                    ? "border-gray-900 bg-gray-50 shadow-sm dark:border-white dark:bg-gray-800"
                                                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600 dark:hover:bg-gray-800"
                                                }
                                                `}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`
                                                                flex
                                                                h-9
                                                                w-9
                                                                items-center
                                                                justify-center
                                                                rounded-lg
                                                                ${selected
                                                                ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                                                                : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                                                            }
                                                            `}
                                                    >
                                                        <ShieldCheck size={16} />
                                                    </div>

                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                            {option.label}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div
                                                    className={`
                                                            flex
                                                            h-5
                                                            w-5
                                                            items-center
                                                            justify-center
                                                            rounded-full
                                                            border
                                                            ${selected
                                                            ? "border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-gray-900"
                                                            : "border-gray-300 dark:border-gray-600"
                                                        }
                                                        `}
                                                >
                                                    {selected && <Check size={12} />}
                                                </div>
                                            </div>

                                            <p className="mt-3 text-xs leading-5 text-gray-500 dark:text-gray-400">
                                                {option.description}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>

                        {/* ===================================================== */}
                        {/* RESOURCE PERMISSIONS */}
                        {/* ===================================================== */}

                        <section>
                            <div className="mb-4 flex items-end justify-between gap-3">
                                <div>
                                    <p
                                        className="
                                            text-[11px]
                                            font-semibold
                                            uppercase
                                            tracking-[0.1em]
                                            text-gray-400
                                            dark:text-gray-500
                                        "
                                    >
                                        Resource access
                                    </p>

                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        Select which areas this member can access.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={toggleAllPermissions}
                                    disabled={loading}
                                    className="
                                        shrink-0
                                        text-xs
                                        font-semibold
                                        text-gray-600
                                        underline-offset-4
                                        hover:text-gray-900
                                        hover:underline
                                        disabled:opacity-50
                                        dark:text-gray-400
                                        dark:hover:text-white
                                    "
                                >
                                    {allPermissionsEnabled ? "Clear all" : "Select all"}
                                </button>
                            </div>

                            <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700">
                                {RESOURCE_OPTIONS.map((resource, index) => {
                                    const Icon = resource.icon;

                                    const enabled = form.permissions[resource.key];

                                    return (
                                        <button
                                            key={resource.key}
                                            type="button"
                                            onClick={() => updatePermission(resource.key, !enabled)}
                                            disabled={loading}
                                            className={`
                                                    flex
                                                    w-full
                                                    items-center
                                                    justify-between
                                                    gap-4
                                                    px-4
                                                    py-3.5
                                                    text-left
                                                    transition
                                                    hover:bg-gray-50
                                                    disabled:cursor-not-allowed
                                                    dark:hover:bg-gray-800/60
                                                    ${index <
                                                    RESOURCE_OPTIONS.length -
                                                    1
                                                    ? "border-b border-gray-100 dark:border-gray-800"
                                                    : ""
                                                }
                                                `}
                                        >
                                            <div className="flex min-w-0 items-center gap-3">
                                                <div
                                                    className={`
                                                            flex
                                                            h-9
                                                            w-9
                                                            shrink-0
                                                            items-center
                                                            justify-center
                                                            rounded-lg
                                                            ${enabled
                                                            ? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                                            : "bg-gray-50 text-gray-400 dark:bg-gray-900 dark:text-gray-600"
                                                        }
                                                        `}
                                                >
                                                    <Icon size={16} />
                                                </div>

                                                <div className="min-w-0">
                                                    <p
                                                        className={`
                                                            text-sm
                                                            font-medium
                                                            ${enabled
                                                                ? "text-gray-800 dark:text-gray-200"
                                                                : "text-gray-400 dark:text-gray-500"
                                                            }
                                                        `}
                                                    >
                                                        {resource.label}
                                                    </p>

                                                    <p
                                                        className="
                                                            mt-0.5
                                                            truncate
                                                            text-xs
                                                            text-gray-400
                                                            dark:text-gray-500
                                                        "
                                                    >
                                                        {resource.description}
                                                    </p>
                                                </div>
                                            </div>

                                            <span
                                                className={`
                                                        relative
                                                        h-6
                                                        w-10
                                                        shrink-0
                                                        rounded-full
                                                        transition-colors
                                                        ${enabled
                                                        ? "bg-gray-900 dark:bg-white"
                                                        : "bg-gray-200 dark:bg-gray-700"
                                                    }
                                                    `}
                                            >
                                                <span
                                                    className={`
                                                            absolute
                                                            top-1
                                                            h-4
                                                            w-4
                                                            rounded-full
                                                            bg-white
                                                            shadow-sm
                                                            transition-transform
                                                            ${enabled
                                                            ? "translate-x-5"
                                                            : "translate-x-1"
                                                        }
                                                            dark:bg-gray-900
                                                        `}
                                                />
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>

                        {/* ===================================================== */}
                        {/* NOTIFICATIONS */}
                        {/* ===================================================== */}

                        <section>
                            <div className="mb-4">
                                <p
                                    className="
                                        text-[11px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.1em]
                                        text-gray-400
                                        dark:text-gray-500
                                    "
                                >
                                    Notifications
                                </p>

                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Decide which family updates they should receive.
                                </p>
                            </div>

                            <div className="space-y-2">
                                {/* Renewal */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        updateNotification("renewal", !form.notifications.renewal)
                                    }
                                    disabled={loading}
                                    className="
                                        flex
                                        w-full
                                        items-center
                                        justify-between
                                        gap-4
                                        rounded-2xl
                                        border
                                        border-gray-200
                                        px-4
                                        py-3.5
                                        text-left
                                        transition
                                        hover:bg-gray-50
                                        disabled:cursor-not-allowed
                                        dark:border-gray-700
                                        dark:hover:bg-gray-800/60
                                    "
                                >
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div
                                            className="
                                            flex
                                            h-9
                                            w-9
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-lg
                                            bg-gray-100
                                            text-gray-500
                                            dark:bg-gray-800
                                            dark:text-gray-400
                                        "
                                        >
                                            <Bell size={16} />
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                                Renewal reminders
                                            </p>

                                            <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                                                Notify about upcoming renewals.
                                            </p>
                                        </div>
                                    </div>

                                    <span
                                        className={`
                                            relative
                                            h-6
                                            w-10
                                            shrink-0
                                            rounded-full
                                            transition-colors
                                            ${form.notifications.renewal
                                                ? "bg-gray-900 dark:bg-white"
                                                : "bg-gray-200 dark:bg-gray-700"
                                            }
                                        `}
                                    >
                                        <span
                                            className={`
                                                absolute
                                                top-1
                                                h-4
                                                w-4
                                                rounded-full
                                                bg-white
                                                shadow-sm
                                                transition-transform
                                                ${form.notifications.renewal
                                                    ? "translate-x-5"
                                                    : "translate-x-1"
                                                }
                                                dark:bg-gray-900
                                            `}
                                        />
                                    </span>
                                </button>

                                {/* Activity */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        updateNotification("activity", !form.notifications.activity)
                                    }
                                    disabled={loading}
                                    className="
                                        flex
                                        w-full
                                        items-center
                                        justify-between
                                        gap-4
                                        rounded-2xl
                                        border
                                        border-gray-200
                                        px-4
                                        py-3.5
                                        text-left
                                        transition
                                        hover:bg-gray-50
                                        disabled:cursor-not-allowed
                                        dark:border-gray-700
                                        dark:hover:bg-gray-800/60
                                    "
                                >
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div
                                            className="
                                            flex
                                            h-9
                                            w-9
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-lg
                                            bg-gray-100
                                            text-gray-500
                                            dark:bg-gray-800
                                            dark:text-gray-400
                                        "
                                        >
                                            <Info size={16} />
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                                Activity updates
                                            </p>

                                            <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                                                Notify about important family activity.
                                            </p>
                                        </div>
                                    </div>

                                    <span
                                        className={`
                                            relative
                                            h-6
                                            w-10
                                            shrink-0
                                            rounded-full
                                            transition-colors
                                            ${form.notifications.activity
                                                ? "bg-gray-900 dark:bg-white"
                                                : "bg-gray-200 dark:bg-gray-700"
                                            }
                                        `}
                                    >
                                        <span
                                            className={`
                                                absolute
                                                top-1
                                                h-4
                                                w-4
                                                rounded-full
                                                bg-white
                                                shadow-sm
                                                transition-transform
                                                ${form.notifications.activity
                                                    ? "translate-x-5"
                                                    : "translate-x-1"
                                                }
                                                dark:bg-gray-900
                                            `}
                                        />
                                    </span>
                                </button>
                            </div>
                        </section>

                        {/* ===================================================== */}
                        {/* INFO */}
                        {/* ===================================================== */}

                        <div
                            className="
                            flex
                            items-start
                            gap-3
                            rounded-2xl
                            border
                            border-gray-200
                            bg-gray-50
                            px-4
                            py-3.5
                            dark:border-gray-800
                            dark:bg-gray-900
                        "
                        >
                            <Info
                                size={16}
                                className="
                                    mt-0.5
                                    shrink-0
                                    text-gray-400
                                "
                            />

                            <p
                                className="
                                text-xs
                                leading-5
                                text-gray-500
                                dark:text-gray-400
                            "
                            >
                                The member will receive an invitation at the email address
                                provided. You can change their access permissions later from the
                                Family workspace.
                            </p>
                        </div>
                    </div>

                    {/* ========================================================= */}
                    {/* FOOTER */}
                    {/* ========================================================= */}

                    <div
                        className="
                        flex
                        shrink-0
                        flex-col-reverse
                        gap-2
                        border-t
                        border-gray-100
                        bg-white
                        px-5
                        py-4
                        sm:flex-row
                        sm:items-center
                        sm:justify-end
                        sm:px-6
                        dark:border-gray-800
                        dark:bg-gray-950
                    "
                    >
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={loading}
                            className="
                                h-11
                                rounded-xl
                                border
                                border-gray-200
                                px-4
                                text-sm
                                font-medium
                                text-gray-700
                                transition
                                hover:bg-gray-50
                                focus:outline-none
                                focus:ring-2
                                focus:ring-gray-900/10
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                                dark:border-gray-700
                                dark:text-gray-300
                                dark:hover:bg-gray-800
                            "
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                inline-flex
                                h-11
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-gray-900
                                px-5
                                text-sm
                                font-semibold
                                text-white
                                shadow-sm
                                transition-all
                                hover:bg-gray-800
                                hover:shadow-md
                                focus:outline-none
                                focus:ring-2
                                focus:ring-gray-900/20
                                active:scale-[0.98]
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                                dark:bg-white
                                dark:text-gray-900
                                dark:hover:bg-gray-100
                            "
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Sending invitation...
                                </>
                            ) : (
                                <>
                                    <UserPlus size={16} />
                                    Send invitation
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMemberModal;
