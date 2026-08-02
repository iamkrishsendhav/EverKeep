import mongoose from "mongoose";


const assetSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Asset name is required"],
            trim: true,
            maxlength: 100,
        },

        category: {
            type: String,
            required: [true, "Category is required"],
            trim: true,
            enum: [
                "Electronics",
                "Appliances",
                "Furniture",
                "Vehicle",
                "Property",
                "Insurance",
                "Subscription",
                "Documents",
                "Other",
            ],
        },

        brand: {
            type: String,
            trim: true,
            default: "",
        },

        model: {
            type: String,
            trim: true,
            default: "",
        },

        purchaseDate: {
            type: Date,
        },

        purchasePrice: {
            type: Number,
            min: 0,
            default: 0,
        },

        warrantyExpiry: {
            type: Date,
        },

        serialNumber: {
            type: String,
            trim: true,
            default: "",
        },

        image: {
            type: String,
            default: "",
        },

        notes: {
            type: String,
            trim: true,
            maxlength: 500,
            default: "",
        },

        reminderEnabled: {
            type: Boolean,
            default: true,
        },

        status: {
            type: String,
            enum: ["Active", "Expired", "Archived"],
            default: "Active",
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Asset = mongoose.model("Asset", assetSchema);

export default Asset;