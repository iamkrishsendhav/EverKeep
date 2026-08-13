import mongoose from "mongoose";

const warrantySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Warranty title is required"],
            trim: true,
            maxlength: 120,
        },

        asset: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Asset",
            default: null,
        },

        provider: {
            type: String,
            trim: true,
            maxlength: 120,
            default: "",
        },

        warrantyNumber: {
            type: String,
            trim: true,
            maxlength: 100,
            default: "",
        },

        startDate: {
            type: Date,
            required: [true, "Warranty start date is required"],
        },

        expiryDate: {
            type: Date,
            required: [true, "Warranty expiry date is required"],
        },

        notes: {
            type: String,
            trim: true,
            maxlength: 1000,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

/*
|--------------------------------------------------------------------------
| Warranty Date Validation
|--------------------------------------------------------------------------
*/

warrantySchema.pre("validate", function () {
    if (
        this.startDate &&
        this.expiryDate &&
        this.expiryDate < this.startDate
    ) {
        throw new Error(
            "Warranty expiry date cannot be before start date."
        );
    }
});

const Warranty = mongoose.model("Warranty", warrantySchema);

export default Warranty;