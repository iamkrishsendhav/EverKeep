import { useCallback, useEffect, useState } from "react";

import {
    Settings,
    Users,
    ShieldCheck,
    Bell,
    Save,
    Loader2,
    AlertCircle,
    CheckCircle2,
    Trash2,
    Lock,
    Mail,
    UserRound,
    Package,
    CreditCard,
    FileText,
    Shield,
    ChevronRight,
} from "lucide-react";

import {
    getFamily,
    updateFamily,
    updateFamilySettings,
    FamilyApiError,
} from "../../services/family.service";


// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_SETTINGS = {
    name: "",
    description: "",

    memberPermissions: {
        assets: true,
        subscriptions: true,
        documents: true,
        warranties: true,
    },

    notifications: {
        renewalReminders: true,
        activityUpdates: true,
        memberUpdates: true,
    },

    privacy: {
        requireApprovalForNewMembers: false,
    },
};


// ============================================================================
// RESOURCE CONFIG
// ============================================================================

const RESOURCE_SETTINGS = [
    {
        key: "assets",
        label: "Assets",
        description:
            "Allow family members to access shared assets.",
        icon: Package,
    },

    {
        key: "subscriptions",
        label: "Subscriptions",
        description:
            "Allow access to shared subscription information.",
        icon: CreditCard,
    },

    {
        key: "documents",
        label: "Documents",
        description:
            "Allow access to shared documents.",
        icon: FileText,
    },

    {
        key: "warranties",
        label: "Warranties",
        description:
            "Allow access to warranty information.",
        icon: Shield,
    },
];


// ============================================================================
// COMPONENT
// ============================================================================

