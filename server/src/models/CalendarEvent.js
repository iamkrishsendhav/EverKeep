import mongoose from "mongoose";

// ============================================================================
// CALENDAR EVENT MEMBER ACCESS
// ============================================================================

const calendarMemberAccessSchema = new mongoose.Schema(
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
    },
);

// ============================================================================
// CALENDAR EVENT SHARING
// ============================================================================

const calendarSharingSchema = new mongoose.Schema(
    {
        shared: {
            type: Boolean,
            default: false,
        },

        members: {
            type: [calendarMemberAccessSchema],

            default: [],
        },
    },
    {
        _id: false,
    },
);

// ============================================================================
// CALENDAR EVENT SCHEMA
// ============================================================================

const calendarEventSchema = new mongoose.Schema(
    {
        // ====================================================================
        // BASIC INFORMATION
        // ====================================================================

        title: {
            type: String,

            required: [true, "Calendar event title is required"],

            trim: true,

            maxlength: 150,
        },

        description: {
            type: String,

            trim: true,

            maxlength: 1000,

            default: "",
        },

        // ====================================================================
        // EVENT TYPE
        // ====================================================================

        type: {
            type: String,

            enum: [
                "warranty",
                "insurance",
                "subscription",
                "payment",
                "maintenance",
                "custom",
            ],

            default: "custom",
        },

        // ====================================================================
        // EVENT DATES
        // ====================================================================

        startDate: {
            type: Date,

            required: [true, "Calendar event start date is required"],
        },

        endDate: {
            type: Date,

            default: null,
        },

        allDay: {
            type: Boolean,

            default: false,
        },

        // ====================================================================
        // PRIORITY
        // ====================================================================

        priority: {
            type: String,

            enum: ["low", "medium", "high"],

            default: "medium",
        },

        // ====================================================================
        // STATUS
        // ====================================================================

        status: {
            type: String,

            enum: ["upcoming", "completed", "cancelled"],

            default: "upcoming",
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
        // LINKED WARRANTY
        // ====================================================================

        warranty: {
            type: mongoose.Schema.Types.ObjectId,

            ref: "Warranty",

            default: null,
        },

        // ====================================================================
        // LINKED SUBSCRIPTION
        // ====================================================================

        subscription: {
            type: mongoose.Schema.Types.ObjectId,

            ref: "Subscription",

            default: null,
        },

        // ====================================================================
        // REMINDER
        // ====================================================================

        reminder: {
            enabled: {
                type: Boolean,

                default: false,
            },

            minutesBefore: {
                type: Number,

                default: 1440,

                min: 0,

                max: 525600,
            },
        },

        // ====================================================================
        // LOCATION
        // ====================================================================

        location: {
            type: String,

            trim: true,

            maxlength: 200,

            default: "",
        },

        // ====================================================================
        // NOTES
        // ====================================================================

        notes: {
            type: String,

            trim: true,

            maxlength: 2000,

            default: "",
        },

        // ====================================================================
        // OWNER
        // ====================================================================
        //
        // Personal calendar events belong to the authenticated user.
        //
        // ====================================================================

        owner: {
            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: [true, "Calendar event owner is required"],

            index: true,
        },

        // ====================================================================
        // FAMILY
        // ====================================================================
        //
        // null:
        //     Personal calendar event
        //
        // Family ID:
        //     Event belongs to a family workspace
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
            type: calendarSharingSchema,

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

// Owner calendar lookup
calendarEventSchema.index({
    owner: 1,
    startDate: 1,
});

// Family calendar lookup
calendarEventSchema.index({
    family: 1,
    startDate: 1,
});

// Shared member lookup
calendarEventSchema.index({
    "sharing.members.user": 1,
});

// Event type
calendarEventSchema.index({
    type: 1,
});

// Status
calendarEventSchema.index({
    status: 1,
});

// Linked asset
calendarEventSchema.index({
    asset: 1,
});

// Linked warranty
calendarEventSchema.index({
    warranty: 1,
});

// Linked subscription
calendarEventSchema.index({
    subscription: 1,
});

// Reminder processing
calendarEventSchema.index({
    "reminder.enabled": 1,
    startDate: 1,
});

// ============================================================================
// VALIDATION
// ============================================================================

calendarEventSchema.pre("validate", function () {
    if (this.endDate && this.startDate && this.endDate < this.startDate) {
        throw new Error("End date cannot be earlier than start date.");
    }
});

// ============================================================================
// MODEL
// ============================================================================

const CalendarEvent = mongoose.model("CalendarEvent", calendarEventSchema);

export default CalendarEvent;
