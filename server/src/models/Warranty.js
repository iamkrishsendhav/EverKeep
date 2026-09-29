import mongoose from "mongoose";


// ============================================================================
// WARRANTY MEMBER ACCESS SCHEMA
// ============================================================================

const warrantyMemberAccessSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        access: {
            type: String,
            enum: ["View", "Edit"],
            default: "View",
        },

        sharedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        _id: false,
    }
);


// ============================================================================
// WARRANTY SHARING SCHEMA
// ============================================================================

const warrantySharingSchema = new mongoose.Schema(
    {
        shared: {
            type: Boolean,
            default: false,
        },

        members: {
            type: [warrantyMemberAccessSchema],
            default: [],
        },
    },
    {
        _id: false,
    }
);


// ============================================================================
// WARRANTY SCHEMA
// ============================================================================

const warrantySchema = new mongoose.Schema(
    {
        // ====================================================================
        // BASIC INFORMATION
        // ====================================================================

        title: {
            type: String,
            required: [
                true,
                "Warranty title is required",
            ],
            trim: true,
            maxlength: 120,
        },


        // ====================================================================
        // LINKED ASSET
        // ====================================================================

        asset: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Asset",
            default: null,
        },


        // ====================================================================
        // PROVIDER
        // ====================================================================

        provider: {
            type: String,
            trim: true,
            maxlength: 120,
            default: "",
        },


        // ====================================================================
        // WARRANTY NUMBER
        // ====================================================================

        warrantyNumber: {
            type: String,
            trim: true,
            maxlength: 100,
            default: "",
        },


        // ====================================================================
        // DATES
        // ====================================================================

        startDate: {
            type: Date,
            required: [
                true,
                "Warranty start date is required",
            ],
        },

        expiryDate: {
            type: Date,
            required: [
                true,
                "Warranty expiry date is required",
            ],
        },


        // ====================================================================
        // NOTES
        // ====================================================================

        notes: {
            type: String,
            trim: true,
            maxlength: 1000,
            default: "",
        },


        // ====================================================================
        // OWNER
        // ====================================================================
        //
        // IMPORTANT:
        // Existing EverKeep architecture uses `owner`.
        // Keep it unchanged.
        //
        // ====================================================================

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [
                true,
                "Warranty owner is required",
            ],
            index: true,
        },


        // ====================================================================
        // FAMILY
        // ====================================================================
        //
        // null:
        //     Personal warranty
        //
        // Family ID:
        //     Warranty is associated with a family workspace
        //
        // ====================================================================

        family: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Family",
            default: null,
            index: true,
        },


        // ====================================================================
        // FAMILY SHARING
        // ====================================================================

        sharing: {
            type: warrantySharingSchema,

            default: () => ({
                shared: false,
                members: [],
            }),
        },
    },

    {
        timestamps: true,
    }
);


// ============================================================================
// INDEXES
// ============================================================================

// Owner + expiry
warrantySchema.index({
    owner: 1,
    expiryDate: 1,
});


// Family + expiry
warrantySchema.index({
    family: 1,
    expiryDate: 1,
});


// Shared member lookup
warrantySchema.index({
    "sharing.members.user": 1,
});


// ============================================================================
// WARRANTY DATE VALIDATION
// ============================================================================

warrantySchema.pre(
    "validate",
    function () {

        if (
            this.startDate &&
            this.expiryDate &&
            this.expiryDate < this.startDate
        ) {

            throw new Error(
                "Warranty expiry date cannot be before start date."
            );
        }
    }
);


// ============================================================================
// MODEL
// ============================================================================

const Warranty =
    mongoose.model(
        "Warranty",
        warrantySchema
    );


export default Warranty;