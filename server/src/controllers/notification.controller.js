import mongoose from "mongoose";
import Notification from "../models/Notification.js";
import User from "../models/user.model.js";
import {
    createNotificationForUser,
    getEmailDeliveryAvailability,
    getNotificationDeliveryStatus,
    sendTestNotification,
} from "../services/notification.service.js";

const ALLOWED_CATEGORIES = ["warranty", "subscription", "asset", "document", "family", "calendar", "system"];
const ALLOWED_PRIORITIES = ["low", "medium", "high", "critical"];
const getUserId = (req) => req.user?._id || req.user?.id;
const sendError = (res, status, message) => res.status(status).json({ success: false, message });
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const activeNotificationFilter = (userId) => ({
    user: userId,
    dismissedAt: null,
    $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }],
});

export const getNotifications = async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) return sendError(res, 401, "Authentication required.");

        const parsePositiveInteger = (value, fallback, max) => {
            if (value === undefined) return fallback;
            if (!/^\d+$/.test(String(value))) return null;
            const parsed = Number(value);
            return Number.isSafeInteger(parsed) && parsed >= 1 && parsed <= max ? parsed : null;
        };
        const page = parsePositiveInteger(req.query.page, 1, 1_000_000);
        const limit = parsePositiveInteger(req.query.limit, 20, 100);
        if (page === null || limit === null || (page - 1) * limit > 100_000) {
            return sendError(res, 400, "Page and limit must be valid positive integers (limit at most 100).");
        }

        const baseFilter = activeNotificationFilter(userId);
        const filter = { ...baseFilter };
        if (req.query.category !== undefined) {
            if (!ALLOWED_CATEGORIES.includes(req.query.category)) {
                return sendError(res, 400, "Invalid notification category.");
            }
            filter.category = req.query.category;
        }
        if (req.query.unread === "true") filter.readAt = null;
        else if (req.query.unread === "false") filter.readAt = { $ne: null };
        else if (req.query.unread !== undefined) return sendError(res, 400, "Unread must be true or false.");

        if (req.query.search !== undefined) {
            if (typeof req.query.search !== "string" || req.query.search.length > 100) {
                return sendError(res, 400, "Search must be a string of at most 100 characters.");
            }
            const search = req.query.search.trim();
            if (search) {
                const expression = new RegExp(escapeRegex(search), "i");
                filter.$and = [
                    ...(filter.$and || []),
                    { $or: [{ title: expression }, { message: expression }, { category: expression }] },
                ];
            }
        }

        const categoryCounts = await Promise.all(
            ALLOWED_CATEGORIES.map((category) =>
                Notification.countDocuments({ ...baseFilter, category })
            )
        );
        const [notifications, total, unread, read, important] = await Promise.all([
            Notification.find(filter)
                .sort({ createdAt: -1, _id: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            Notification.countDocuments(filter),
            Notification.countDocuments({ ...baseFilter, readAt: null }),
            Notification.countDocuments({ ...baseFilter, readAt: { $ne: null } }),
            Notification.countDocuments({ ...baseFilter, priority: { $in: ["high", "critical"] } }),
        ]);

        return res.status(200).json({
            success: true,
            data: {
                notifications,
                unreadCount: unread,
                counts: {
                    total: unread + read,
                    unread,
                    read,
                    important,
                    categories: Object.fromEntries(ALLOWED_CATEGORIES.map((category, index) => [category, categoryCounts[index]])),
                },
                pagination: { page, limit, total, pages: Math.ceil(total / limit) },
            },
        });
    } catch {
        console.error("Get notifications failed.");
        return sendError(res, 500, "Unable to fetch notifications.");
    }
};

export const getUnreadCount = async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) return sendError(res, 401, "Authentication required.");
        const unreadCount = await Notification.countDocuments({ ...activeNotificationFilter(userId), readAt: null });
        return res.status(200).json({ success: true, data: { unreadCount } });
    } catch {
        console.error("Get unread count failed.");
        return sendError(res, 500, "Unable to fetch unread count.");
    }
};

export const markAllNotificationsRead = async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) return sendError(res, 401, "Authentication required.");
        const result = await Notification.updateMany(
            { ...activeNotificationFilter(userId), readAt: null },
            { $set: { readAt: new Date() } },
        );
        return res.status(200).json({
            success: true,
            message: "All notifications marked as read.",
            data: { modifiedCount: result.modifiedCount, unreadCount: 0 },
        });
    } catch {
        console.error("Mark all notifications read failed.");
        return sendError(res, 500, "Unable to update notifications.");
    }
};