const FamilySettings = () => {

    // =========================================================================
    // STATE
    // =========================================================================

    const [family, setFamily] =
        useState(null);

    const [settings, setSettings] =
        useState(DEFAULT_SETTINGS);

    const [originalSettings, setOriginalSettings] =
        useState(DEFAULT_SETTINGS);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [fieldErrors, setFieldErrors] =
        useState({});


    // =========================================================================
    // LOAD SETTINGS
    // =========================================================================

    const loadSettings = useCallback(
        async () => {

            try {

                setLoading(true);

                setError("");

                const response =
                    await getFamily();


                const familyData =
                    response?.family ||
                    response;


                if (!familyData) {

                    setError(
                        "Family workspace could not be found."
                    );

                    return;
                }


                setFamily(
                    familyData
                );


                const familySettings =
                    familyData?.settings ||
                    {};


                const normalized = {

                    name:
                        familyData?.name ||
                        "",

                    description:
                        familyData?.description ||
                        "",

                    memberPermissions: {
                        ...DEFAULT_SETTINGS.memberPermissions,
                        ...(familySettings?.memberPermissions || {}),
                    },

                    notifications: {
                        ...DEFAULT_SETTINGS.notifications,
                        ...(familySettings?.notifications || {}),
                    },

                    privacy: {
                        ...DEFAULT_SETTINGS.privacy,
                        ...(familySettings?.privacy || {}),
                    },

                };


                setSettings(
                    normalized
                );

                setOriginalSettings(
                    normalized
                );

            } catch (requestError) {

                console.error(
                    "Family settings load error:",
                    requestError
                );


                setError(
                    requestError instanceof
                        FamilyApiError
                        ? requestError.message
                        : "Unable to load family settings."
                );

            } finally {

                setLoading(false);
            }

        },
        []
    );


    // =========================================================================
    // INITIAL LOAD
    // =========================================================================

    useEffect(() => {

        loadSettings();

    }, [loadSettings]);


    // =========================================================================
    // DIRTY STATE
    // =========================================================================

    const isDirty =
        JSON.stringify(settings) !==
        JSON.stringify(originalSettings);


    // =========================================================================
    // UPDATE TOP LEVEL FIELD
    // =========================================================================

    const updateField = (
        field,
        value
    ) => {

        setSettings(
            (current) => ({
                ...current,
                [field]: value,
            })
        );

        setSuccess("");

        setFieldErrors(
            (current) => ({
                ...current,
                [field]: "",
            })
        );
    };


    // =========================================================================
    // UPDATE NESTED FIELD
    // =========================================================================

    const updateNestedField = (
        section,
        field,
        value
    ) => {

        setSettings(
            (current) => ({
                ...current,

                [section]: {
                    ...current[section],
                    [field]: value,
                },
            })
        );

        setSuccess("");
    };


    // =========================================================================
    // VALIDATE
    // =========================================================================

    const validate = () => {

        const errors = {};

        const name =
            settings.name.trim();


        if (!name) {

            errors.name =
                "Family name is required.";

        } else if (
            name.length < 2
        ) {

            errors.name =
                "Family name must contain at least 2 characters.";

        } else if (
            name.length > 100
        ) {

            errors.name =
                "Family name cannot exceed 100 characters.";

        }


        setFieldErrors(
            errors
        );


        return (
            Object.keys(errors).length ===
            0
        );
    };


    // =========================================================================
    // SAVE
    // =========================================================================

    const handleSave = async (
        event
    ) => {

        event?.preventDefault();


        if (saving || !isDirty) {
            return;
        }


        if (!validate()) {
            return;
        }


        try {

            setSaving(true);

            setError("");

            setSuccess("");


            // -------------------------------------------------------------
            // UPDATE FAMILY BASIC INFORMATION
            // -------------------------------------------------------------

            const updatedFamily =
                await updateFamily({

                    name:
                        settings.name.trim(),

                    description:
                        settings.description.trim(),

                });


            // -------------------------------------------------------------
            // UPDATE FAMILY SETTINGS
            // -------------------------------------------------------------

            await updateFamilySettings({

                memberPermissions:
                    settings.memberPermissions,

                notifications:
                    settings.notifications,

                privacy:
                    settings.privacy,

            });


            const nextFamily =
                updatedFamily?.family ||
                updatedFamily ||
                family;


            setFamily(
                nextFamily
            );


            setOriginalSettings(
                settings
            );


            setSuccess(
                "Family settings saved successfully."
            );


            window.setTimeout(
                () => {
                    setSuccess("");
                },
                3500
            );

        } catch (requestError) {

            console.error(
                "Family settings save error:",
                requestError
            );


            setError(
                requestError instanceof
                    FamilyApiError
                    ? requestError.message
                    : "Unable to save family settings."
            );

        } finally {

            setSaving(false);
        }
    };


    // =========================================================================
    // DISCARD
    // =========================================================================

    const handleDiscard = () => {

        if (saving) {
            return;
        }


        setSettings(
            originalSettings
        );

        setFieldErrors({});

        setError("");

        setSuccess("");
    };


    // =========================================================================
    // LOADING
    // =========================================================================

    if (loading) {

        return (

            <div className="min-h-full bg-gray-50/50 dark:bg-gray-950">

                <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">

                    <div className="animate-pulse">

                        <div className="h-7 w-40 rounded-lg bg-gray-200 dark:bg-gray-800" />

                        <div className="mt-3 h-4 w-72 rounded bg-gray-200 dark:bg-gray-800" />


                        <div className="mt-8 grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">

                            <div className="hidden lg:block">

                                <div className="h-5 w-32 rounded bg-gray-200 dark:bg-gray-800" />

                                <div className="mt-4 space-y-3">

                                    {[1, 2, 3, 4].map(
                                        (item) => (

                                            <div
                                                key={item}
                                                className="h-9 rounded-lg bg-gray-100 dark:bg-gray-900"
                                            />

                                        )
                                    )}

                                </div>

                            </div>


                            <div className="space-y-5">

                                {[1, 2, 3].map(
                                    (item) => (

                                        <div
                                            key={item}
                                            className="h-48 rounded-2xl bg-gray-100 dark:bg-gray-900"
                                        />

                                    )
                                )}

                            </div>

                        </div>

                    </div>

                </div>

            </div>
        );
    }


    // =========================================================================
    // ERROR
    // =========================================================================

    if (error && !family) {

        return (

            <div className="min-h-full bg-gray-50/50 dark:bg-gray-950">

                <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center px-4">

                    <div className="w-full rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm dark:border-red-900/40 dark:bg-gray-900">

                        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">

                            <AlertCircle
                                size={22}
                            />

                        </div>


                        <h2 className="mt-4 text-base font-semibold text-gray-900 dark:text-white">

                            Unable to load settings

                        </h2>


                        <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">

                            {error}

                        </p>


                        <button
                            type="button"
                            onClick={loadSettings}
                            className="mt-5 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900"
                        >

                            Try again

                        </button>

                    </div>

                </div>

            </div>
        );
    }


    // =========================================================================
    // RENDER
    // =========================================================================

    return (

        <div className="min-h-full bg-gray-50/50 dark:bg-gray-950">

            <div className="mx-auto max-w-5xl px-4 py-6 pb-28 sm:px-6 sm:py-8 lg:px-8">


                {/* ================================================================= */}
                {/* PAGE HEADER */}
                {/* ================================================================= */}

                <header>

                    <div className="flex items-start gap-3">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-white shadow-sm dark:bg-white dark:text-gray-900">

                            <Settings
                                size={19}
                            />

                        </div>


                        <div>

                            <h1 className="text-xl font-semibold tracking-tight text-gray-950 sm:text-2xl dark:text-white">

                                Family settings

                            </h1>


                            <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">

                                Manage your family workspace,
                                permissions and notifications.

                            </p>

                        </div>

                    </div>

                </header>


                {/* ================================================================= */}
                {/* FEEDBACK */}
                {/* ================================================================= */}

                {(error || success) && (

                    <div className="mt-6">

                        {error && (

                            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">

                                <AlertCircle
                                    size={17}
                                    className="mt-0.5 shrink-0"
                                />

                                <span>
                                    {error}
                                </span>

                            </div>

                        )}


                        {success && (

                            <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300">

                                <CheckCircle2
                                    size={17}
                                    className="mt-0.5 shrink-0"
                                />

                                <span>
                                    {success}
                                </span>

                            </div>

                        )}

                    </div>

                )}


                {/* ================================================================= */}
                {/* CONTENT */}
                {/* ================================================================= */}

                <div className="mt-8 grid gap-8 lg:grid-cols-[190px_minmax(0,1fr)]">


                    {/* ================================================================= */}
                    {/* SETTINGS NAV */}
                    {/* ================================================================= */}

                    <aside className="hidden lg:block">

                        <nav className="sticky top-6">

                            <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400 dark:text-gray-500">

                                Settings

                            </p>


                            <div className="mt-3 space-y-1">

                                <a
                                    href="#general"
                                    className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-900 dark:bg-gray-800 dark:text-white"
                                >

                                    <UserRound
                                        size={14}
                                    />

                                    General

                                </a>


                                <a
                                    href="#permissions"
                                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                                >

                                    <ShieldCheck
                                        size={14}
                                    />

                                    Permissions

                                </a>


                                <a
                                    href="#notifications"
                                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                                >

                                    <Bell
                                        size={14}
                                    />

                                    Notifications

                                </a>


                                <a
                                    href="#danger-zone"
                                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-gray-500 transition hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                                >

                                    <Trash2
                                        size={14}
                                    />

                                    Danger zone

                                </a>

                            </div>

                        </nav>

                    </aside>


                    {/* ================================================================= */}
                    {/* MAIN SETTINGS */}
                    {/* ================================================================= */}

                    <main className="min-w-0 space-y-6">


                        {/* ============================================================= */}
                        {/* GENERAL */}
                        {/* ============================================================= */}

                        <section
                            id="general"
                            className="scroll-mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
                        >

                            <div className="border-b border-gray-100 px-5 py-5 sm:px-6 dark:border-gray-800">

                                <div className="flex items-start gap-3">

                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">

                                        <Users
                                            size={16}
                                        />

                                    </div>


                                    <div>

                                        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">

                                            General

                                        </h2>

                                        <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">

                                            Basic information about your
                                            family workspace.

                                        </p>

                                    </div>

                                </div>

                            </div>


                            <div className="space-y-5 p-5 sm:p-6">


                                {/* FAMILY NAME */}

                                <div>

                                    <label
                                        htmlFor="family-settings-name"
                                        className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300"
                                    >

                                        Family name

                                    </label>


                                    <input
                                        id="family-settings-name"
                                        type="text"
                                        value={
                                            settings.name
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            updateField(
                                                "name",
                                                event.target.value
                                            )
                                        }
                                        maxLength={
                                            100
                                        }
                                        className={`
                                            h-11
                                            w-full
                                            rounded-xl
                                            border
                                            bg-white
                                            px-3
                                            text-sm
                                            text-gray-900
                                            outline-none
                                            transition
                                            placeholder:text-gray-400
                                            focus:ring-2
                                            dark:bg-gray-900
                                            dark:text-white
                                            ${fieldErrors.name
                                                ? "border-red-300 focus:border-red-400 focus:ring-red-500/10 dark:border-red-800"
                                                : "border-gray-200 focus:border-gray-400 focus:ring-gray-900/10 dark:border-gray-700"
                                            }
                                        `}
                                    />


                                    {fieldErrors.name && (

                                        <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">

                                            {
                                                fieldErrors.name
                                            }

                                        </p>

                                    )}

                                </div>


                                {/* DESCRIPTION */}

                                <div>

                                    <label
                                        htmlFor="family-settings-description"
                                        className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300"
                                    >

                                        Description

                                        <span className="ml-1 font-normal text-gray-400">

                                            optional

                                        </span>

                                    </label>


                                    <textarea
                                        id="family-settings-description"
                                        value={
                                            settings.description
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            updateField(
                                                "description",
                                                event.target.value
                                            )
                                        }
                                        maxLength={
                                            500
                                        }
                                        rows={3}
                                        placeholder="A short description for your family workspace..."
                                        className="
                                            w-full
                                            resize-none
                                            rounded-xl
                                            border
                                            border-gray-200
                                            bg-white
                                            px-3
                                            py-3
                                            text-sm
                                            leading-6
                                            text-gray-900
                                            outline-none
                                            transition
                                            placeholder:text-gray-400
                                            focus:border-gray-400
                                            focus:ring-2
                                            focus:ring-gray-900/10
                                            dark:border-gray-700
                                            dark:bg-gray-900
                                            dark:text-white
                                        "
                                    />

                                </div>

                            </div>

                        </section>


                        {/* ============================================================= */}
                        {/* PERMISSIONS */}
                        {/* ============================================================= */}

                        <section
                            id="permissions"
                            className="scroll-mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
                        >

                            <div className="border-b border-gray-100 px-5 py-5 sm:px-6 dark:border-gray-800">

                                <div className="flex items-start gap-3">

                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">

                                        <ShieldCheck
                                            size={16}
                                        />

                                    </div>


                                    <div>

                                        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">

                                            Member permissions

                                        </h2>

                                        <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">

                                            Control which shared resources
                                            family members can access.

                                        </p>

                                    </div>

                                </div>

                            </div>


                            <div className="divide-y divide-gray-100 dark:divide-gray-800">

                                {RESOURCE_SETTINGS.map(
                                    ({
                                        key,
                                        label,
                                        description,
                                        icon: Icon,
                                    }) => {

                                        const enabled =
                                            settings
                                                .memberPermissions[
                                            key
                                            ];


                                        return (

                                            <div
                                                key={key}
                                                className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6"
                                            >

                                                <div className="flex min-w-0 items-center gap-3">

                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400">

                                                        <Icon
                                                            size={16}
                                                        />

                                                    </div>


                                                    <div className="min-w-0">

                                                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">

                                                            {label}

                                                        </p>


                                                        <p className="mt-0.5 text-xs leading-5 text-gray-500 dark:text-gray-500">

                                                            {description}

                                                        </p>

                                                    </div>

                                                </div>


                                                <button
                                                    type="button"
                                                    role="switch"
                                                    aria-checked={
                                                        enabled
                                                    }
                                                    onClick={() =>
                                                        updateNestedField(
                                                            "memberPermissions",
                                                            key,
                                                            !enabled
                                                        )
                                                    }
                                                    className={`
                                                        relative
                                                        h-6
                                                        w-10
                                                        shrink-0
                                                        rounded-full
                                                        transition-colors
                                                        focus:outline-none
                                                        focus:ring-2
                                                        focus:ring-gray-900/10
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

                                                </button>

                                            </div>

                                        );
                                    }
                                )}

                            </div>

                        </section>


                        {/* ============================================================= */}
                        {/* NOTIFICATIONS */}
                        {/* ============================================================= */}

                        <section
                            id="notifications"
                            className="scroll-mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
                        >

                            <div className="border-b border-gray-100 px-5 py-5 sm:px-6 dark:border-gray-800">

                                <div className="flex items-start gap-3">

                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">

                                        <Bell
                                            size={16}
                                        />

                                    </div>


                                    <div>

                                        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">

                                            Notifications

                                        </h2>

                                        <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">

                                            Decide which family events
                                            should trigger notifications.

                                        </p>

                                    </div>

                                </div>

                            </div>


                            <div className="divide-y divide-gray-100 dark:divide-gray-800">

                                {[
                                    {
                                        key: "renewalReminders",
                                        label: "Renewal reminders",
                                        description:
                                            "Notify family members about upcoming renewals.",
                                    },

                                    {
                                        key: "activityUpdates",
                                        label: "Activity updates",
                                        description:
                                            "Notify about important activity in the family workspace.",
                                    },

                                    {
                                        key: "memberUpdates",
                                        label: "Member updates",
                                        description:
                                            "Notify when members join, leave or change permissions.",
                                    },
                                ].map(
                                    ({
                                        key,
                                        label,
                                        description,
                                    }) => {

                                        const enabled =
                                            settings
                                                .notifications[
                                            key
                                            ];


                                        return (

                                            <div
                                                key={key}
                                                className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6"
                                            >

                                                <div className="min-w-0">

                                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">

                                                        {label}

                                                    </p>


                                                    <p className="mt-0.5 text-xs leading-5 text-gray-500 dark:text-gray-500">

                                                        {description}

                                                    </p>

                                                </div>


                                                <button
                                                    type="button"
                                                    role="switch"
                                                    aria-checked={
                                                        enabled
                                                    }
                                                    onClick={() =>
                                                        updateNestedField(
                                                            "notifications",
                                                            key,
                                                            !enabled
                                                        )
                                                    }
                                                    className={`
                                                        relative
                                                        h-6
                                                        w-10
                                                        shrink-0
                                                        rounded-full
                                                        transition-colors
                                                        focus:outline-none
                                                        focus:ring-2
                                                        focus:ring-gray-900/10
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

                                                </button>

                                            </div>

                                        );
                                    }
                                )}

                            </div>

                        </section>


                        {/* ============================================================= */}
                        {/* PRIVACY */}
                        {/* ============================================================= */}

                        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

                            <div className="border-b border-gray-100 px-5 py-5 sm:px-6 dark:border-gray-800">

                                <div className="flex items-start gap-3">

                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">

                                        <Lock
                                            size={16}
                                        />

                                    </div>


                                    <div>

                                        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">

                                            Privacy & security

                                        </h2>

                                        <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">

                                            Keep control over who can join
                                            your family workspace.

                                        </p>

                                    </div>

                                </div>

                            </div>


                            <div className="px-5 py-4 sm:px-6">

                                <div className="flex items-center justify-between gap-4">

                                    <div className="min-w-0">

                                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">

                                            Require approval for new members

                                        </p>


                                        <p className="mt-0.5 text-xs leading-5 text-gray-500 dark:text-gray-500">

                                            New members must be approved
                                            before getting access.

                                        </p>

                                    </div>


                                    <button
                                        type="button"
                                        role="switch"
                                        aria-checked={
                                            settings
                                                .privacy
                                                .requireApprovalForNewMembers
                                        }
                                        onClick={() =>
                                            updateNestedField(
                                                "privacy",
                                                "requireApprovalForNewMembers",
                                                !settings
                                                    .privacy
                                                    .requireApprovalForNewMembers
                                            )
                                        }
                                        className={`
                                            relative
                                            h-6
                                            w-10
                                            shrink-0
                                            rounded-full
                                            transition-colors
                                            focus:outline-none
                                            focus:ring-2
                                            focus:ring-gray-900/10
                                            ${settings
                                                .privacy
                                                .requireApprovalForNewMembers
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
                                                ${settings
                                                    .privacy
                                                    .requireApprovalForNewMembers
                                                    ? "translate-x-5"
                                                    : "translate-x-1"
                                                }
                                                dark:bg-gray-900
                                            `}
                                        />

                                    </button>

                                </div>

                            </div>

                        </section>


                        {/* ============================================================= */}
                        {/* DANGER ZONE */}
                        {/* ============================================================= */}

                        <section
                            id="danger-zone"
                            className="scroll-mt-6 overflow-hidden rounded-2xl border border-red-200 bg-white shadow-sm dark:border-red-900/50 dark:bg-gray-900"
                        >

                            <div className="border-b border-red-100 px-5 py-5 sm:px-6 dark:border-red-900/40">

                                <div className="flex items-start gap-3">

                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">

                                        <Trash2
                                            size={16}
                                        />

                                    </div>


                                    <div>

                                        <h2 className="text-sm font-semibold text-red-700 dark:text-red-400">

                                            Danger zone

                                        </h2>

                                        <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">

                                            Actions here can affect the
                                            entire family workspace.

                                        </p>

                                    </div>

                                </div>

                            </div>


                            <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">

                                <div className="min-w-0">

                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">

                                        Leave or delete family

                                    </p>


                                    <p className="mt-1 max-w-lg text-xs leading-5 text-gray-500 dark:text-gray-500">

                                        Family deletion is permanent.
                                        Make sure you understand what
                                        will happen before continuing.

                                    </p>

                                </div>


                                <button
                                    type="button"
                                    disabled
                                    className="
                                        inline-flex
                                        h-10
                                        shrink-0
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        border
                                        border-red-200
                                        px-3.5
                                        text-xs
                                        font-semibold
                                        text-red-600
                                        opacity-50
                                        dark:border-red-900/50
                                        dark:text-red-400
                                    "
                                >

                                    <Trash2
                                        size={14}
                                    />

                                    Delete family

                                </button>

                            </div>

                        </section>

                    </main>

                </div>

            </div>


            {/* ================================================================= */}
            {/* STICKY SAVE BAR */}
            {/* ================================================================= */}

            <div
                className={`
                    fixed
                    inset-x-0
                    bottom-0
                    z-40
                    border-t
                    border-gray-200
                    bg-white/95
                    backdrop-blur-md
                    transition-transform
                    duration-200
                    dark:border-gray-800
                    dark:bg-gray-950/95
                    ${isDirty
                        ? "translate-y-0"
                        : "translate-y-full"
                    }
                `}
            >

                <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">

                    <div className="hidden min-w-0 sm:block">

                        <p className="text-xs font-medium text-gray-800 dark:text-gray-200">

                            Unsaved changes

                        </p>

                        <p className="text-[11px] text-gray-400 dark:text-gray-500">

                            Save your changes before leaving this page.

                        </p>

                    </div>


                    <div className="flex w-full items-center justify-end gap-2 sm:w-auto">

                        <button
                            type="button"
                            onClick={
                                handleDiscard
                            }
                            disabled={
                                saving
                            }
                            className="
                                h-10
                                rounded-xl
                                border
                                border-gray-200
                                px-3.5
                                text-xs
                                font-semibold
                                text-gray-700
                                transition
                                hover:bg-gray-50
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                                dark:border-gray-700
                                dark:text-gray-300
                                dark:hover:bg-gray-800
                            "
                        >

                            Discard

                        </button>


                        <button
                            type="button"
                            onClick={
                                handleSave
                            }
                            disabled={
                                saving
                            }
                            className="
                                inline-flex
                                h-10
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-gray-900
                                px-4
                                text-xs
                                font-semibold
                                text-white
                                shadow-sm
                                transition
                                hover:bg-gray-800
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                                dark:bg-white
                                dark:text-gray-900
                                dark:hover:bg-gray-100
                            "
                        >

                            {saving ? (

                                <>

                                    <Loader2
                                        size={14}
                                        className="animate-spin"
                                    />

                                    Saving...

                                </>

                            ) : (

                                <>

                                    <Save
                                        size={14}
                                    />

                                    Save changes

                                </>

                            )}

                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
};


export default FamilySettings;