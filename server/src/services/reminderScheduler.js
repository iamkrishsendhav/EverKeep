import Asset from "../models/Asset.js";
import CalendarEvent from "../models/CalendarEvent.js";
import Subscription from "../models/subscription.model.js";
import Warranty from "../models/Warranty.js";
import { createNotificationForUser, retryNotificationDeliveries } from "./notification.service.js";

const DAY = 24 * 60 * 60 * 1000;
const INTERVAL = 5 * 60 * 1000;
let timer;
let running = false;

const categoryFromEvent = (type) => ["warranty", "subscription"].includes(type) ? type : "calendar";

export const processDueReminders = async (now = new Date()) => {
    const horizon = new Date(now.getTime() + 366 * DAY);
    await retryNotificationDeliveries(now);
    const [events, subscriptions, assets, warranties] = await Promise.all([
        CalendarEvent.find({ status: "upcoming", "reminder.enabled": true, startDate: { $gt: now, $lte: horizon } })
            .select("_id owner title type startDate reminder priority").limit(1000).lean(),
        Subscription.find({ status: "active", autoRenew: true, reminderDays: { $gt: 0 }, nextBillingDate: { $gt: now, $lte: horizon } })
            .select("_id user name provider nextBillingDate reminderDays").limit(1000).lean(),
        Asset.find({ status: "Active", reminderEnabled: true, warrantyExpiry: { $gt: now, $lte: horizon } })
            .select("_id owner name warrantyExpiry").limit(1000).lean(),
        Warranty.find({ expiryDate: { $gt: now, $lte: horizon } })
            .select("_id owner title expiryDate asset").limit(1000).lean(),
    ]);

    let created = 0;
    const linkedWarrantyDates = new Set(warranties.filter((item) => item.asset).map((item) => `${item.asset}:${new Date(item.expiryDate).toISOString()}`));
    const create = async (payload, dueAt) => {
        if (dueAt > now) return;
        const notification = await createNotificationForUser(payload);
        if (notification) created += 1;
    };

    for (const event of events) {
        const dueAt = new Date(new Date(event.startDate).getTime() - (event.reminder?.minutesBefore || 0) * 60_000);
        await create({
            user: event.owner, title: `Upcoming: ${event.title}`,
            message: `Your ${event.type || "calendar"} event is coming up.`,
            category: categoryFromEvent(event.type), priority: event.priority || "medium",
            actionUrl: "/dashboard/calendar", sourceType: "CalendarEvent", sourceId: event._id,
            dedupeKey: `calendar:${event._id}:${new Date(event.startDate).toISOString()}:${event.reminder?.minutesBefore || 0}`,
        }, dueAt);
    }

    for (const item of subscriptions) {
        const dueAt = new Date(new Date(item.nextBillingDate).getTime() - item.reminderDays * DAY);
        await create({
            user: item.user, title: `Renewal reminder: ${item.name}`,
            message: `${item.provider || item.name} is coming up for renewal.`,
            category: "subscription", priority: "medium", actionUrl: "/dashboard/subscriptions",
            sourceType: "Subscription", sourceId: item._id,
            dedupeKey: `subscription:${item._id}:${new Date(item.nextBillingDate).toISOString()}:${item.reminderDays}`,
        }, dueAt);
    }

    for (const asset of assets) {
        if (linkedWarrantyDates.has(`${asset._id}:${new Date(asset.warrantyExpiry).toISOString()}`)) continue;
        const dueAt = new Date(new Date(asset.warrantyExpiry).getTime() - 30 * DAY);
        await create({
            user: asset.owner, title: `Warranty expiring: ${asset.name}`,
            message: `The warranty for ${asset.name} expires in about 30 days.`,
            category: "warranty", priority: "medium", actionUrl: "/dashboard/assets",
            sourceType: "Asset", sourceId: asset._id,
            dedupeKey: `asset-warranty:${asset._id}:${new Date(asset.warrantyExpiry).toISOString()}`,
        }, dueAt);
    }

    for (const warranty of warranties) {
        const dueAt = new Date(new Date(warranty.expiryDate).getTime() - 30 * DAY);
        await create({
            user: warranty.owner, title: `Warranty expiring: ${warranty.title}`,
            message: "This warranty expires in about 30 days.",
            category: "warranty", priority: "medium", actionUrl: "/dashboard/warranty",
            sourceType: "Warranty", sourceId: warranty._id,
            dedupeKey: `warranty:${warranty._id}:${new Date(warranty.expiryDate).toISOString()}`,
        }, dueAt);
    }

    return { created, scanned: events.length + subscriptions.length + assets.length + warranties.length };
};

export const startReminderScheduler = () => {
    if (timer || process.env.NOTIFICATION_SCHEDULER_ENABLED === "false") return;
    const run = async () => {
        if (running) return;
        running = true;
        try {
            const result = await processDueReminders();
            if (result.created) console.info(`Reminder scheduler created ${result.created} notification(s).`);
        } catch (error) {
            console.error("Reminder scheduler run failed:", error.message);
        } finally {
            running = false;
        }
    };
    void run();
    timer = setInterval(run, INTERVAL);
    timer.unref?.();
};

export const stopReminderScheduler = () => {
    if (timer) clearInterval(timer);
    timer = undefined;
};
