import mongoose from "mongoose";

// ============================================================================
// SUBSCRIPTION MEMBER ACCESS SCHEMA
// ============================================================================

const subscriptionMemberAccessSchema = new mongoose.Schema(
    {
        // =================================================================
        // FAMILY MEMBER
        // =================================================================

        user: {
            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true,
        },

        // =================================================================
        // ACCESS LEVEL
        // =================================================================

        access: {
            type: String,

            enum: ["View", "Edit"],

            default: "View",
        },

        // =================================================================
        // SHARED DATE
        // =================================================================

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
// SUBSCRIPTION SHARING SCHEMA
// ============================================================================

const subscriptionSharingSchema = new mongoose.Schema(
    {
        // =================================================================
        // SHARING STATUS
        // =================================================================

        shared: {
            type: Boolean,

            default: false,
        },

        // =================================================================
        // FAMILY MEMBERS
        // =================================================================

        members: {
            type: [subscriptionMemberAccessSchema],

            default: [],
        },
    },

    {
        _id: false,
    },
);

// ============================================================================
// SUBSCRIPTION SCHEMA
// ============================================================================

const subscriptionSchema = new mongoose.Schema(
    {
        // =================================================================
        // BASIC INFORMATION
        // =================================================================

        name: {
            type: String,

            required: [true, "Subscription name is required."],

            trim: true,

            minlength: [2, "Subscription name must be at least 2 characters."],

            maxlength: [100, "Subscription name cannot exceed 100 characters."],
        },

        provider: {
            type: String,

            required: [true, "Provider is required."],

            trim: true,

            maxlength: [100, "Provider cannot exceed 100 characters."],
        },

        // =================================================================
        // PLAN
        // =================================================================

        plan: {
            type: String,

            trim: true,

            maxlength: 100,

            default: "",
        },

        // =================================================================
        // CATEGORY
        // =================================================================

        category: {
            type: String,

            enum: [
                "streaming",
                "software",
                "cloud",
                "gaming",
                "music",
                "education",
                "fitness",
                "news",
                "shopping",
                "utilities",
                "other",
            ],

            default: "other",
        },

        // =================================================================
        // BILLING
        // =================================================================

        amount: {
            type: Number,

            required: [true, "Subscription amount is required."],

            min: [0, "Subscription amount cannot be negative."],
        },

        currency: {
            type: String,

            trim: true,

            uppercase: true,

            default: "INR",

            maxlength: 3,
        },

        billingCycle: {
            type: String,

            enum: [
                "weekly",
                "monthly",
                "quarterly",
                "half-yearly",
                "yearly",
                "custom",
            ],

            default: "monthly",
        },

        // =================================================================
        // DATES
        // =================================================================

        startDate: {
            type: Date,

            required: [true, "Start date is required."],
        },

        nextBillingDate: {
            type: Date,

            required: [true, "Next billing date is required."],
        },

        // =================================================================
        // AUTO RENEWAL
        // =================================================================

        autoRenew: {
            type: Boolean,

            default: true,
        },

        // =================================================================
        // STATUS
        // =================================================================

        status: {
            type: String,

            enum: ["active", "paused", "cancelled", "expired"],

            default: "active",
        },

        // =================================================================
        // LINKED ASSET
        // =================================================================

        asset: {
            type: mongoose.Schema.Types.ObjectId,

            ref: "Asset",

            default: null,
        },

        // =================================================================
        // PAYMENT INFORMATION
        // =================================================================

        paymentMethod: {
            type: String,

            trim: true,

            maxlength: 100,

            default: "",
        },

        // =================================================================
        // NOTES
        // =================================================================

        notes: {
            type: String,

            trim: true,

            maxlength: [1000, "Notes cannot exceed 1000 characters."],

            default: "",
        },

        // =================================================================
        // REMINDER
        // =================================================================

        reminderDays: {
            type: Number,

            min: 0,

            max: 365,

            default: 3,
        },

        // =================================================================
        // OWNER / USER
        // =================================================================
        //
        // IMPORTANT:
        //
        // Existing EverKeep code already uses `user`.
        // We intentionally keep this field instead of renaming it to
        // `owner`.
        //
        // =================================================================

        user: {
            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: [true, "Subscription user is required."],

            index: true,
        },

        // =================================================================
        // FAMILY
        // =================================================================
        //
        // null:
        //     Personal subscription
        //
        // Family ID:
        //     Subscription belongs to a Family workspace
        //
        // =================================================================

        family: {
            type: mongoose.Schema.Types.ObjectId,

            ref: "Family",

            default: null,

            index: true,
        },

        // =================================================================
        // FAMILY SHARING
        // =================================================================

        sharing: {
            type: subscriptionSharingSchema,

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

// User + billing date
subscriptionSchema.index({
    user: 1,
    nextBillingDate: 1,
});

// User + status
subscriptionSchema.index({
    user: 1,
    status: 1,
});

// User + category
subscriptionSchema.index({
    user: 1,
    category: 1,
});

// Family + billing date
subscriptionSchema.index({
    family: 1,
    nextBillingDate: 1,
});

// Family + status
subscriptionSchema.index({
    family: 1,
    status: 1,
});

// Shared member lookup
subscriptionSchema.index({
    "sharing.members.user": 1,
});

// ============================================================================
// MODEL
// ============================================================================

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