export const markNotificationRead = async (req, res) => {
    try {
        const userId = getUserId(req);
        const { id } = req.params;
        if (!userId) return sendError(res, 401, "Authentication required.");
        if (!mongoose.isValidObjectId(id)) return sendError(res, 400, "Invalid notification ID.");
        const notification = await Notification.findOne({
            _id: id,
            ...activeNotificationFilter(userId),
        });
        if (!notification) return sendError(res, 404, "Notification not found.");
        notification.readAt = notification.readAt ? null : new Date();
        await notification.save();
        return res.status(200).json({
            success: true,
            message: notification.readAt ? "Notification marked as read." : "Notification marked as unread.",
            data: { notification },
        });
    } catch {
        console.error("Update notification read status failed.");
        return sendError(res, 500, "Unable to update notification.");
    }
};

export const dismissNotification = async (req, res) => {
    try {
        const userId = getUserId(req);
        const { id } = req.params;
        if (!userId) return sendError(res, 401, "Authentication required.");
        if (!mongoose.isValidObjectId(id)) return sendError(res, 400, "Invalid notification ID.");
        const notification = await Notification.findOneAndUpdate(
            { _id: id, ...activeNotificationFilter(userId) },
            { $set: { dismissedAt: new Date() } },
            { new: true, runValidators: true },
        );
        if (!notification) return sendError(res, 404, "Notification not found.");
        return res.status(200).json({ success: true, message: "Notification dismissed.", data: { notification } });
    } catch {
        console.error("Dismiss notification failed.");
        return sendError(res, 500, "Unable to dismiss notification.");
    }
};

export const createNotification = async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) return sendError(res, 401, "Authentication required.");
        const {
            title, message, category = "system", priority = "medium", actionUrl = "",
            sourceType = "", sourceId = null, metadata = {}, dedupeKey = null, expiresAt = null,
        } = req.body || {};

        if (typeof title !== "string" || !title.trim() || title.trim().length > 160 ||
            typeof message !== "string" || !message.trim() || message.trim().length > 2000) {
            return sendError(res, 400, "Title and message are required and must fit their maximum lengths.");
        }
        if (!ALLOWED_CATEGORIES.includes(category)) return sendError(res, 400, "Invalid notification category.");
        if (!ALLOWED_PRIORITIES.includes(priority)) return sendError(res, 400, "Invalid notification priority.");
        if (typeof actionUrl !== "string" || actionUrl.length > 500 ||
            (actionUrl && (!actionUrl.startsWith("/") || actionUrl.startsWith("//") || actionUrl.includes("\\") || /[\u0000-\u001f]/.test(actionUrl)))) {
            return sendError(res, 400, "Action URL must be a relative application path.");
        }
        if (typeof sourceType !== "string" || sourceType.length > 80 ||
            (dedupeKey !== null && (typeof dedupeKey !== "string" || dedupeKey.length > 250))) {
            return sendError(res, 400, "Notification source or deduplication key is invalid.");
        }
        if (sourceId !== null && !mongoose.isValidObjectId(sourceId)) return sendError(res, 400, "Invalid source ID.");
        if (expiresAt !== null && (Number.isNaN(new Date(expiresAt).getTime()) || new Date(expiresAt).getTime() <= Date.now())) {
            return sendError(res, 400, "Expiry date must be a valid future date.");
        }

        const notification = await createNotificationForUser({
            user: userId,
            title: title.trim(),
            message: message.trim(),
            category,
            priority,
            actionUrl,
            sourceType,
            sourceId,
            metadata: metadata && typeof metadata === "object" && !Array.isArray(metadata) ? metadata : {},
            dedupeKey: dedupeKey?.trim() || null,
            expiresAt: expiresAt || null,
        });
        if (!notification) return sendError(res, 409, "This notification already exists.");
        return res.status(201).json({ success: true, message: "Notification created.", data: { notification } });
    } catch (error) {
        if (error?.code === 11000) return sendError(res, 409, "This notification already exists.");
        console.error("Create notification failed.");
        return sendError(res, 500, "Unable to create notification.");
    }
};

export const getNotificationPreferences = async (req, res) => {
    const userId = getUserId(req);
    if (!userId) return sendError(res, 401, "Authentication required.");
    const user = await User.findById(userId).select("notificationPreferences isEmailVerified phoneNumber").lean();
    if (!user) return sendError(res, 404, "User not found.");
    return res.json({ success: true, data: {
        preferences: user.notificationPreferences || { emailEnabled: false, emailCategories: [] },
        phoneNumber: user.phoneNumber || "",
        ...getNotificationDeliveryStatus(),
        emailConfigured: getEmailDeliveryAvailability(),
        emailVerified: Boolean(user.isEmailVerified),
    } });
};

