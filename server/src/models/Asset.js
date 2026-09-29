import mongoose from "mongoose";

// ============================================================================
// ASSET SCHEMA
// ============================================================================
//
// EverKeep Asset
//
// Ownership:
//     owner → actual user who owns the asset
//
// Family:
//     family → optional family workspace
//
// Sharing:
//     sharing.shared → whether the asset is shared with family
//     sharing.members → individual family members with access
//
// IMPORTANT:
// Existing asset functionality remains unchanged.
// Family fields are optional, so existing assets continue to work normally.
//
// ============================================================================

// ============================================================================
// FAMILY MEMBER ACCESS SCHEMA
// ============================================================================

const assetMemberAccessSchema = new mongoose.Schema(
    {
        // ----------------------------------------------------------------
        // FAMILY MEMBER
        // ----------------------------------------------------------------

        user: {
            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true,
        },

        // ----------------------------------------------------------------
        // ACCESS LEVEL
        // ----------------------------------------------------------------

        access: {
            type: String,

            enum: ["View", "Edit"],

            default: "View",
        },

        // ----------------------------------------------------------------
        // SHARED AT
        // ----------------------------------------------------------------

        sharedAt: {
            type: Date,

            default: Date.now,
        },
    },

    {
        _id: false,
    },
);

// ============================================================================
// ASSET SHARING SCHEMA
// ============================================================================

const assetSharingSchema = new mongoose.Schema(
    {
        // ----------------------------------------------------------------
        // SHARING ENABLED
        // ----------------------------------------------------------------

        shared: {
            type: Boolean,

            default: false,
        },

        // ----------------------------------------------------------------
        // FAMILY MEMBERS
        // ----------------------------------------------------------------

        members: {
            type: [assetMemberAccessSchema],

            default: [],
        },
    },

    {
        _id: false,
    },
);

// ============================================================================
// ASSET SCHEMA
// ============================================================================

const assetSchema = new mongoose.Schema(
    {
        // =====================================================================
        // BASIC INFORMATION
        // =====================================================================

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

            maxlength: 100,
        },

        model: {
            type: String,

            trim: true,

            default: "",

            maxlength: 100,
        },

        // =====================================================================
        // PURCHASE INFORMATION
        // =====================================================================

        purchaseDate: {
            type: Date,
        },

        purchasePrice: {
            type: Number,

            min: 0,

            default: 0,
        },

        // =====================================================================
        // WARRANTY
        // =====================================================================

        warrantyExpiry: {
            type: Date,
        },

        // =====================================================================
        // IDENTIFICATION
        // =====================================================================

        serialNumber: {
            type: String,

            trim: true,

            default: "",

            maxlength: 150,
        },

        // =====================================================================
        // MEDIA
        // =====================================================================

        image: {
            type: String,

            trim: true,

            default: "",
        },

        // =====================================================================
        // NOTES
        // =====================================================================

        notes: {
            type: String,

            trim: true,

            maxlength: 500,

            default: "",
        },

        // =====================================================================
        // REMINDER
        // =====================================================================

        reminderEnabled: {
            type: Boolean,

            default: true,
        },

        // =====================================================================
        // STATUS
        // =====================================================================

        status: {
            type: String,

            enum: ["Active", "Expired", "Archived"],

            default: "Active",
        },

        // =====================================================================
        // OWNER
        // =====================================================================
        //
        // The actual EverKeep user who owns this asset.
        //
        // authMiddleware
        //      ↓
        // req.user
        //      ↓
        // controller
        //      ↓
        // owner: req.user._id
        //
        // =====================================================================

        owner: {
            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: [true, "Asset owner is required"],

            index: true,
        },

        // =====================================================================
        // FAMILY
        // =====================================================================
        //
        // Optional.
        //
        // An asset can remain a personal asset even if the user has a Family.
        //
        // When the asset becomes a Family asset:
        //
        //     family → Family._id
        //
        // =====================================================================

        family: {
            type: mongoose.Schema.Types.ObjectId,

            ref: "Family",

            default: null,

            index: true,
        },

        // =====================================================================
        // FAMILY SHARING
        // =====================================================================

        sharing: {
            type: assetSharingSchema,

            default: () => ({
                shared: false,

                members: [],
            }),
        },
    },

    {
        timestamps: true,
    },
);

// ============================================================================
// INDEXES
// ============================================================================
//
// Existing owner-based queries remain optimized.
//
// ============================================================================

assetSchema.index({
    owner: 1,

    createdAt: -1,
});

// ============================================================================
// FAMILY INDEX
// ============================================================================
//
// Useful for:
//
// Asset.find({
//     family: familyId
// })
//
// ============================================================================

assetSchema.index({
    family: 1,

    createdAt: -1,
});

// ============================================================================
// FAMILY MEMBER SHARING INDEX
// ============================================================================
//
// Useful when checking whether a particular user has access to an asset.
//
// ============================================================================

assetSchema.index({
    "sharing.members.user": 1,
});

// ============================================================================
// MODEL
// ============================================================================

const Asset = mongoose.model("Asset", assetSchema);

export default Asset;
