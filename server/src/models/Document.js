import mongoose from "mongoose";


// ============================================================================
// DOCUMENT SCHEMA
// ============================================================================

const documentSchema = new mongoose.Schema(
    {

        // =====================================================================
        // BASIC INFORMATION
        // =====================================================================

        name: {
            type: String,
            required: [true, "Document name is required"],
            trim: true,
            maxlength: 150,
        },


        originalName: {
            type: String,
            required: [true, "Original file name is required"],
            trim: true,
            maxlength: 255,
        },


        // =====================================================================
        // FILE INFORMATION
        // =====================================================================

        fileUrl: {
            type: String,
            required: [true, "Document file URL is required"],
            trim: true,
        },


        publicId: {
            type: String,
            required: [true, "Document public ID is required"],
            trim: true,
        },


        fileType: {
            type: String,
            required: [true, "Document file type is required"],
            trim: true,
        },


        fileSize: {
            type: Number,
            required: [true, "Document file size is required"],
            min: 0,
        },


        // =====================================================================
        // CATEGORY
        // =====================================================================

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


        // =====================================================================
        // RELATED ASSET
        // =====================================================================

        asset: {
            type: mongoose.Schema.Types.ObjectId,

            ref: "Asset",

            default: null,
        },


        // =====================================================================
        // OWNER
        // =====================================================================
        //
        // Every document belongs to one authenticated EverKeep user.
        //
        // authMiddleware
        //       ↓
        // req.user._id
        //       ↓
        // document.owner
        //
        // =====================================================================

        owner: {
            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: [
                true,
                "Document owner is required",
            ],

            index: true,
        },

    },

    {
        timestamps: true,
    }
);


// ============================================================================
// INDEXES
// ============================================================================
//
// Documents are primarily queried by owner and newest-first.
//
// ============================================================================

documentSchema.index({
    owner: 1,
    createdAt: -1,
});


// ============================================================================
// MODEL
// ============================================================================

const Document =
    mongoose.model(
        "Document",
        documentSchema
    );


export default Document;