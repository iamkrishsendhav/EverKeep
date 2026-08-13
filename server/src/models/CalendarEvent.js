import mongoose from "mongoose";

const calendarEventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 150,
        },

        description: {
            type: String,
            trim: true,
            maxlength: 1000,
            default: "",
        },

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

        startDate: {
            type: Date,
            required: true,
        },

        endDate: {
            type: Date,
            default: null,
        },

        allDay: {
            type: Boolean,
            default: false,
        },

        priority: {
            type: String,
            enum: [
                "low",
                "medium",
                "high",
            ],
            default: "medium",
        },

        status: {
            type: String,
            enum: [
                "upcoming",
                "completed",
                "cancelled",
            ],
            default: "upcoming",
        },

        asset: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Asset",
            default: null,
        },

        reminder: {
            enabled: {
                type: Boolean,
                default: false,
            },

            minutesBefore: {
                type: Number,
                default: 1440,
                min: 0,
            },
        },

        location: {
            type: String,
            trim: true,
            maxlength: 200,
            default: "",
        },

        notes: {
            type: String,
            trim: true,
            maxlength: 2000,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);


// ------------------------------------------------------------
// INDEXES
// ------------------------------------------------------------

calendarEventSchema.index({
    startDate: 1,
});

calendarEventSchema.index({
    type: 1,
});

calendarEventSchema.index({
    status: 1,
});

calendarEventSchema.index({
    asset: 1,
});


// ------------------------------------------------------------
// VALIDATION
// ------------------------------------------------------------

calendarEventSchema.pre(
    "validate",
    function () {

        if (
            this.endDate &&
            this.endDate < this.startDate
        ) {
            throw new Error(
                "End date cannot be earlier than start date."
            );
        }
    }
);


const CalendarEvent = mongoose.model(
    "CalendarEvent",
    calendarEventSchema
);

export default CalendarEvent;