import {
    AlertCircle,
    Bell,
    CalendarDays,
    Check,
    ChevronDown,
    Clock3,
    FileText,
    Flag,
    Link2,
    Loader2,
    MapPin,
    Tag,
} from "lucide-react";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    getDefaultEventData,
    formatDateTimeInput,
    toDate,
    validateEventDates,
} from "./calendarHelpers";


// ============================================================================
// CONSTANTS
// ============================================================================

const EVENT_TYPES = [
    {
        value: "warranty",
        label: "Warranty",
    },
    {
        value: "insurance",
        label: "Insurance",
    },
    {
        value: "subscription",
        label: "Subscription",
    },
    {
        value: "payment",
        label: "Payment",
    },
    {
        value: "maintenance",
        label: "Maintenance",
    },
    {
        value: "custom",
        label: "Custom",
    },
];


const PRIORITIES = [
    {
        value: "low",
        label: "Low",
    },
    {
        value: "medium",
        label: "Medium",
    },
    {
        value: "high",
        label: "High",
    },
];


const REMINDER_OPTIONS = [
    {
        value: 15,
        label: "15 minutes before",
    },
    {
        value: 30,
        label: "30 minutes before",
    },
    {
        value: 60,
        label: "1 hour before",
    },
    {
        value: 1440,
        label: "1 day before",
    },
    {
        value: 2880,
        label: "2 days before",
    },
];


// ============================================================================
// SMALL UI COMPONENTS
// ============================================================================

const FieldLabel = ({
    children,
    required = false,
    icon: Icon,
}) => {

    return (
        <label
            className="
                flex
                items-center
                gap-1.5
                text-xs
                font-semibold
                text-slate-700
            "
        >
            {Icon && (
                <Icon
                    size={13}
                    className="text-slate-400"
                />
            )}

            <span>
                {children}
            </span>

            {required && (
                <span className="text-rose-500">
                    *
                </span>
            )}
        </label>
    );
};


const FieldError = ({
    message,
}) => {

    if (!message) {
        return null;
    }


    return (
        <p
            role="alert"
            className="
                mt-1.5
                flex
                items-center
                gap-1.5
                text-[11px]
                font-medium
                text-rose-600
            "
        >
            <AlertCircle
                size={12}
            />

            {message}
        </p>
    );
};


const inputClasses = `
    mt-2
    h-11
    w-full
    rounded-xl
    border
    border-slate-200
    bg-white
    px-3.5
    text-sm
    text-slate-900
    outline-none
    transition-all
    duration-200
    placeholder:text-slate-400
    hover:border-slate-300
    focus:border-indigo-400
    focus:ring-4
    focus:ring-indigo-50
    disabled:cursor-not-allowed
    disabled:bg-slate-50
    disabled:text-slate-400
`;


const textareaClasses = `
    mt-2
    w-full
    resize-none
    rounded-xl
    border
    border-slate-200
    bg-white
    px-3.5
    py-3
    text-sm
    leading-6
    text-slate-900
    outline-none
    transition-all
    duration-200
    placeholder:text-slate-400
    hover:border-slate-300
    focus:border-indigo-400
    focus:ring-4
    focus:ring-indigo-50
    disabled:cursor-not-allowed
    disabled:bg-slate-50
`;


// ============================================================================
// NORMALIZE INITIAL DATA
// ============================================================================

const normalizeInitialData = (
    initialData,
    selectedDate
) => {

    const defaults =
        getDefaultEventData(
            selectedDate
        );


    if (!initialData) {
        return defaults;
    }


    const startDate =
        initialData.startDate ||
        defaults.startDate;


    const endDate =
        initialData.endDate ||
        startDate;


    return {

        ...defaults,

        ...initialData,

        title:
            initialData.title ||
            "",

        description:
            initialData.description ||
            "",

        type:
            initialData.type ||
            "custom",

        startDate,

        endDate,

        allDay:
            typeof initialData.allDay === "boolean"
                ? initialData.allDay
                : true,

        priority:
            initialData.priority ||
            "medium",

        status:
            initialData.status ||
            "upcoming",

        asset:
            initialData.asset?._id ||
            initialData.asset?.id ||
            initialData.asset ||
            null,

        reminder: {
            enabled:
                Boolean(
                    initialData.reminder?.enabled
                ),

            minutesBefore:
                Number(
                    initialData.reminder?.minutesBefore
                ) || 1440,
        },

        location:
            initialData.location ||
            "",

        notes:
            initialData.notes ||
            "",
    };
};


