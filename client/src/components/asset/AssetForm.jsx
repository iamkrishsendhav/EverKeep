// import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
// import { createAsset } from "../../services/asset.service";
import { createAsset, updateAsset, } from "../../services/asset.service";

import { useEffect, useState } from "react";


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

const AssetForm = ({ asset, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState(initialFormData);

    const [errors, setErrors] = useState({});

    const [loading, setLoading] = useState(false);

    useEffect(() => {

        if (asset) {

            setFormData({
                ...asset,

                purchaseDate: asset.purchaseDate
                    ? asset.purchaseDate.substring(0, 10)
                    : "",

                warrantyExpiry: asset.warrantyExpiry
                    ? asset.warrantyExpiry.substring(0, 10)
                    : "",
            });

        } else {

            setFormData(initialFormData);

        }

    }, [asset]);

    //--------------------------------------------------
    // Handle Input Change
    //--------------------------------------------------

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    //--------------------------------------------------
    // Validation
    //--------------------------------------------------

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Asset name is required.";
        }

        if (!formData.category) {
            newErrors.category = "Please select a category.";
        }

        if (
            formData.purchasePrice &&
            Number(formData.purchasePrice) < 0
        ) {
            newErrors.purchasePrice =
                "Purchase price cannot be negative.";
        }

        if (
            formData.purchaseDate &&
            formData.warrantyExpiry &&
            new Date(formData.purchaseDate) >
            new Date(formData.warrantyExpiry)
        ) {
            newErrors.warrantyExpiry =
                "Warranty expiry must be after purchase date.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    //--------------------------------------------------
    // Submit
    //--------------------------------------------------

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            setLoading(true);

            const payload = {
                ...formData,
                purchasePrice: formData.purchasePrice
                    ? Number(formData.purchasePrice)
                    : 0,
            };

            // const response = await createAsset(payload);

            let response;

            if (asset) {

                response = await updateAsset(
                    asset._id,
                    payload
                );

            } else {

                response = await createAsset(
                    payload
                );

            }

            console.log(response);

            if (!asset) {
                setFormData(initialFormData);
            }

            if (onSuccess) {
                onSuccess(response);
            }
        } catch (error) {
            console.error(error);

            alert(
                error?.response?.data?.message ||
                `Unable to ${asset ? "update" : "create"} asset.`
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                <Input
                    label="Asset Name"
                    name="name"
                    placeholder="MacBook Pro M4"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                    required
                />

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                        Category
                        <span className="ml-1 text-red-500">*</span>
                    </label>

                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5"
                    >
                        <option value="">Select Category</option>

                        {categories.map((category) => (
                            <option
                                key={category}
                                value={category}
                            >
                                {category}
                            </option>
                        ))}
                    </select>

                    {errors.category && (
                        <p className="text-xs text-red-500">
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
                />

                <Input
                    label="Model"
                    name="model"
                    placeholder="M4 Pro"
                    value={formData.model}
                    onChange={handleChange}
                />

                <Input
                    label="Purchase Date"
                    name="purchaseDate"
                    type="date"
                    value={formData.purchaseDate}
                    onChange={handleChange}
                />

                <Input
                    label="Purchase Price"
                    name="purchasePrice"
                    type="number"
                    placeholder="189999"
                    value={formData.purchasePrice}
                    onChange={handleChange}
                    error={errors.purchasePrice}
                />

                <Input
                    label="Warranty Expiry"
                    name="warrantyExpiry"
                    type="date"
                    value={formData.warrantyExpiry}
                    onChange={handleChange}
                    error={errors.warrantyExpiry}
                />

                <Input
                    label="Serial Number"
                    name="serialNumber"
                    placeholder="APL-M4-0001"
                    value={formData.serialNumber}
                    onChange={handleChange}
                />

            </div>

            <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Notes
                </label>

                <textarea
                    name="notes"
                    rows={5}
                    placeholder="Write additional notes..."
                    value={formData.notes}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5"
                />
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 pt-6">

                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    loading={loading}
                >
                    {asset
                        ? "Update Asset"
                        : "Save Asset"}
                </Button>

            </div>
        </form>
    );
};

export default AssetForm;
