import {
    useEffect,
    useMemo,
    useState,
} from "react";

import Input from "../ui/Input";
import Button from "../ui/Button";

import {
    createAsset,
    updateAsset,
} from "../../services/asset.service";


// ============================================================================
// CONSTANTS
// ============================================================================

const categories = [
    "Electronics",
    "Appliances",
    "Furniture",
    "Vehicle",
    "Property",
    "Insurance",
    "Subscription",
    "Documents",
    "Other",
];


const initialFormData = {
    name: "",
    category: "",
    brand: "",
    model: "",
    purchaseDate: "",
    purchasePrice: "",
    warrantyExpiry: "",
    serialNumber: "",
    notes: "",
};


// ============================================================================
// HELPERS
// ============================================================================

const formatDateForInput = (value) => {

    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toISOString().slice(0, 10);
};


const getErrorMessage = (
    error,
    fallback
) => {

    return (
        error?.response?.data?.message ||
        error?.message ||
        fallback
    );

};


// ============================================================================
// COMPONENT
// ============================================================================

const AssetForm = ({
    asset,
    onSuccess,
    onCancel,
}) => {

    const isEditMode =
        Boolean(asset?._id);


    // =========================================================================
    // STATE
    // =========================================================================

    const [formData, setFormData] =
        useState(initialFormData);


    const [errors, setErrors] =
        useState({});


    const [serverError, setServerError] =
        useState("");


    const [loading, setLoading] =
        useState(false);


    // =========================================================================
    // FORM TITLE
    // =========================================================================

    const formTitle = useMemo(
        () =>
            isEditMode
                ? "Update asset details"
                : "Add a new asset",
        [isEditMode]
    );


    // =========================================================================
    // LOAD ASSET IN EDIT MODE
    // =========================================================================

    useEffect(() => {

        if (!asset) {

            setFormData(
                initialFormData
            );

            setErrors({});
            setServerError("");

            return;
        }


        // Only copy fields that belong to the form.
        //
        // We intentionally do NOT spread the complete asset object here.
        // That prevents fields such as `_id`, `owner`, `createdAt`, etc.
        // from accidentally becoming part of the form payload.

        setFormData({

            name:
                asset.name || "",

            category:
                asset.category || "",

            brand:
                asset.brand || "",

            model:
                asset.model || "",

            purchaseDate:
                formatDateForInput(
                    asset.purchaseDate
                ),

            purchasePrice:
                asset.purchasePrice ??
                "",

            warrantyExpiry:
                formatDateForInput(
                    asset.warrantyExpiry
                ),

            serialNumber:
                asset.serialNumber || "",

            notes:
                asset.notes || "",

        });


        setErrors({});
        setServerError("");

    }, [asset]);


    // =========================================================================
    // INPUT CHANGE
    // =========================================================================

    const handleChange = (event) => {

        const {
            name,
            value,
        } = event.target;


        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));


        // Clear field-level error as soon as
        // the user starts correcting the field.

        if (errors[name]) {

            setErrors((previous) => ({
                ...previous,
                [name]: "",
            }));

        }


        // Clear general server error
        // when user starts editing again.

        if (serverError) {
            setServerError("");
        }

    };


    // =========================================================================
    // VALIDATION
    // =========================================================================

    const validate = () => {

        const newErrors = {};


        // ---------------------------------------------------------------------
        // NAME
        // ---------------------------------------------------------------------

        const name =
            formData.name.trim();


        if (!name) {

            newErrors.name =
                "Asset name is required.";

        } else if (
            name.length > 100
        ) {

            newErrors.name =
                "Asset name cannot exceed 100 characters.";

        }


        // ---------------------------------------------------------------------
        // CATEGORY
        // ---------------------------------------------------------------------

        if (!formData.category) {

            newErrors.category =
                "Please select a category.";

        }


        // ---------------------------------------------------------------------
        // PRICE
        // ---------------------------------------------------------------------

        if (
            formData.purchasePrice !== ""
        ) {

            const price =
                Number(
                    formData.purchasePrice
                );


            if (
                !Number.isFinite(price)
            ) {

                newErrors.purchasePrice =
                    "Please enter a valid purchase price.";

            } else if (
                price < 0
            ) {

                newErrors.purchasePrice =
                    "Purchase price cannot be negative.";

            }

        }


        // ---------------------------------------------------------------------
        // DATE VALIDATION
        // ---------------------------------------------------------------------

        if (
            formData.purchaseDate &&
            formData.warrantyExpiry
        ) {

            const purchaseDate =
                new Date(
                    `${formData.purchaseDate}T00:00:00`
                );


            const warrantyExpiry =
                new Date(
                    `${formData.warrantyExpiry}T00:00:00`
                );


            if (
                purchaseDate >
                warrantyExpiry
            ) {

                newErrors.warrantyExpiry =
                    "Warranty expiry must be after the purchase date.";

            }

        }


        // ---------------------------------------------------------------------
        // NOTES
        // ---------------------------------------------------------------------

        if (
            formData.notes.length > 500
        ) {

            newErrors.notes =
                "Notes cannot exceed 500 characters.";

        }


        setErrors(newErrors);

        return (
            Object.keys(newErrors)
                .length === 0
        );

    };


    // =========================================================================
    // SUBMIT
    // =========================================================================

    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();


        // Prevent duplicate requests.

        if (loading) {
            return;
        }


        setServerError("");


        if (!validate()) {
            return;
        }


        try {

            setLoading(true);


            // =================================================================
            // BUILD CLEAN PAYLOAD
            // =================================================================
            //
            // We intentionally create the payload field-by-field.
            //
            // Do NOT send:
            // - _id
            // - owner
            // - createdAt
            // - updatedAt
            // - other MongoDB fields
            //
            // Backend determines the owner from req.user.
            // =================================================================

            const payload = {

                name:
                    formData.name.trim(),

                category:
                    formData.category,

                brand:
                    formData.brand.trim(),

                model:
                    formData.model.trim(),

                purchaseDate:
                    formData.purchaseDate ||
                    undefined,

                purchasePrice:
                    formData.purchasePrice === ""
                        ? 0
                        : Number(
                            formData.purchasePrice
                        ),

                warrantyExpiry:
                    formData.warrantyExpiry ||
                    undefined,

                serialNumber:
                    formData.serialNumber.trim(),

                notes:
                    formData.notes.trim(),

            };


            // =================================================================
            // CREATE / UPDATE
            // =================================================================

            let response;


            if (isEditMode) {

                response =
                    await updateAsset(
                        asset._id,
                        payload
                    );

            } else {

                response =
                    await createAsset(
                        payload
                    );

            }


            // =================================================================
            // SUCCESS
            // =================================================================

            if (!isEditMode) {

                setFormData(
                    initialFormData
                );

            }


            setErrors({});
            setServerError("");


            if (
                typeof onSuccess ===
                "function"
            ) {

                await onSuccess(
                    response
                );

            }

        } catch (error) {

            console.error(
                isEditMode
                    ? "Update asset error:"
                    : "Create asset error:",
                error
            );


            setServerError(
                getErrorMessage(
                    error,
                    isEditMode
                        ? "Unable to update this asset. Please try again."
                        : "Unable to create this asset. Please try again."
                )
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================================================================
    // NOTES COUNTER
    // =========================================================================

    const notesLength =
        formData.notes.length;


    // =========================================================================
    // UI
    // =========================================================================

    return (

        <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-7"
        >

            {/* =================================================================
                GENERAL ERROR
            ================================================================= */}

            {serverError && (

                <div
                    role="alert"
                    className="
                        rounded-2xl
                        border
                        border-rose-200
                        bg-rose-50
                        px-4
                        py-3.5
                    "
                >

                    <p
                        className="
                            text-sm
                            font-semibold
                            text-rose-800
                        "
                    >
                        Unable to save asset
                    </p>

                    <p
                        className="
                            mt-1
                            text-sm
                            leading-5
                            text-rose-600
                        "
                    >
                        {serverError}
                    </p>

                </div>

            )}


            {/* =================================================================
                FORM INTRO
            ================================================================= */}

            <div>

                <p
                    className="
                        text-xs
                        font-semibold
                        uppercase
                        tracking-[0.16em]
                        text-slate-400
                    "
                >
                    {isEditMode
                        ? "Asset details"
                        : "New asset"}
                </p>


                <h3
                    className="
                        mt-1
                        text-lg
                        font-semibold
                        tracking-tight
                        text-slate-950
                    "
                >
                    {formTitle}
                </h3>


                <p
                    className="
                        mt-1
                        text-sm
                        leading-5
                        text-slate-500
                    "
                >
                    Keep the information accurate so EverKeep can
                    track your asset lifecycle properly.
                </p>

            </div>


            {/* =================================================================
                BASIC INFORMATION
            ================================================================= */}

            <div
                className="
                    grid
                    grid-cols-1
                    gap-5
                    md:grid-cols-2
                "
            >

                <Input
                    label="Asset Name"
                    name="name"
                    placeholder="MacBook Pro M4"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                    required
                    disabled={loading}
                />


                {/* =============================================================
                    CATEGORY
                ============================================================= */}

                <div className="space-y-2">

                    <label
                        htmlFor="asset-category"
                        className="
                            text-sm
                            font-semibold
                            text-slate-700
                        "
                    >

                        Category

                        <span
                            className="
                                ml-1
                                text-rose-500
                            "
                        >
                            *
                        </span>

                    </label>


                    <select
                        id="asset-category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        disabled={loading}
                        aria-invalid={
                            Boolean(
                                errors.category
                            )
                        }
                        className={`
                            h-11
                            w-full
                            rounded-xl
                            border
                            bg-white
                            px-4
                            text-sm
                            font-medium
                            text-slate-900
                            outline-none
                            transition
                            disabled:cursor-not-allowed
                            disabled:bg-slate-50
                            ${
                                errors.category
                                    ? `
                                        border-rose-300
                                        focus:border-rose-500
                                        focus:ring-4
                                        focus:ring-rose-500/10
                                      `
                                    : `
                                        border-slate-200
                                        focus:border-slate-950
                                        focus:ring-4
                                        focus:ring-slate-950/5
                                      `
                            }
                        `}
                    >

                        <option value="">
                            Select category
                        </option>


                        {categories.map(
                            (category) => (

                                <option
                                    key={category}
                                    value={category}
                                >
                                    {category}
                                </option>

                            )
                        )}

                    </select>


                    {errors.category && (

                        <p
                            className="
                                text-xs
                                font-medium
                                text-rose-600
                            "
                        >
                            {errors.category}
                        </p>

                    )}

                </div>


                <Input
                    label="Brand"
                    name="brand"
                    placeholder="Apple"
                    value={formData.brand}
                    onChange={handleChange}
                    disabled={loading}
                />


                <Input
                    label="Model"
                    name="model"
                    placeholder="M4 Pro"
                    value={formData.model}
                    onChange={handleChange}
                    disabled={loading}
                />


                <Input
                    label="Purchase Date"
                    name="purchaseDate"
                    type="date"
                    value={formData.purchaseDate}
                    onChange={handleChange}
                    disabled={loading}
                />


                <Input
                    label="Purchase Price"
                    name="purchasePrice"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="189999"
                    value={formData.purchasePrice}
                    onChange={handleChange}
                    error={errors.purchasePrice}
                    disabled={loading}
                />


                <Input
                    label="Warranty Expiry"
                    name="warrantyExpiry"
                    type="date"
                    value={formData.warrantyExpiry}
                    onChange={handleChange}
                    error={errors.warrantyExpiry}
                    disabled={loading}
                />


                <Input
                    label="Serial Number"
                    name="serialNumber"
                    placeholder="APL-M4-0001"
                    value={formData.serialNumber}
                    onChange={handleChange}
                    disabled={loading}
                />

            </div>


            {/* =================================================================
                NOTES
            ================================================================= */}

            <div>

                <div
                    className="
                        mb-2
                        flex
                        items-center
                        justify-between
                        gap-3
                    "
                >

                    <label
                        htmlFor="asset-notes"
                        className="
                            text-sm
                            font-semibold
                            text-slate-700
                        "
                    >
                        Notes
                    </label>


                    <span
                        className={`
                            text-xs
                            ${
                                notesLength > 500
                                    ? "text-rose-600"
                                    : "text-slate-400"
                            }
                        `}
                    >
                        {notesLength}/500
                    </span>

                </div>


                <textarea
                    id="asset-notes"
                    name="notes"
                    rows={4}
                    maxLength={500}
                    placeholder="Add useful details about this asset..."
                    value={formData.notes}
                    onChange={handleChange}
                    disabled={loading}
                    aria-invalid={
                        Boolean(
                            errors.notes
                        )
                    }
                    className={`
                        w-full
                        resize-none
                        rounded-xl
                        border
                        bg-white
                        px-4
                        py-3
                        text-sm
                        leading-6
                        text-slate-900
                        outline-none
                        transition
                        placeholder:text-slate-400
                        disabled:cursor-not-allowed
                        disabled:bg-slate-50
                        ${
                            errors.notes
                                ? `
                                    border-rose-300
                                    focus:border-rose-500
                                    focus:ring-4
                                    focus:ring-rose-500/10
                                  `
                                : `
                                    border-slate-200
                                    focus:border-slate-950
                                    focus:ring-4
                                    focus:ring-slate-950/5
                                  `
                        }
                    `}
                />


                {errors.notes && (

                    <p
                        className="
                            mt-1.5
                            text-xs
                            font-medium
                            text-rose-600
                        "
                    >
                        {errors.notes}
                    </p>

                )}

            </div>


            {/* =================================================================
                ACTIONS
            ================================================================= */}

            <div
                className="
                    flex
                    flex-col-reverse
                    gap-3
                    border-t
                    border-slate-200
                    pt-6
                    sm:flex-row
                    sm:justify-end
                "
            >

                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Cancel
                </Button>


                <Button
                    type="submit"
                    loading={loading}
                    disabled={loading}
                >
                    {isEditMode
                        ? "Update Asset"
                        : "Save Asset"}
                </Button>

            </div>

        </form>

    );

};


export default AssetForm;