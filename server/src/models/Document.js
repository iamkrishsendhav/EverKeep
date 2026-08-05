import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        originalName: {
            type: String,
            required: true,
        },

        fileUrl: {
            type: String,
            required: true,
        },

        publicId: {
            type: String,
            required: true,
        },

        fileType: {
            type: String,
            required: true,
        },

        fileSize: {
            type: Number,
            required: true,
        },

        category: {
            type: String,
            enum: [
                "Invoice",
                "Warranty",
                "Insurance",
                "Identity",
                "Medical",
                "Property",
                "Education",
                "Other",
            ],
            default: "Other",
        },

        asset: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Asset",
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Document", documentSchema);
