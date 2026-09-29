import {
    AlertCircle,
    CalendarDays,
    Check,
    ChevronDown,
    FileText,
    Loader2,
    Package,
    ShieldCheck,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import { useAssets } from "../../hooks/useAssets";

import {
    normalizeWarrantyFormData,
} from "./warrantyHelpers";


// ============================================================
// INITIAL FORM
// ============================================================

const EMPTY_FORM = {
    title: "",
    provider: "",
    asset: "",
    startDate: "",
    expiryDate: "",
    notes: "",
};


// ============================================================
// FIELD COMPONENT
// ============================================================

const FieldLabel = ({
    children,
    required = false,
}) => (
    <label
        className="
            mb-1.5
            block
            text-xs
            font-semibold
            text-slate-700
        "
    >
        {children}

        {required && (
            <span className="ml-1 text-rose-500">
                *
            </span>
        )}
    </label>
);


// ============================================================
// INPUT CLASS
// ============================================================

const inputClass = (hasError = false) => `
    h-11
    w-full
    rounded-xl
    border
    bg-white
    px-3.5
    text-sm
    text-slate-800
    outline-none
    transition-all
    placeholder:text-slate-400

    ${
        hasError
            ? `
                border-rose-300
                focus:border-rose-400
                focus:ring-4
                focus:ring-rose-50
              `
            : `
                border-slate-200
                hover:border-slate-300
                focus:border-indigo-300
                focus:ring-4
                focus:ring-indigo-50
              `
    }
`;


// ============================================================
// ERROR MESSAGE
// ============================================================

const FieldError = ({ message }) => {

    if (!message) {
        return null;
    }

    return (
        <p
            className="
                mt-1.5
                flex
                items-center
                gap-1
                text-[11px]
                font-medium
                text-rose-600
            "
        >
            <AlertCircle size={12} />

            {message}
        </p>
    );
};


// ============================================================
// WARRANTY FORM
// ============================================================

const WarrantyForm = ({
    mode = "create",
    initialData = null,
    onSubmit,
    onCancel,
    submitting = false,
}) => {

    // ============================================================
    // ASSETS
    // ============================================================

    const {
        assets = [],
        loading: assetsLoading = false,
    } = useAssets();


    // ============================================================
    // FORM STATE
    // ============================================================

    const [form, setForm] =
        useState(EMPTY_FORM);


    const [errors, setErrors] =
        useState({});


    const [submitError, setSubmitError] =
        useState("");


    // ============================================================
    // EDIT MODE / INITIAL DATA
    // ============================================================

    useEffect(() => {

        if (!initialData) {

            setForm(EMPTY_FORM);

            return;
        }


        const normalized =
            normalizeWarrantyFormData(
                initialData
            );


        setForm({
            title:
                normalized.title || "",

            provider:
                normalized.provider || "",

            asset:
                normalized.asset || "",

            startDate:
                normalized.startDate
                    ? String(
                        normalized.startDate
                    ).slice(0, 10)
                    : "",

            expiryDate:
                normalized.expiryDate
                    ? String(
                        normalized.expiryDate
                    ).slice(0, 10)
                    : "",

            notes:
                normalized.notes || "",
        });


        setErrors({});
        setSubmitError("");

    }, [initialData]);


    // ============================================================
    // ASSET OPTIONS
    // ============================================================

    const assetOptions = useMemo(() => {

        if (!Array.isArray(assets)) {
            return [];
        }


        return assets
            .filter(Boolean)
            .map((asset) => {

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

            })
            .filter(
                (asset) => asset.id
            );

    }, [assets]);


    // ============================================================
    // CURRENT SELECTED ASSET
    // ============================================================

    const selectedAsset =
        assetOptions.find(
            (asset) =>
                String(asset.id) ===
                String(form.asset)
        );


    // ============================================================
    // HANDLE CHANGE
    // ============================================================

    const updateField = (
        field,
        value
    ) => {

        setForm((previous) => ({
            ...previous,
            [field]: value,
        }));


        // Remove field error after user starts fixing it.

        if (errors[field]) {

            setErrors((previous) => {

                const next = {
                    ...previous,
                };

                delete next[field];

                return next;
            });

        }


        if (submitError) {
            setSubmitError("");
        }

    };


    // ============================================================
    // VALIDATION
    // ============================================================

    const validate = () => {

        const nextErrors = {};


        // --------------------------------------------------------
        // TITLE
        // --------------------------------------------------------

        if (!form.title.trim()) {

            nextErrors.title =
                "Warranty name is required.";

        } else if (
            form.title.trim().length < 2
        ) {

            nextErrors.title =
                "Warranty name is too short.";

        }


        // --------------------------------------------------------
        // PROVIDER
        // --------------------------------------------------------

        if (!form.provider.trim()) {

            nextErrors.provider =
                "Provider is required.";

        }


        // --------------------------------------------------------
        // START DATE
        // --------------------------------------------------------

        if (!form.startDate) {

            nextErrors.startDate =
                "Start date is required.";

        }


        // --------------------------------------------------------
        // EXPIRY DATE
        // --------------------------------------------------------

        if (!form.expiryDate) {

            nextErrors.expiryDate =
                "Expiry date is required.";

        }


        // --------------------------------------------------------
        // DATE RANGE
        // --------------------------------------------------------

        if (
            form.startDate &&
            form.expiryDate
        ) {

            const start =
                new Date(
                    `${form.startDate}T00:00:00`
                );

            const expiry =
                new Date(
                    `${form.expiryDate}T00:00:00`
                );


            if (
                Number.isNaN(
                    start.getTime()
                ) ||
                Number.isNaN(
                    expiry.getTime()
                )
            ) {

                nextErrors.expiryDate =
                    "Please enter valid dates.";

            } else if (
                expiry < start
            ) {

                nextErrors.expiryDate =
                    "Expiry date cannot be before start date.";

            }

        }


        setErrors(nextErrors);

        return (
            Object.keys(
                nextErrors
            ).length === 0
        );
    };


    // ============================================================
    // SUBMIT
    // ============================================================

    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();


        if (submitting) {
            return;
        }


        setSubmitError("");


        const isValid =
            validate();


        if (!isValid) {
            return;
        }


        const payload = {

            title:
                form.title.trim(),

            provider:
                form.provider.trim(),

            asset:
                form.asset || null,

            startDate:
                form.startDate,

            expiryDate:
                form.expiryDate,

            notes:
                form.notes.trim(),
        };


        try {

            await onSubmit(payload);

        } catch (error) {

            console.error(
                "Warranty form submission failed:",
                error
            );


            setSubmitError(
                error?.response?.data?.message ||
                error?.message ||
                "Unable to save warranty. Please try again."
            );

        }

    };


    // ============================================================
    // FORM
    // ============================================================

    return (
        <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-5"
        >

            {/* ==================================================
                FORM ERROR
            ================================================== */}

            {submitError && (

                <div
                    role="alert"
                    className="
                        flex
                        gap-3
                        rounded-2xl
                        border
                        border-rose-200
                        bg-rose-50
                        p-4
                    "
                >

                    <AlertCircle
                        size={18}
                        className="
                            mt-0.5
                            shrink-0
                            text-rose-600
                        "
                    />

                    <div>

                        <p
                            className="
                                text-sm
                                font-semibold
                                text-rose-800
                            "
                        >
                            Unable to save warranty
                        </p>

                        <p
                            className="
                                mt-1
                                text-xs
                                leading-5
                                text-rose-700
                            "
                        >
                            {submitError}
                        </p>

                    </div>

                </div>

            )}


            {/* ==================================================
                BASIC INFORMATION
            ================================================== */}

            <section>

                <div
                    className="
                        mb-3
                        flex
                        items-center
                        gap-2
                    "
                >

                    <div
                        className="
                            flex
                            h-7
                            w-7
                            items-center
                            justify-center
                            rounded-lg
                            bg-indigo-50
                            text-indigo-600
                        "
                    >
                        <ShieldCheck size={14} />
                    </div>

                    <div>

                        <h3
                            className="
                                text-sm
                                font-bold
                                text-slate-900
                            "
                        >
                            Warranty information
                        </h3>

                        <p
                            className="
                                text-[11px]
                                text-slate-400
                            "
                        >
                            Basic coverage details
                        </p>

                    </div>

                </div>


                <div className="space-y-4">

                    {/* WARRANTY NAME */}

                    <div>

                        <FieldLabel required>
                            Warranty name
                        </FieldLabel>

                        <div className="relative">

                            <ShieldCheck
                                size={16}
                                className="
                                    pointer-events-none
                                    absolute
                                    left-3.5
                                    top-1/2
                                    -translate-y-1/2
                                    text-slate-400
                                "
                            />

                            <input
                                type="text"
                                value={form.title}
                                onChange={(event) =>
                                    updateField(
                                        "title",
                                        event.target.value
                                    )
                                }
                                placeholder="e.g. Samsung TV Warranty"
                                disabled={submitting}
                                autoComplete="off"
                                className={`
                                    ${inputClass(
                                        !!errors.title
                                    )}
                                    pl-10
                                `}
                            />

                        </div>

                        <FieldError
                            message={errors.title}
                        />

                    </div>


                    {/* PROVIDER */}

                    <div>

                        <FieldLabel required>
                            Provider / brand
                        </FieldLabel>

                        <input
                            type="text"
                            value={form.provider}
                            onChange={(event) =>
                                updateField(
                                    "provider",
                                    event.target.value
                                )
                            }
                            placeholder="e.g. Samsung, Apple, Dell"
                            disabled={submitting}
                            autoComplete="organization"
                            className={inputClass(
                                !!errors.provider
                            )}
                        />

                        <FieldError
                            message={errors.provider}
                        />

                    </div>


                    {/* ASSET */}

                    <div>

                        <FieldLabel>
                            Linked asset
                        </FieldLabel>

                        <div className="relative">

                            <Package
                                size={16}
                                className="
                                    pointer-events-none
                                    absolute
                                    left-3.5
                                    top-1/2
                                    -translate-y-1/2
                                    text-slate-400
                                "
                            />

                            <select
                                value={form.asset}
                                onChange={(event) =>
                                    updateField(
                                        "asset",
                                        event.target.value
                                    )
                                }
                                disabled={
                                    submitting ||
                                    assetsLoading
                                }
                                className={`
                                    ${inputClass(false)}
                                    appearance-none
                                    pl-10
                                    pr-10
                                `}
                            >

                                <option value="">
                                    {assetsLoading
                                        ? "Loading assets..."
                                        : "Select an asset"
                                    }
                                </option>


                                {assetOptions.map(
                                    (asset) => (

                                        <option
                                            key={asset.id}
                                            value={asset.id}
                                        >
                                            {asset.name}
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


                        {!assetsLoading &&
                            assetOptions.length === 0 && (

                                <p
                                    className="
                                        mt-1.5
                                        text-[11px]
                                        text-slate-400
                                    "
                                >
                                    No assets available.
                                    You can add the warranty
                                    without linking an asset.
                                </p>

                            )}

                    </div>

                </div>

            </section>


            {/* ==================================================
                COVERAGE PERIOD
            ================================================== */}

            <section>

                <div
                    className="
                        mb-3
                        flex
                        items-center
                        gap-2
                    "
                >

                    <div
                        className="
                            flex
                            h-7
                            w-7
                            items-center
                            justify-center
                            rounded-lg
                            bg-emerald-50
                            text-emerald-600
                        "
                    >
                        <CalendarDays size={14} />
                    </div>

                    <div>

                        <h3
                            className="
                                text-sm
                                font-bold
                                text-slate-900
                            "
                        >
                            Coverage period
                        </h3>

                        <p
                            className="
                                text-[11px]
                                text-slate-400
                            "
                        >
                            Define when the warranty starts
                            and expires.
                        </p>

                    </div>

                </div>


                <div
                    className="
                        grid
                        grid-cols-1
                        gap-4
                        sm:grid-cols-2
                    "
                >

                    {/* START */}

                    <div>

                        <FieldLabel required>
                            Start date
                        </FieldLabel>

                        <div className="relative">

                            <CalendarDays
                                size={16}
                                className="
                                    pointer-events-none
                                    absolute
                                    left-3.5
                                    top-1/2
                                    -translate-y-1/2
                                    text-slate-400
                                "
                            />

                            <input
                                type="date"
                                value={
                                    form.startDate
                                }
                                onChange={(event) =>
                                    updateField(
                                        "startDate",
                                        event.target.value
                                    )
                                }
                                disabled={submitting}
                                className={`
                                    ${inputClass(
                                        !!errors.startDate
                                    )}
                                    pl-10
                                `}
                            />

                        </div>

                        <FieldError
                            message={errors.startDate}
                        />

                    </div>


                    {/* EXPIRY */}

                    <div>

                        <FieldLabel required>
                            Expiry date
                        </FieldLabel>

                        <div className="relative">

                            <CalendarDays
                                size={16}
                                className="
                                    pointer-events-none
                                    absolute
                                    left-3.5
                                    top-1/2
                                    -translate-y-1/2
                                    text-slate-400
                                "
                            />

                            <input
                                type="date"
                                value={
                                    form.expiryDate
                                }
                                onChange={(event) =>
                                    updateField(
                                        "expiryDate",
                                        event.target.value
                                    )
                                }
                                disabled={submitting}
                                min={
                                    form.startDate ||
                                    undefined
                                }
                                className={`
                                    ${inputClass(
                                        !!errors.expiryDate
                                    )}
                                    pl-10
                                `}
                            />

                        </div>

                        <FieldError
                            message={errors.expiryDate}
                        />

                    </div>

                </div>

            </section>


            {/* ==================================================
                NOTES
            ================================================== */}

            <section>

                <div
                    className="
                        mb-3
                        flex
                        items-center
                        gap-2
                    "
                >

                    <div
                        className="
                            flex
                            h-7
                            w-7
                            items-center
                            justify-center
                            rounded-lg
                            bg-slate-100
                            text-slate-500
                        "
                    >
                        <FileText size={14} />
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
                                text-[11px]
                                text-slate-400
                            "
                        >
                            Add any useful warranty information.
                        </p>

                    </div>

                </div>


                <textarea
                    value={form.notes}
                    onChange={(event) =>
                        updateField(
                            "notes",
                            event.target.value
                        )
                    }
                    disabled={submitting}
                    rows={4}
                    maxLength={1000}
                    placeholder="
                        Add serial number, coverage details,
                        purchase information or other notes...
                    "
                    className="
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
                        text-slate-800
                        outline-none
                        transition
                        placeholder:text-slate-400
                        hover:border-slate-300
                        focus:border-indigo-300
                        focus:ring-4
                        focus:ring-indigo-50
                        disabled:bg-slate-50
                    "
                />


                <div
                    className="
                        mt-1.5
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
                        {form.notes.length}/1000
                    </span>

                </div>

            </section>


            {/* ==================================================
                SELECTED ASSET PREVIEW
            ================================================== */}

            {selectedAsset && (

                <div
                    className="
                        flex
                        items-center
                        gap-3
                        rounded-2xl
                        border
                        border-indigo-100
                        bg-indigo-50/60
                        px-4
                        py-3
                    "
                >

                    <div
                        className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-white
                            text-indigo-600
                            shadow-sm
                        "
                    >
                        <Package size={16} />
                    </div>


                    <div className="min-w-0">

                        <p
                            className="
                                text-[9px]
                                font-bold
                                uppercase
                                tracking-[0.15em]
                                text-indigo-400
                            "
                        >
                            Linked asset
                        </p>

                        <p
                            className="
                                truncate
                                text-xs
                                font-semibold
                                text-slate-700
                            "
                        >
                            {selectedAsset.name}
                        </p>

                    </div>


                    <Check
                        size={17}
                        className="
                            ml-auto
                            shrink-0
                            text-indigo-600
                        "
                    />

                </div>

            )}


            {/* ==================================================
                ACTIONS
            ================================================== */}

            <div
                className="
                    flex
                    flex-col-reverse
                    gap-2
                    border-t
                    border-slate-100
                    pt-5
                    sm:flex-row
                    sm:justify-end
                "
            >

                {/* CANCEL */}

                <button
                    type="button"
                    onClick={onCancel}
                    disabled={submitting}
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
                        text-slate-700
                        transition
                        hover:border-slate-300
                        hover:bg-slate-50
                        focus:outline-none
                        focus:ring-4
                        focus:ring-slate-100
                        disabled:pointer-events-none
                        disabled:opacity-50
                    "
                >
                    Cancel
                </button>


                {/* SUBMIT */}

                <button
                    type="submit"
                    disabled={submitting}
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
                        transition
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
                                className="animate-spin"
                            />

                            {mode === "edit"
                                ? "Saving changes..."
                                : "Creating warranty..."
                            }
                        </>
                    ) : (
                        <>
                            <ShieldCheck size={16} />

                            {mode === "edit"
                                ? "Save changes"
                                : "Add warranty"
                            }
                        </>
                    )}

                </button>

            </div>

        </form>
    );
};


export default WarrantyForm;
