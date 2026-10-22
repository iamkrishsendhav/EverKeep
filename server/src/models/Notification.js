
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 160,
        },

        message: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2000,
        },

        category: {
            type: String,
            enum: [
                "warranty",
                "subscription",
                "asset",
                "document",
                "family",
                "calendar",
                "system",
            ],
            default: "system",
            index: true,
        },

        priority: {
            type: String,
            enum: ["low", "medium", "high", "critical"],
            default: "medium",
            index: true,
        },

        readAt: {
            type: Date,
            default: null,
            index: true,
        },

        dismissedAt: {
            type: Date,
            default: null,
            index: true,
        },

        actionUrl: {
            type: String,
            trim: true,
            maxlength: 500,
            default: "",
        },

        sourceType: {
            type: String,
            trim: true,
            maxlength: 80,
            default: "",
        },

        sourceId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
        },

        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },

        dedupeKey: {
            type: String,
            trim: true,
            maxlength: 250,
            default: null,
        },

        expiresAt: {
            type: Date,
            default: null,
        },

        emailDeliveryStatus: {
            type: String,
            enum: ["pending", "sending", "sent", "failed", "skipped"],
            default: "pending",
        },
        emailAttempts: { type: Number, default: 0 },
        emailRetryAt: { type: Date, default: null },
        emailSentAt: { type: Date, default: null },
        emailErrorCode: { type: String, maxlength: 40, default: null },
        emailErrorMessage: { type: String, maxlength: 240, default: null },
        whatsappDeliveryStatus: {
            type: String,
            enum: ["pending", "sending", "queued", "sent", "delivered", "read", "failed", "skipped"],
            default: "pending",
        },
        whatsappAttempts: { type: Number, default: 0 },
        whatsappRetryAt: { type: Date, default: null },
        whatsappSentAt: { type: Date, default: null },
        whatsappQueuedAt: { type: Date, default: null },
        whatsappDeliveredAt: { type: Date, default: null },
        whatsappReadAt: { type: Date, default: null },
        whatsappProviderMessageSid: { type: String, maxlength: 40, default: null },
        whatsappErrorCode: { type: String, maxlength: 40, default: null },
        whatsappErrorMessage: { type: String, maxlength: 240, default: null },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Efficient user-specific notification queries.
notificationSchema.index({
    user: 1,
    createdAt: -1,
});

notificationSchema.index({
    user: 1,
    readAt: 1,
    dismissedAt: 1,
    createdAt: -1,
});

// Prevent duplicate notifications when a dedupeKey is supplied.
notificationSchema.index(
    { user: 1, dedupeKey: 1 },
    {
        unique: true,
        partialFilterExpression: {
            dedupeKey: { $type: "string" },
        },
    }
);

notificationSchema.index({ emailDeliveryStatus: 1, emailRetryAt: 1, emailAttempts: 1 });
notificationSchema.index({ whatsappDeliveryStatus: 1, whatsappRetryAt: 1, whatsappAttempts: 1 });

// Automatically remove records after their expiry date.
notificationSchema.index(
    { expiresAt: 1 },
    {
        expireAfterSeconds: 0,
        partialFilterExpression: {
            expiresAt: { $type: "date" },
        },
    }
);

const Notification =
    mongoose.models.Notification ||
    mongoose.model("Notification", notificationSchema);

export default Notification;