export const updateNotificationPreferences = async (req, res) => {
    const userId = getUserId(req);
    if (!userId) return sendError(res, 401, "Authentication required.");
    const { emailEnabled, emailCategories, phoneNumber, whatsappEnabled, whatsappCategories, whatsappConsent } = req.body || {};
    if (typeof emailEnabled !== "boolean" || !Array.isArray(emailCategories) ||
        emailCategories.some((category) => !ALLOWED_CATEGORIES.includes(category))) {
        return sendError(res, 400, "Provide an emailEnabled boolean and valid emailCategories.");
    }
    if (phoneNumber !== undefined && (typeof phoneNumber !== "string" || (phoneNumber !== "" && !/^\+[1-9]\d{7,14}$/.test(phoneNumber)))) {
        return sendError(res, 400, "Phone number must use international format, such as +14155552671.");
    }
    if (whatsappEnabled !== undefined && typeof whatsappEnabled !== "boolean") return sendError(res, 400, "whatsappEnabled must be a boolean.");
    if (whatsappCategories !== undefined && (!Array.isArray(whatsappCategories) || whatsappCategories.some((category) => !ALLOWED_CATEGORIES.includes(category)))) {
        return sendError(res, 400, "Provide valid WhatsApp notification categories.");
    }
    if (whatsappEnabled && whatsappConsent !== true) return sendError(res, 400, "Explicit WhatsApp consent is required to enable delivery.");
    const existing = await User.findById(userId).select("notificationPreferences phoneNumber").lean();
    if (!existing) return sendError(res, 404, "User not found.");
    const effectivePhoneNumber = phoneNumber === undefined ? existing.phoneNumber || "" : phoneNumber.trim();
    if (whatsappEnabled && !effectivePhoneNumber) return sendError(res, 400, "Add an international phone number before enabling WhatsApp.");
    const priorPreferences = existing.notificationPreferences || {};
    const effectiveConsent = whatsappConsent === true;
    const nextPreferences = {
        ...priorPreferences,
        emailEnabled,
        emailCategories: [...new Set(emailCategories)],
    };
    if (whatsappEnabled !== undefined || whatsappCategories !== undefined) {
        nextPreferences.whatsappEnabled = effectiveConsent && (whatsappEnabled ?? priorPreferences.whatsappEnabled ?? false);
        nextPreferences.whatsappCategories = [...new Set(whatsappCategories ?? priorPreferences.whatsappCategories ?? [])];
        nextPreferences.whatsappConsentAt = effectiveConsent ? new Date() : null;
    }
    const update = { $set: { notificationPreferences: nextPreferences } };
    if (phoneNumber !== undefined) update.$set.phoneNumber = phoneNumber.trim();
    const user = await User.findByIdAndUpdate(userId, {
        ...update,
    }, { new: true, runValidators: true }).select("notificationPreferences isEmailVerified phoneNumber").lean();
    if (!user) return sendError(res, 404, "User not found.");
    return res.json({ success: true, data: {
        preferences: user.notificationPreferences,
        phoneNumber: user.phoneNumber || "",
        ...getNotificationDeliveryStatus(),
        emailConfigured: getEmailDeliveryAvailability(),
        emailVerified: Boolean(user.isEmailVerified),
    } });
};

export const createTestNotification = async (req, res) => {
    const userId = getUserId(req);
    if (!userId) return sendError(res, 401, "Authentication required.");
    const { channel } = req.body || {};
    if (!["email", "whatsapp"].includes(channel)) return sendError(res, 400, "Choose email or WhatsApp for the test.");
    try {
        const { notification, result } = await sendTestNotification(userId, channel);
        if (result?.status === "skipped") return sendError(res, 409, "Test not sent. Configure the provider and enable the channel with the required contact and consent.");
        const accepted = ["sent", "queued", "delivered"].includes(result?.status);
        const statusMessage = result?.status === "delivered"
            ? "Twilio confirmed delivery of the test message."
            : result?.status === "sent"
                ? "Twilio reports the test message was accepted by the upstream carrier; handset delivery is not confirmed."
                : result?.status === "queued"
                    ? "Twilio accepted the test message into its queue; final delivery is not confirmed."
                    : result?.message || "The provider did not confirm delivery.";
        return res.status(result?.status === "queued" ? 202 : accepted ? 200 : 502).json({
            success: accepted,
            message: channel === "whatsapp" ? statusMessage : accepted ? "Email provider accepted the test notification." : statusMessage,
            data: { notificationId: notification?._id, channel, status: result?.status, errorCode: result?.code || null },
        });
    } catch (error) {
        if (error?.statusCode === 429) return sendError(res, 429, error.message);
        console.error("Test notification could not be sent.");
        return sendError(res, error?.statusCode || 500, error?.statusCode ? error.message : "Unable to send test notification.");
    }
};
