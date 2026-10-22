import twilio from "twilio";
import Notification from "../models/Notification.js";
import User from "../models/user.model.js";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const MAX_ATTEMPTS = 5;
const STALE_DELIVERY_MS = 15 * 60_000;
const RETRY_BASE_MINUTES = 5;
const E164_PATTERN = /^\+[1-9]\d{7,14}$/;
const getWhatsAppSender = () => {
    const value = process.env.TWILIO_WHATSAPP_FROM?.trim() || "";
    const number = value.startsWith("whatsapp:") ? value.slice("whatsapp:".length) : value;
    return E164_PATTERN.test(number) ? { value, number } : null;
};
const getStatusCallbackUrl = () => {
    const value = process.env.TWILIO_STATUS_CALLBACK_URL?.trim();
    if (!value || !process.env.TWILIO_AUTH_TOKEN) return null;
    try {
        const url = new URL(value);
        if (url.protocol === "https:" || (url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname))) return value;
    } catch {}
    return null;
};

const getTwilioCredentials = () => {
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
        return { accountSid: process.env.TWILIO_ACCOUNT_SID, credential: process.env.TWILIO_AUTH_TOKEN };
    }
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_API_KEY && process.env.TWILIO_API_SECRET) {
        return {
            accountSid: process.env.TWILIO_ACCOUNT_SID,
            credential: process.env.TWILIO_API_KEY,
            secret: process.env.TWILIO_API_SECRET,
        };
    }
    return null;
};

export const getEmailDeliveryAvailability = () => Boolean(process.env.RESEND_API_KEY?.trim() && process.env.NOTIFICATION_EMAIL_FROM?.trim());
const isWhatsAppSandbox = () => {
    const configuredSender = getWhatsAppSender()?.number;
    return process.env.TWILIO_WHATSAPP_SANDBOX === "true" ||
        configuredSender === "+14155238886" ||
        Boolean(process.env.TWILIO_WHATSAPP_FROM?.toLowerCase().includes("sandbox"));
};
export const getWhatsAppDeliveryAvailability = () => Boolean(getTwilioCredentials() &&
    getWhatsAppSender() &&
    (isWhatsAppSandbox() || process.env.TWILIO_WHATSAPP_CONTENT_SID?.trim()));

export const getNotificationDeliveryStatus = () => ({
    emailConfigured: getEmailDeliveryAvailability(),
    whatsappConfigured: getWhatsAppDeliveryAvailability(),
    whatsappSandbox: isWhatsAppSandbox(),
    whatsappCredentialsConfigured: Boolean(getTwilioCredentials() && getWhatsAppSender()),
    whatsappTemplateConfigured: Boolean(process.env.TWILIO_WHATSAPP_CONTENT_SID?.trim()),
    whatsappScheduledDeliveryReady: Boolean(getWhatsAppDeliveryAvailability() && process.env.TWILIO_WHATSAPP_CONTENT_SID?.trim()),
    whatsappStatusCallbackConfigured: Boolean(getStatusCallbackUrl()),
});

const getTwilioClient = () => {
    const credentials = getTwilioCredentials();
    if (!credentials) return null;
    if (credentials.secret) {
        return twilio(credentials.credential, credentials.secret, { accountSid: credentials.accountSid });
    }
    return twilio(credentials.accountSid, credentials.credential);
};

const setDeliveryState = async (notificationId, channel, status, fields = {}) => {
    await Notification.updateOne({ _id: notificationId }, {
        $set: {
            [`${channel}DeliveryStatus`]: status,
            [`${channel}RetryAt`]: null,
            ...fields,
        },
    });
};

const claimDelivery = async (notificationId, channel, now = new Date()) => {
    const statusField = `${channel}DeliveryStatus`;
    const attemptsField = `${channel}Attempts`;
    const retryField = `${channel}RetryAt`;
    return Notification.findOneAndUpdate({
        _id: notificationId,
        [attemptsField]: { $lt: MAX_ATTEMPTS },
        $or: [
            { [statusField]: "pending" },
            { [statusField]: "failed", [retryField]: { $lte: now } },
            { [statusField]: "sending", updatedAt: { $lte: new Date(now.getTime() - STALE_DELIVERY_MS) } },
        ],
    }, {
        $set: { [statusField]: "sending", [`${channel}ErrorCode`]: null, [`${channel}ErrorMessage`]: null },
        $inc: { [attemptsField]: 1 },
    }, { new: true }).lean();
};

