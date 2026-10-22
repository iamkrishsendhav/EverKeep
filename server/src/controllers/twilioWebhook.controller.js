import twilio from "twilio";
import Notification from "../models/Notification.js";

const STATUS_RANK = { pending: 0, sending: 1, queued: 2, sent: 3, failed: 4, delivered: 5, read: 6, skipped: 6 };

export const handleTwilioMessageStatus = async (req, res) => {
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const callbackUrl = process.env.TWILIO_STATUS_CALLBACK_URL;
    const signature = req.get("X-Twilio-Signature");
    if (!authToken || !callbackUrl || !signature || !twilio.validateRequest(authToken, signature, callbackUrl, req.body || {})) {
        return res.sendStatus(403);
    }

    const sid = req.body?.MessageSid;
    const providerStatus = String(req.body?.MessageStatus || "").toLowerCase();
    const status = req.body?.EventType === "READ"
        ? "read"
        : ({ accepted: "queued", queued: "queued", sending: "sending", sent: "sent", delivered: "delivered", failed: "failed", undelivered: "failed" })[providerStatus];
    if (typeof sid !== "string" || !status) return res.sendStatus(204);

    const notification = await Notification.findOne({ whatsappProviderMessageSid: sid })
        .select("whatsappDeliveryStatus whatsappAttempts")
        .lean();
    if (!notification) return res.sendStatus(204);
    if ((STATUS_RANK[status] ?? 0) < (STATUS_RANK[notification.whatsappDeliveryStatus] ?? 0)) return res.sendStatus(204);

    const now = new Date();
    const errorCode = req.body?.ErrorCode ? String(req.body.ErrorCode).slice(0, 40) : null;
    const retryAt = status === "failed" && errorCode === "20429" && notification.whatsappAttempts < 5
        ? new Date(now.getTime() + 5 * 60_000)
        : null;
    const update = {
        whatsappDeliveryStatus: status,
        whatsappRetryAt: retryAt,
        whatsappErrorCode: status === "failed" ? errorCode || "TWILIO_DELIVERY_FAILED" : null,
        whatsappErrorMessage: status === "failed"
            ? errorCode === "63015" ? "The recipient has not joined this Twilio WhatsApp Sandbox." :
                errorCode === "63016" ? "An approved WhatsApp template is required outside the customer service window." :
                    "Twilio reported that WhatsApp delivery failed."
            : null,
    };
    if (status === "sent" || status === "delivered") update.whatsappSentAt = now;
    if (status === "delivered") update.whatsappDeliveredAt = now;
    if (status === "read") update.whatsappReadAt = now;
    await Notification.updateOne({ _id: notification._id, whatsappDeliveryStatus: notification.whatsappDeliveryStatus }, { $set: update });
    return res.sendStatus(204);
};
