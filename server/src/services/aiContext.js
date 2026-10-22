import Asset from "../models/Asset.js";
import Warranty from "../models/Warranty.js";
import Subscription from "../models/subscription.model.js";
import Document from "../models/Document.js";
import CalendarEvent from "../models/CalendarEvent.js";
import Family from "../models/Family.js";

// ============================================================================
// HELPERS
// ============================================================================

const formatDate = (date) => {
    if (!date) {
        return null;
    }

    return date instanceof Date ? date.toISOString() : date;
};

// ============================================================================
// ASSET CONTEXT
// ============================================================================

const getAssetContext = async (userId) => {
    const assets = await Asset.find({
        owner: userId,
    })
        .select(
            "name category brand model purchaseDate purchasePrice warrantyExpiry serialNumber notes reminderEnabled status",
        )
        .sort({
            createdAt: -1,
        })
        .lean();

    return assets.map((asset) => ({
        name: asset.name || "",
        category: asset.category || "",
        brand: asset.brand || "",
        model: asset.model || "",

        purchaseDate: formatDate(asset.purchaseDate),

        purchasePrice: asset.purchasePrice ?? 0,

        warrantyExpiry: formatDate(asset.warrantyExpiry),

        serialNumber: asset.serialNumber || "",

        notes: asset.notes || "",

        reminderEnabled: asset.reminderEnabled ?? true,

        status: asset.status || "Active",
    }));
};

// ============================================================================
// WARRANTY CONTEXT
// ============================================================================

const getWarrantyContext = async (userId) => {
    const warranties = await Warranty.find({
        owner: userId,
    })
        .populate("asset", "name brand model")
        .select("title provider warrantyNumber startDate expiryDate notes asset")
        .sort({
            expiryDate: 1,
        })
        .lean();

    return warranties.map((warranty) => ({
        title: warranty.title || "",

        provider: warranty.provider || "",

        warrantyNumber: warranty.warrantyNumber || "",

        startDate: formatDate(warranty.startDate),

        expiryDate: formatDate(warranty.expiryDate),

        notes: warranty.notes || "",

        asset: warranty.asset
            ? {
                name: warranty.asset.name || "",

                brand: warranty.asset.brand || "",

                model: warranty.asset.model || "",
            }
            : null,
    }));
};

// ============================================================================
// SUBSCRIPTION CONTEXT
// ============================================================================

const getSubscriptionContext = async (userId) => {
    const subscriptions = await Subscription.find({
        user: userId,
    })
        .populate("asset", "name brand model category")
        .select(
            "name provider plan category amount currency billingCycle startDate nextBillingDate autoRenew status paymentMethod notes reminderDays asset",
        )
        .sort({
            nextBillingDate: 1,
        })
        .lean();

    return subscriptions.map((subscription) => ({
        name: subscription.name || "",

        provider: subscription.provider || "",

        plan: subscription.plan || "",

        category: subscription.category || "",

        amount: subscription.amount ?? 0,

        currency: subscription.currency || "",

        billingCycle: subscription.billingCycle || "",

        startDate: formatDate(subscription.startDate),

        nextBillingDate: formatDate(subscription.nextBillingDate),

        autoRenew: subscription.autoRenew ?? false,

        status: subscription.status || "",

        paymentMethod: subscription.paymentMethod || "",

        notes: subscription.notes || "",

        reminderDays: subscription.reminderDays ?? 0,

        asset: subscription.asset
            ? {
                name: subscription.asset.name || "",

                brand: subscription.asset.brand || "",

                model: subscription.asset.model || "",

                category: subscription.asset.category || "",
            }
            : null,
    }));
};

// ============================================================================
// DOCUMENT CONTEXT
// ============================================================================