const canDeliver = (user, notification, channel, testMode) => {
    const preferences = user?.notificationPreferences;
    if (!user || !preferences) return false;
    if (channel === "email") {
        return getEmailDeliveryAvailability() && user.isEmailVerified && preferences.emailEnabled &&
            (testMode || preferences.emailCategories?.includes(notification.category));
    }
    const sandboxFreeformTest = testMode && isWhatsAppSandbox() && !process.env.TWILIO_WHATSAPP_CONTENT_SID?.trim();
    return getWhatsAppDeliveryAvailability() && E164_PATTERN.test(user.phoneNumber || "") &&
        preferences.whatsappEnabled && Boolean(preferences.whatsappConsentAt) &&
        (sandboxFreeformTest || Boolean(process.env.TWILIO_WHATSAPP_CONTENT_SID?.trim())) &&
        (testMode || preferences.whatsappCategories?.includes(notification.category));
};

const providerFailure = (channel, error) => {
    const code = String(error?.code || error?.statusCode || error?.status || "PROVIDER_ERROR").slice(0, 40);
    const status = Number(error?.statusCode || error?.status);
    const retryable = status === 429 || status >= 500 || ["ETIMEDOUT", "ECONNRESET", "EAI_AGAIN", "ENOTFOUND"].includes(error?.code) ||
        (channel === "whatsapp" && String(error?.code) === "20429");
    let message = "Delivery failed. Check provider settings and recipient eligibility.";
    if (channel === "whatsapp" && ["21211", "21614"].includes(String(error?.code))) message = "The registered phone number is invalid or cannot receive WhatsApp messages.";
    if (channel === "whatsapp" && ["63007", "63015", "63016"].includes(String(error?.code))) message = "Join the Twilio WhatsApp Sandbox first; business-initiated messages also need an approved template.";
    if (status === 401 || status === 403 || String(error?.code) === "20003") message = "Provider authentication failed. Check backend credentials.";
    if (status === 429 || String(error?.code) === "20429") message = "The provider rate limit was reached; delivery will be retried.";
    if (retryable) message = "Temporary provider failure; delivery will be retried.";
    return { code, message, retryable };
};

const recordFailure = async (notification, channel, error) => {
    const failure = providerFailure(channel, error);
    const attempts = notification[`${channel}Attempts`];
    const retryAt = failure.retryable && attempts < MAX_ATTEMPTS
        ? new Date(Date.now() + RETRY_BASE_MINUTES * (2 ** (attempts - 1)) * 60_000)
        : null;
    await setDeliveryState(notification._id, channel, "failed", {
        [`${channel}ErrorCode`]: failure.code,
        [`${channel}ErrorMessage`]: failure.message,
        [`${channel}RetryAt`]: retryAt,
    });
    console.warn(`Notification ${channel} delivery failed (${failure.code}).`);
};

export const deliverNotificationChannel = async (notificationId, channel, { testMode = false } = {}) => {
    if (!["email", "whatsapp"].includes(channel)) throw new TypeError("Unsupported notification channel.");
    const notification = await claimDelivery(notificationId, channel);
    if (!notification) return null;

    const contactFields = channel === "email" ? "email isEmailVerified notificationPreferences" : "phoneNumber notificationPreferences";
    const user = await User.findById(notification.user).select(contactFields).lean();
    if (!canDeliver(user, notification, channel, testMode)) {
        await setDeliveryState(notification._id, channel, "skipped", {
            [`${channel}ErrorMessage`]: null,
            [`${channel}ErrorCode`]: null,
        });
        return { status: "skipped", reason: "not_configured_or_not_enabled" };
    }

    try {
        if (channel === "email") {
            const response = await fetch(RESEND_ENDPOINT, {
                method: "POST",
                headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
                body: JSON.stringify({
                    from: process.env.NOTIFICATION_EMAIL_FROM,
                    to: [user.email],
                    subject: notification.title,
                    text: `${notification.message}${notification.actionUrl ? `\n\nOpen EverKeep: ${process.env.CLIENT_URL || ""}${notification.actionUrl}` : ""}`,
                }),
                signal: AbortSignal.timeout(10_000),
            });
            if (!response.ok) throw Object.assign(new Error("Email provider request failed."), { status: response.status });
        } else {
            const from = getWhatsAppSender()?.value;
            if (!from) throw Object.assign(new Error("Invalid WhatsApp sender configuration."), { code: "INVALID_SENDER" });
            const client = getTwilioClient();
            const body = `${notification.title}: ${notification.message}`.slice(0, 1500);
            const whatsappPayload = {
                from: from.startsWith("whatsapp:") ? from : `whatsapp:${from}`,
                to: `whatsapp:${user.phoneNumber}`,
            };
            if (process.env.TWILIO_WHATSAPP_CONTENT_SID?.trim()) {
                whatsappPayload.contentSid = process.env.TWILIO_WHATSAPP_CONTENT_SID.trim();
                whatsappPayload.contentVariables = JSON.stringify({ "1": notification.title, "2": notification.message });
            } else {
                whatsappPayload.body = body;
            }
            const statusCallback = getStatusCallbackUrl();
            if (statusCallback) whatsappPayload.statusCallback = statusCallback;
            const message = await client.messages.create(whatsappPayload);
            const initialStatus = ["sent", "delivered"].includes(message.status) ? message.status : "queued";
            await setDeliveryState(notification._id, channel, initialStatus, {
                whatsappQueuedAt: new Date(),
                ...(initialStatus === "sent" || initialStatus === "delivered" ? { whatsappSentAt: new Date() } : {}),
                ...(initialStatus === "delivered" ? { whatsappDeliveredAt: new Date() } : {}),
                whatsappProviderMessageSid: message.sid || null,
            });
            return { status: initialStatus };
        }
        await setDeliveryState(notification._id, channel, "sent", {
            [`${channel}SentAt`]: new Date(),
            [`${channel}ErrorCode`]: null,
            [`${channel}ErrorMessage`]: null,
        });
        return { status: "sent" };
    } catch (error) {
        await recordFailure(notification, channel, error);
        const failure = providerFailure(channel, error);
        return { status: "failed", code: failure.code, message: failure.message };
    }
};