// ============================================================================
// COMPONENT
// ============================================================================

const EventForm = ({
    mode = "create",

    initialData = null,

    selectedDate = null,

    assets = [],

    onSubmit,

    onCancel,

    submitting = false,
}) => {

    // =========================================================================
    // FORM STATE
    // =========================================================================

    const [
        form,
        setForm,
    ] = useState(
        () =>
            normalizeInitialData(
                initialData,
                selectedDate
            )
    );


    const [
        errors,
        setErrors,
    ] = useState({});


    const [
        submitError,
        setSubmitError,
    ] = useState("");


    // =========================================================================
    // INITIAL DATA / EDIT MODE
    // =========================================================================

    useEffect(() => {

        const normalized =
            normalizeInitialData(
                initialData,
                selectedDate
            );


        setForm(
            normalized
        );


        setErrors({});

        setSubmitError("");

    }, [
        initialData,
        selectedDate,
    ]);


    // =========================================================================
    // ASSET OPTIONS
    // =========================================================================

    const assetOptions =
        useMemo(() => {

            if (
                !Array.isArray(
                    assets
                )
            ) {
                return [];
            }


            return assets
                .filter(Boolean)
                .map(
                    (asset) => {

                        const id =
                            asset?._id ||
                            asset?.id ||
                            "";


                        return {
                            id,

                            name:
                                asset?.name ||
                                asset?.title ||
                                asset?.assetName ||
                                "Unnamed asset",
                        };
                    }
                )
                .filter(
                    (asset) =>
                        Boolean(
                            asset.id
                        )
                );

        }, [
            assets,
        ]);


    // =========================================================================
    // SELECTED ASSET
    // =========================================================================

    const selectedAsset =
        useMemo(() => {

            if (
                !form.asset
            ) {
                return null;
            }


            return assetOptions.find(
                (asset) =>
                    String(
                        asset.id
                    ) ===
                    String(
                        form.asset
                    )
            );

        }, [
            assetOptions,
            form.asset,
        ]);


    // =========================================================================
    // UPDATE FIELD
    // =========================================================================

    const updateField = (
        field,
        value
    ) => {

        setForm(
            (previous) => ({
                ...previous,
                [field]: value,
            })
        );


        setErrors(
            (previous) => {

                if (
                    !previous[field]
                ) {
                    return previous;
                }


                const next = {
                    ...previous,
                };


                delete next[field];


                return next;
            }
        );


        if (submitError) {
            setSubmitError("");
        }
    };


    // =========================================================================
    // DATE CHANGE
    // =========================================================================

    const handleDateChange = (
        field,
        value
    ) => {

        updateField(
            field,
            value
        );


        if (
            field === "startDate" &&
            form.endDate &&
            value
        ) {

            const start =
                toDate(value);

            const end =
                toDate(
                    form.endDate
                );


            if (
                start &&
                end &&
                end < start
            ) {

                setErrors(
                    (previous) => ({
                        ...previous,
                        endDate:
                            "End date must be after the start date.",
                    })
                );
            }
        }


        if (
            field === "endDate" &&
            value
        ) {

            const validation =
                validateEventDates(
                    form.startDate,
                    value
                );


            if (
                !validation.valid
            ) {

                setErrors(
                    (previous) => ({
                        ...previous,
                        endDate:
                            validation.message,
                    })
                );
            }
        }
    };


    // =========================================================================
    // ALL DAY TOGGLE
    // =========================================================================

    const handleAllDayChange = (
        checked
    ) => {

        updateField(
            "allDay",
            checked
        );


        if (
            checked
        ) {
            return;
        }


        // Keep the existing date but make
        // sure there is a sensible time.

        const start =
            toDate(
                form.startDate
            );


        const end =
            toDate(
                form.endDate ||
                form.startDate
            );


        if (start) {

            start.setHours(
                9,
                0,
                0,
                0
            );

            updateField(
                "startDate",
                start.toISOString()
            );
        }


        if (end) {

            end.setHours(
                10,
                0,
                0,
                0
            );

            updateField(
                "endDate",
                end.toISOString()
            );
        }
    };


    // =========================================================================
    // VALIDATION
    // =========================================================================

    const validate = () => {

        const nextErrors = {};


        // ---------------------------------------------------------------------
        // TITLE
        // ---------------------------------------------------------------------

        if (
            !form.title ||
            !form.title.trim()
        ) {

            nextErrors.title =
                "Event title is required.";

        } else if (
            form.title.trim().length < 2
        ) {

            nextErrors.title =
                "Event title must contain at least 2 characters.";

        } else if (
            form.title.trim().length > 150
        ) {

            nextErrors.title =
                "Event title cannot exceed 150 characters.";
        }


        // ---------------------------------------------------------------------
        // START DATE
        // ---------------------------------------------------------------------

        if (
            !form.startDate
        ) {

            nextErrors.startDate =
                "Start date is required.";

        } else if (
            !toDate(
                form.startDate
            )
        ) {

            nextErrors.startDate =
                "Please select a valid start date.";
        }


        // ---------------------------------------------------------------------
        // END DATE
        // ---------------------------------------------------------------------

        if (
            form.endDate &&
            !toDate(
                form.endDate
            )
        ) {

            nextErrors.endDate =
                "Please select a valid end date.";
        }


        // ---------------------------------------------------------------------
        // DATE ORDER
        // ---------------------------------------------------------------------

        const dateValidation =
            validateEventDates(
                form.startDate,
                form.endDate
            );


        if (
            !dateValidation.valid &&
            !nextErrors.endDate
        ) {

            nextErrors.endDate =
                dateValidation.message;
        }


        // ---------------------------------------------------------------------
        // DESCRIPTION
        // ---------------------------------------------------------------------

        if (
            form.description &&
            form.description.length > 2000
        ) {

            nextErrors.description =
                "Description cannot exceed 2000 characters.";
        }


        // ---------------------------------------------------------------------
        // NOTES
        // ---------------------------------------------------------------------

        if (
            form.notes &&
            form.notes.length > 3000
        ) {

            nextErrors.notes =
                "Notes cannot exceed 3000 characters.";
        }


        // ---------------------------------------------------------------------
        // TYPE
        // ---------------------------------------------------------------------

        const validType =
            EVENT_TYPES.some(
                (item) =>
                    item.value ===
                    form.type
            );


        if (
            !validType
        ) {

            nextErrors.type =
                "Please select a valid event type.";
        }


        // ---------------------------------------------------------------------
        // PRIORITY
        // ---------------------------------------------------------------------

        const validPriority =
            PRIORITIES.some(
                (item) =>
                    item.value ===
                    form.priority
            );


        if (
            !validPriority
        ) {

            nextErrors.priority =
                "Please select a valid priority.";
        }


        setErrors(
            nextErrors
        );


        return (
            Object.keys(
                nextErrors
            ).length === 0
        );
    };


    // =========================================================================
    // SUBMIT
    // =========================================================================

    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();


        if (
            submitting
        ) {
            return;
        }


        setSubmitError("");


        const isValid =
            validate();


        if (!isValid) {
            return;
        }


        // ---------------------------------------------------------------------
        // PREPARE PAYLOAD
        // ---------------------------------------------------------------------

        const payload = {

            // Keep ID only outside payload if backend needs it through URL.
            // Form itself does not send _id.

            title:
                form.title.trim(),

            description:
                form.description.trim(),

            type:
                form.type,

            startDate:
                toDate(
                    form.startDate
                )?.toISOString() ||
                form.startDate,

            endDate:
                form.endDate
                    ? (
                        toDate(
                            form.endDate
                        )?.toISOString() ||
                        form.endDate
                    )
                    : null,

            allDay:
                Boolean(
                    form.allDay
                ),

            priority:
                form.priority,

            status:
                form.status ||
                "upcoming",

            asset:
                form.asset ||
                null,

            reminder: {
                enabled:
                    Boolean(
                        form.reminder?.enabled
                    ),

                minutesBefore:
                    Number(
                        form.reminder?.minutesBefore
                    ) || 1440,
            },

            location:
                form.location.trim(),

            notes:
                form.notes.trim(),
        };


        try {

            await onSubmit(
                payload
            );

        } catch (error) {

            console.error(
                "Calendar event submission failed:",
                error
            );


            setSubmitError(
                error?.response?.data?.message ||
                error?.message ||
                "Unable to save the event. Please try again."
            );
        }
    };


    // =========================================================================
    // RENDER
    // =========================================================================

    return (
        <form
            onSubmit={
                handleSubmit
            }
            noValidate
            className="
                space-y-6
            "
        >

            {/* =================================================================
                SUBMIT ERROR
            ================================================================= */}

            {submitError && (

                <div
                    role="alert"
                    className="
                        flex
                        items-start
                        gap-3
                        rounded-2xl
                        border
                        border-rose-200
                        bg-rose-50
                        px-4
                        py-3.5
                        text-rose-700
                    "
                >

                    <AlertCircle
                        size={18}
                        className="
                            mt-0.5
                            shrink-0
                        "
                    />

                    <div className="min-w-0">

                        <p
                            className="
                                text-sm
                                font-semibold
                            "
                        >
                            Unable to save event
                        </p>

                        <p
                            className="
                                mt-0.5
                                text-xs
                                leading-5
                                text-rose-600
                            "
                        >
                            {submitError}
                        </p>

                    </div>

                </div>
            )}


            {/* =================================================================
                BASIC INFORMATION
            ================================================================= */}

            <section>

                <div
                    className="
                        mb-4
                        flex
                        items-center
                        gap-3
                    "
                >

                    <div
                        className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-xl
                            bg-indigo-50
                            text-indigo-600
                        "
                    >
                        <CalendarDays
                            size={17}
                        />
                    </div>

                    <div>

                        <h3
                            className="
                                text-sm
                                font-bold
                                text-slate-900
                            "
                        >
                            Event information
                        </h3>

                        <p
                            className="
                                mt-0.5
                                text-[11px]
                                text-slate-500
                            "
                        >
                            Add the basic details for this event.
                        </p>

                    </div>

                </div>


                {/* TITLE */}

                <div>

                    <FieldLabel
                        required
                    >
                        Event title
                    </FieldLabel>

                    <input
                        type="text"
                        name="title"
                        value={
                            form.title
                        }
                        onChange={(
                            event
                        ) =>
                            updateField(
                                "title",
                                event.target.value
                            )
                        }
                        placeholder="e.g. MacBook warranty expiry"
                        maxLength={150}
                        disabled={
                            submitting
                        }
                        className={`
                            ${inputClasses}
                            ${
                                errors.title
                                    ? "border-rose-300 focus:border-rose-400 focus:ring-rose-50"
                                    : ""
                            }
                        `}
                    />

                    <div
                        className="
                            mt-1.5
                            flex
                            items-center
                            justify-between
                        "
                    >

                        <FieldError
                            message={
                                errors.title
                            }
                        />

                        <span
                            className="
                                ml-auto
                                text-[10px]
                                text-slate-400
                            "
                        >
                            {form.title.length}/150
                        </span>

                    </div>

                </div>


                {/* DESCRIPTION */}

                <div className="mt-4">

                    <FieldLabel
                        icon={FileText}
                    >
                        Description
                    </FieldLabel>

                    <textarea
                        name="description"
                        value={
                            form.description
                        }
                        onChange={(
                            event
                        ) =>
                            updateField(
                                "description",
                                event.target.value
                            )
                        }
                        rows={3}
                        maxLength={2000}
                        placeholder="Add a short description..."
                        disabled={
                            submitting
                        }
                        className={`
                            ${textareaClasses}
                            ${
                                errors.description
                                    ? "border-rose-300 focus:border-rose-400 focus:ring-rose-50"
                                    : ""
                            }
                        `}
                    />

                    <div
                        className="
                            mt-1
                            flex
                            justify-between
                        "
                    >

                        <FieldError
                            message={
                                errors.description
                            }
                        />

                        <span
                            className="
                                ml-auto
                                text-[10px]
                                text-slate-400
                            "
                        >
                            {
                                form.description.length
                            }
                            /2000
                        </span>

                    </div>

                </div>


                {/* TYPE + PRIORITY */}

                <div
                    className="
                        mt-4
                        grid
                        gap-4
                        sm:grid-cols-2
                    "
                >

                    {/* TYPE */}

                    <div>

                        <FieldLabel
                            required
                            icon={Tag}
                        >
                            Event type
                        </FieldLabel>

                        <div className="relative">

                            <select
                                value={
                                    form.type
                                }
                                onChange={(
                                    event
                                ) =>
                                    updateField(
                                        "type",
                                        event.target.value
                                    )
                                }
                                disabled={
                                    submitting
                                }
                                className={`
                                    ${inputClasses}
                                    appearance-none
                                    pr-10
                                    ${
                                        errors.type
                                            ? "border-rose-300"
                                            : ""
                                    }
                                `}
                            >

                                {EVENT_TYPES.map(
                                    (type) => (
                                        <option
                                            key={
                                                type.value
                                            }
                                            value={
                                                type.value
                                            }
                                        >
                                            {
                                                type.label
                                            }
                                        </option>
                                    )
                                )}

                            </select>

                            <ChevronDown
                                size={16}
                                className="
                                    pointer-events-none
                                    absolute
                                    right-3.5
                                    top-1/2
                                    mt-1
                                    -translate-y-1/2
                                    text-slate-400
                                "
                            />

                        </div>

                        <FieldError
                            message={
                                errors.type
                            }
                        />

                    </div>


                    {/* PRIORITY */}

                    <div>

                        <FieldLabel
                            required
                            icon={Flag}
                        >
                            Priority
                        </FieldLabel>

                        <div className="relative">

                            <select
                                value={
                                    form.priority
                                }
                                onChange={(
                                    event
                                ) =>
                                    updateField(
                                        "priority",
                                        event.target.value
                                    )
                                }
                                disabled={
                                    submitting
                                }
                                className={`
                                    ${inputClasses}
                                    appearance-none
                                    pr-10
                                    ${
                                        errors.priority
                                            ? "border-rose-300"
                                            : ""
                                    }
                                `}
                            >

                                {PRIORITIES.map(
                                    (priority) => (
                                        <option
                                            key={
                                                priority.value
                                            }
                                            value={
                                                priority.value
                                            }
                                        >
                                            {
                                                priority.label
                                            }
                                        </option>
                                    )
                                )}

                            </select>

                            <ChevronDown
                                size={16}
                                className="
                                    pointer-events-none
                                    absolute
                                    right-3.5
                                    top-1/2
                                    mt-1
                                    -translate-y-1/2
                                    text-slate-400
                                "
                            />

                        </div>

                        <FieldError
                            message={
                                errors.priority
                            }
                        />

                    </div>

                </div>

            </section>


            {/* =================================================================
                DATE & TIME
            ================================================================= */}

            <section>

                <div
                    className="
                        mb-4
                        flex
                        items-center
                        justify-between
                        gap-4
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >

                        <div
                            className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-xl
                                bg-emerald-50
                                text-emerald-600
                            "
                        >
                            <Clock3
                                size={17}
                            />
                        </div>

                        <div>

                            <h3
                                className="
                                    text-sm
                                    font-bold
                                    text-slate-900
                                "
                            >
                                Date & time
                            </h3>

                            <p
                                className="
                                    mt-0.5
                                    text-[11px]
                                    text-slate-500
                                "
                            >
                                When should this event happen?
                            </p>

                        </div>

                    </div>


                    {/* ALL DAY */}

                    <label
                        className="
                            flex
                            cursor-pointer
                            items-center
                            gap-2
                        "
                    >

                        <input
                            type="checkbox"
                            checked={
                                Boolean(
                                    form.allDay
                                )
                            }
                            onChange={(
                                event
                            ) =>
                                handleAllDayChange(
                                    event.target.checked
                                )
                            }
                            disabled={
                                submitting
                            }
                            className="
                                h-4
                                w-4
                                rounded
                                border-slate-300
                                text-indigo-600
                                accent-indigo-600
                                focus:ring-indigo-100
                            "
                        />

                        <span
                            className="
                                text-xs
                                font-semibold
                                text-slate-600
                            "
                        >
                            All day
                        </span>

                    </label>

                </div>


                <div
                    className="
                        grid
                        gap-4
                        sm:grid-cols-2
                    "
                >

                    {/* START */}

                    <div>

                        <FieldLabel
                            required
                        >
                            Start
                        </FieldLabel>

                        <input
                            type={
                                form.allDay
                                    ? "date"
                                    : "datetime-local"
                            }
                            value={
                                form.allDay
                                    ? formatDateTimeInput(
                                        form.startDate
                                    ).slice(
                                        0,
                                        10
                                    )
                                    : formatDateTimeInput(
                                        form.startDate
                                    )
                            }
                            onChange={(
                                event
                            ) => {

                                const value =
                                    event.target.value;


                                if (
                                    form.allDay
                                ) {

                                    updateField(
                                        "startDate",
                                        `${value}T00:00`
                                    );

                                } else {

                                    handleDateChange(
                                        "startDate",
                                        value
                                    );
                                }
                            }}
                            disabled={
                                submitting
                            }
                            className={`
                                ${inputClasses}
                                ${
                                    errors.startDate
                                        ? "border-rose-300 focus:border-rose-400 focus:ring-rose-50"
                                        : ""
                                }
                            `}
                        />

                        <FieldError
                            message={
                                errors.startDate
                            }
                        />

                    </div>


                    {/* END */}

                    <div>

                        <FieldLabel>
                            End
                        </FieldLabel>

                        <input
                            type={
                                form.allDay
                                    ? "date"
                                    : "datetime-local"
                            }
                            value={
                                form.allDay
                                    ? formatDateTimeInput(
                                        form.endDate ||
                                        form.startDate
                                    ).slice(
                                        0,
                                        10
                                    )
                                    : formatDateTimeInput(
                                        form.endDate ||
                                        form.startDate
                                    )
                            }
                            min={
                                form.allDay
                                    ? formatDateTimeInput(
                                        form.startDate
                                    ).slice(
                                        0,
                                        10
                                    )
                                    : undefined
                            }
                            onChange={(
                                event
                            ) => {

                                const value =
                                    event.target.value;


                                if (
                                    form.allDay
                                ) {

                                    handleDateChange(
                                        "endDate",
                                        `${value}T23:59`
                                    );

                                } else {

                                    handleDateChange(
                                        "endDate",
                                        value
                                    );
                                }
                            }}
                            disabled={
                                submitting
                            }
                            className={`
                                ${inputClasses}
                                ${
                                    errors.endDate
                                        ? "border-rose-300 focus:border-rose-400 focus:ring-rose-50"
                                        : ""
                                }
                            `}
                        />

                        <FieldError
                            message={
                                errors.endDate
                            }

                        />

                    </div>

                </div>

            </section>


            {/* =================================================================
                LINKED ASSET
            ================================================================= */}

            <section>

                <div
                    className="
                        mb-4
                        flex
                        items-center
                        gap-3
                    "
                >

                    <div
                        className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-xl
                            bg-violet-50
                            text-violet-600
                        "
                    >
                        <Link2
                            size={17}
                        />
                    </div>

                    <div>

                        <h3
                            className="
                                text-sm
                                font-bold
                                text-slate-900
                            "
                        >
                            Linked asset
                        </h3>

                        <p
                            className="
                                mt-0.5
                                text-[11px]
                                text-slate-500
                            "
                        >
                            Optionally connect this event to an asset.
                        </p>

                    </div>

                </div>


                <div className="relative">

                    <select
                        value={
                            form.asset || ""
                        }
                        onChange={(
                            event
                        ) =>
                            updateField(
                                "asset",
                                event.target.value ||
                                    null
                            )
                        }
                        disabled={
                            submitting
                        }
                        className="
                            mt-0
                            h-11
                            w-full
                            appearance-none
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            px-3.5
                            pr-10
                            text-sm
                            text-slate-700
                            outline-none
                            transition
                            hover:border-slate-300
                            focus:border-indigo-400
                            focus:ring-4
                            focus:ring-indigo-50
                            disabled:cursor-not-allowed
                            disabled:bg-slate-50
                        "
                    >

                        <option value="">
                            No asset linked
                        </option>

                        {assetOptions.map(
                            (asset) => (

                                <option
                                    key={
                                        asset.id
                                    }
                                    value={
                                        asset.id
                                    }
                                >
                                    {
                                        asset.name
                                    }
                                </option>

                            )
                        )}

                    </select>

                    <ChevronDown
                        size={16}
                        className="
                            pointer-events-none
                            absolute
                            right-3.5
                            top-1/2
                            -translate-y-1/2
                            text-slate-400
                        "
                    />

                </div>


                {selectedAsset && (

                    <div
                        className="
                            mt-2
                            flex
                            items-center
                            gap-2
                            rounded-xl
                            border
                            border-indigo-100
                            bg-indigo-50/60
                            px-3
                            py-2.5
                        "
                    >

                        <Link2
                            size={14}
                            className="
                                shrink-0
                                text-indigo-500
                            "
                        />

                        <p
                            className="
                                truncate
                                text-xs
                                font-medium
                                text-indigo-700
                            "
                        >
                            Linked to{" "}
                            <span className="font-bold">
                                {
                                    selectedAsset.name
                                }
                            </span>
                        </p>

                    </div>

                )}


                {assetOptions.length === 0 && (

                    <p
                        className="
                            mt-2
                            text-[11px]
                            text-slate-400
                        "
                    >
                        No assets available. You can still create
                        the event without linking an asset.
                    </p>

                )}

            </section>


            {/* =================================================================
                REMINDER
            ================================================================= */}

            <section>

                <div
                    className="
                        mb-4
                        flex
                        items-center
                        gap-3
                    "
                >

                    <div
                        className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-xl
                            bg-amber-50
                            text-amber-600
                        "
                    >
                        <Bell
                            size={17}
                        />
                    </div>

                    <div>

                        <h3
                            className="
                                text-sm
                                font-bold
                                text-slate-900
                            "
                        >
                            Reminder
                        </h3>

                        <p
                            className="
                                mt-0.5
                                text-[11px]
                                text-slate-500
                            "
                        >
                            Get notified before the event.
                        </p>

                    </div>

                </div>


                <div
                    className="
                        rounded-2xl
                        border
                        border-slate-200
                        bg-slate-50/70
                        p-3.5
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            gap-4
                        "
                    >

                        <div>

                            <p
                                className="
                                    text-xs
                                    font-semibold
                                    text-slate-700
                                "
                            >
                                Enable reminder
                            </p>

                            <p
                                className="
                                    mt-0.5
                                    text-[11px]
                                    text-slate-400
                                "
                            >
                                Receive a notification before this event.
                            </p>

                        </div>


                        {/* SWITCH */}

                        <button
                            type="button"
                            role="switch"
                            aria-checked={
                                Boolean(
                                    form.reminder?.enabled
                                )
                            }
                            disabled={
                                submitting
                            }
                            onClick={() =>
                                updateField(
                                    "reminder",
                                    {
                                        ...form.reminder,
                                        enabled:
                                            !form.reminder?.enabled,
                                    }
                                )
                            }
                            className={`
                                relative
                                h-6
                                w-11
                                shrink-0
                                rounded-full
                                transition
                                ${
                                    form.reminder?.enabled
                                        ? "bg-[#5B4BFF]"
                                        : "bg-slate-300"
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
                                    transition
                                    ${
                                        form.reminder?.enabled
                                            ? "left-6"
                                            : "left-1"
                                    }
                                `}
                            />

                        </button>

                    </div>


                    {form.reminder?.enabled && (

                        <div className="relative mt-3">

                            <select
                                value={
                                    form.reminder?.minutesBefore ||
                                    1440
                                }
                                onChange={(
                                    event
                                ) =>
                                    updateField(
                                        "reminder",
                                        {
                                            ...form.reminder,
                                            minutesBefore:
                                                Number(
                                                    event.target.value
                                                ),
                                        }
                                    )
                                }
                                disabled={
                                    submitting
                                }
                                className="
                                    h-10
                                    w-full
                                    appearance-none
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    px-3
                                    pr-9
                                    text-xs
                                    font-medium
                                    text-slate-700
                                    outline-none
                                    focus:border-indigo-400
                                    focus:ring-4
                                    focus:ring-indigo-50
                                "
                            >

                                {REMINDER_OPTIONS.map(
                                    (option) => (

                                        <option
                                            key={
                                                option.value
                                            }
                                            value={
                                                option.value
                                            }
                                        >
                                            {
                                                option.label
                                            }
                                        </option>

                                    )
                                )}

                            </select>

                            <ChevronDown
                                size={15}
                                className="
                                    pointer-events-none
                                    absolute
                                    right-3
                                    top-1/2
                                    -translate-y-1/2
                                    text-slate-400
                                "
                            />

                        </div>

                    )}

                </div>

            </section>


            {/* =================================================================
                LOCATION
            ================================================================= */}

            <section>

                <div
                    className="
                        mb-4
                        flex
                        items-center
                        gap-3
                    "
                >

                    <div
                        className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-xl
                            bg-sky-50
                            text-sky-600
                        "
                    >
                        <MapPin
                            size={17}
                        />
                    </div>

                    <div>

                        <h3
                            className="
                                text-sm
                                font-bold
                                text-slate-900
                            "
                        >
                            Location
                        </h3>

                        <p
                            className="
                                mt-0.5
                                text-[11px]
                                text-slate-500
                            "
                        >
                            Add an optional place or location.
                        </p>

                    </div>

                </div>


                <input
                    type="text"
                    value={
                        form.location
                    }
                    onChange={(
                        event
                    ) =>
                        updateField(
                            "location",
                            event.target.value
                        )
                    }
                    placeholder="e.g. Home, Office, Apple Store"
                    maxLength={250}
                    disabled={
                        submitting
                    }
                    className={
                        inputClasses.replace(
                            "mt-2",
                            "mt-0"
                        )
                    }
                />

            </section>


            {/* =================================================================
                NOTES
            ================================================================= */}

            <section>

                <div
                    className="
                        mb-4
                        flex
                        items-center
                        gap-3
                    "
                >

                    <div
                        className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-xl
                            bg-slate-100
                            text-slate-600
                        "
                    >
                        <FileText
                            size={17}
                        />
                    </div>

                    <div>

                        <h3
                            className="
                                text-sm
                                font-bold
                                text-slate-900
                            "
                        >
                            Notes
                        </h3>

                        <p
                            className="
                                mt-0.5
                                text-[11px]
                                text-slate-500
                            "
                        >
                            Keep additional information here.
                        </p>

                    </div>

                </div>


                <textarea
                    value={
                        form.notes
                    }
                    onChange={(
                        event
                    ) =>
                        updateField(
                            "notes",
                            event.target.value
                        )
                    }
                    rows={4}
                    maxLength={3000}
                    placeholder="Add notes, instructions or additional details..."
                    disabled={
                        submitting
                    }
                    className={textareaClasses}
                />

                <div
                    className="
                        mt-1
                        flex
                        justify-end
                    "
                >

                    <span
                        className="
                            text-[10px]
                            text-slate-400
                        "
                    >
                        {
                            form.notes.length
                        }
                        /3000
                    </span>

                </div>

                <FieldError
                    message={
                        errors.notes
                    }
                />

            </section>


            {/* =================================================================
                FOOTER ACTIONS
            ================================================================= */}

            <div
                className="
                    flex
                    flex-col-reverse
                    gap-2
                    border-t
                    border-slate-100
                    pt-5
                    sm:flex-row
                    sm:items-center
                    sm:justify-end
                "
            >

                <button
                    type="button"
                    onClick={
                        onCancel
                    }
                    disabled={
                        submitting
                    }
                    className="
                        inline-flex
                        h-11
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        px-5
                        text-sm
                        font-semibold
                        text-slate-600
                        transition-all
                        hover:border-slate-300
                        hover:bg-slate-50
                        hover:text-slate-800
                        focus:outline-none
                        focus:ring-4
                        focus:ring-slate-100
                        disabled:pointer-events-none
                        disabled:opacity-50
                    "
                >
                    Cancel
                </button>


                <button
                    type="submit"
                    disabled={
                        submitting
                    }
                    className="
                        inline-flex
                        h-11
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-[#5B4BFF]
                        px-6
                        text-sm
                        font-semibold
                        text-white
                        shadow-[0_12px_28px_rgba(91,75,255,0.18)]
                        transition-all
                        hover:-translate-y-0.5
                        hover:bg-indigo-600
                        focus:outline-none
                        focus:ring-4
                        focus:ring-indigo-100
                        disabled:pointer-events-none
                        disabled:opacity-60
                    "
                >

                    {submitting ? (

                        <>
                            <Loader2
                                size={16}
                                className="
                                    animate-spin
                                "
                            />

                            {mode === "edit"
                                ? "Saving changes..."
                                : "Creating event..."
                            }
                        </>

                    ) : (

                        <>
                            <Check
                                size={16}
                            />

                            {mode === "edit"
                                ? "Save changes"
                                : "Create event"
                            }
                        </>

                    )}

                </button>

            </div>

        </form>
    );
};


// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default EventForm;