const getDocumentContext = async (userId) => {
    const documents = await Document.find({
        owner: userId,
    })
        .populate("asset", "name brand model category")
        .select(
            "name originalName fileType fileSize category asset createdAt updatedAt",
        )
        .sort({
            createdAt: -1,
        })
        .lean();

    return documents.map((document) => ({
        name: document.name || "",

        originalName: document.originalName || "",

        fileType: document.fileType || "",

        fileSize: document.fileSize ?? 0,

        category: document.category || "Other",

        asset: document.asset
            ? {
                name: document.asset.name || "",

                brand: document.asset.brand || "",

                model: document.asset.model || "",

                category: document.asset.category || "",
            }
            : null,

        createdAt: formatDate(document.createdAt),

        updatedAt: formatDate(document.updatedAt),
    }));
};

// ============================================================================
// CALENDAR CONTEXT
// ============================================================================

const getCalendarContext = async (userId) => {
    const events = await CalendarEvent.find({
        owner: userId,
    })
        .populate("asset", "name brand model category")
        .populate("warranty", "title provider expiryDate")
        .populate("subscription", "name provider nextBillingDate")
        .select(
            "title description type startDate endDate allDay priority status asset warranty subscription reminder location notes",
        )
        .sort({
            startDate: 1,
        })
        .lean();

    return events.map((event) => ({
        title: event.title || "",

        description: event.description || "",

        type: event.type || "custom",

        startDate: formatDate(event.startDate),

        endDate: formatDate(event.endDate),

        allDay: event.allDay ?? false,

        priority: event.priority || "medium",

        status: event.status || "upcoming",

        asset: event.asset
            ? {
                name: event.asset.name || "",

                brand: event.asset.brand || "",

                model: event.asset.model || "",

                category: event.asset.category || "",
            }
            : null,

        warranty: event.warranty
            ? {
                title: event.warranty.title || "",

                provider: event.warranty.provider || "",

                expiryDate: formatDate(event.warranty.expiryDate),
            }
            : null,

        subscription: event.subscription
            ? {
                name: event.subscription.name || "",

                provider: event.subscription.provider || "",

                nextBillingDate: formatDate(event.subscription.nextBillingDate),
            }
            : null,

        reminder: event.reminder
            ? {
                enabled: event.reminder.enabled ?? false,

                minutesBefore: event.reminder.minutesBefore ?? 0,
            }
            : {
                enabled: false,
                minutesBefore: 0,
            },

        location: event.location || "",

        notes: event.notes || "",
    }));
};

const getFamilyContext = async (userId) => {
    const family = await Family.findOne({
        $or: [{ owner: userId }, { "members.user": userId }],
    })
        .select("name members.user members.role members.relationship members.status")
        .populate("members.user", "name")
        .lean();

    if (!family) return [];
    return [{
        name: family.name || "",
        members: (family.members || [])
            .filter((member) => member.status === "Active")
            .map((member) => ({
                name: member.user?.name || "",
                role: member.role || "Member",
                relationship: member.relationship || "Family",
            })),
    }];
};

// ============================================================================
// BUILD EVERKEEP AI CONTEXT
// ============================================================================
//
// Only authenticated user's own records are loaded.
//
// Internal database identifiers, ownership fields, sharing member IDs,
// URLs and storage implementation details are intentionally excluded.
//
// ============================================================================

export const buildAIContext = async (userId, requestedModules = null) => {
    if (!userId) {
        const error = new Error("User authentication is required.");

        error.statusCode = 401;

        throw error;
    }

    const getters = {
        assets: getAssetContext,
        warranties: getWarrantyContext,
        subscriptions: getSubscriptionContext,
        documents: getDocumentContext,
        calendarEvents: getCalendarContext,
        family: getFamilyContext,
    };
    const modules = requestedModules
        ? [...new Set(requestedModules)].filter((module) => getters[module])
        : Object.keys(getters);
    const values = await Promise.all(modules.map((module) => getters[module](userId)));

    return Object.fromEntries(modules.map((module, index) => [module, values[index]]));
};