export const deliverEmail = (notificationId) => deliverNotificationChannel(notificationId, "email");
export const deliverWhatsApp = (notificationId) => deliverNotificationChannel(notificationId, "whatsapp");

export const createNotificationForUser = async (payload, { channels = ["email", "whatsapp"], dispatch = true } = {}) => {
    try {
        const notification = await Notification.create(payload);
        for (const channel of ["email", "whatsapp"]) {
            if (!channels.includes(channel)) {
                await setDeliveryState(notification._id, channel, "skipped");
            } else if (dispatch) {
                const deliver = channel === "email" ? deliverEmail : deliverWhatsApp;
                void deliver(notification._id).catch(() => console.warn(`Notification ${channel} delivery could not be started.`));
            }
        }
        return notification;
    } catch (error) {
        if (error?.code === 11000) return null;
        throw error;
    }
};

export const sendTestNotification = async (userId, channel) => {
    const lastTest = await Notification.findOne({
        user: userId,
        sourceType: "NotificationTest",
        "metadata.channel": channel,
        createdAt: { $gt: new Date(Date.now() - 60_000) },
    }).select("_id").lean();
    if (lastTest) {
        const error = new Error("Please wait one minute before sending another test notification.");
        error.statusCode = 429;
        throw error;
    }

    let notification;
    try {
        notification = await Notification.create({
            user: userId,
            title: "EverKeep delivery test",
            message: "This test confirms your notification delivery settings.",
            category: "system",
            priority: "low",
            actionUrl: "/dashboard/notifications",
            sourceType: "NotificationTest",
            dedupeKey: `test:${channel}:${userId}:${Math.floor(Date.now() / 60_000)}`,
            metadata: { channel },
            emailDeliveryStatus: channel === "email" ? "pending" : "skipped",
            whatsappDeliveryStatus: channel === "whatsapp" ? "pending" : "skipped",
        });
    } catch (error) {
        if (error?.code !== 11000) throw error;
        const rateLimit = new Error("Please wait one minute before sending another test notification.");
        rateLimit.statusCode = 429;
        throw rateLimit;
    }
    const result = await deliverNotificationChannel(notification._id, channel, { testMode: true });
    return { notification: await Notification.findById(notification._id).lean(), result };
};

export const retryNotificationDeliveries = async (now = new Date()) => {
    const results = await Promise.all(["email", "whatsapp"].map(async (channel) => {
        if (channel === "email" ? !getEmailDeliveryAvailability() : !getWhatsAppDeliveryAvailability()) return 0;
        const statusField = `${channel}DeliveryStatus`;
        const retryField = `${channel}RetryAt`;
        const attemptsField = `${channel}Attempts`;
        const pending = await Notification.find({
            [attemptsField]: { $lt: MAX_ATTEMPTS },
            $or: [
                { [statusField]: "pending", createdAt: { $lte: new Date(now.getTime() - 2 * 60_000) } },
                { [statusField]: "failed", [retryField]: { $lte: now } },
                { [statusField]: "sending", updatedAt: { $lte: new Date(now.getTime() - STALE_DELIVERY_MS) } },
            ],
        }).select("_id").limit(50).lean();
        const deliver = channel === "email" ? deliverEmail : deliverWhatsApp;
        await Promise.allSettled(pending.map(({ _id }) => deliver(_id)));
        return pending.length;
    }));
    return results.reduce((sum, count) => sum + count, 0);
};

export const retryNotificationEmails = retryNotificationDeliveries;
