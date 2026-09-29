import mongoose from "mongoose";

import Subscription from "../models/subscription.model.js";

import Asset from "../models/Asset.js";

import Family from "../models/Family.js";

// ============================================================================
// SUBSCRIPTION SERVICE
// ============================================================================
//
// Business logic for EverKeep subscriptions.
//
// Ownership:
//     subscription.user
//
// Family:
//     subscription.family
//
// Sharing:
//     subscription.sharing.members[]
//
// Access:
//     Owner → View + Edit + Delete
//     View  → View only
//     Edit  → View + Edit
//
// ============================================================================

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_PAGE = 1;

const DEFAULT_LIMIT = 20;

const MAX_LIMIT = 100;

// ============================================================================
// ERROR HELPER
// ============================================================================

const createServiceError = (message, statusCode = 400) => {
    const error = new Error(message);

    error.statusCode = statusCode;

    return error;
};

// ============================================================================
// USER VALIDATION
// ============================================================================

const requireUserId = (userId) => {
    if (!userId) {
        throw createServiceError("Authentication required.", 401);
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw createServiceError("Invalid user ID.", 400);
    }

    return userId;
};

// ============================================================================
// NORMALIZE ID
// ============================================================================

const normalizeId = (value) => {
    if (!value) {
        return null;
    }

    return value.toString();
};

// ============================================================================
// OBJECT ID
// ============================================================================

const toObjectId = (value) => {
    if (!value) {
        return null;
    }

    return new mongoose.Types.ObjectId(value);
};

// ============================================================================
// GET USER FAMILY
// ============================================================================

const getUserFamily = async (userId) => {
    return Family.findOne({
        status: "Active",

        $or: [
            {
                owner: userId,
            },

            {
                "members.user": userId,

                "members.status": "Active",
            },
        ],
    });
};

// ============================================================================
// GET FAMILY MEMBERSHIP
// ============================================================================

const getFamilyMembership = (family, userId) => {
    if (!family || !userId) {
        return null;
    }

    // ------------------------------------------------------------------------
    // FAMILY OWNER
    // ------------------------------------------------------------------------

    if (normalizeId(family.owner) === normalizeId(userId)) {
        return {
            isOwner: true,

            role: "Owner",

            accessLevel: "Full",

            permissions: {
                subscriptions: true,
            },
        };
    }

    // ------------------------------------------------------------------------
    // FAMILY MEMBER
    // ------------------------------------------------------------------------

    const member = family.members.find(
        (item) =>
            normalizeId(item.user) === normalizeId(userId) &&
            item.status === "Active",
    );

    if (!member) {
        return null;
    }

    return {
        isOwner: false,

        role: member.role,

        accessLevel: member.accessLevel,

        permissions: member.permissions,
    };
};

// ============================================================================
// CHECK SUBSCRIPTION ACCESS
// ============================================================================

const getSubscriptionAccess = async (subscription, userId) => {
    // ------------------------------------------------------------------------
    // OWNER
    // ------------------------------------------------------------------------

    if (normalizeId(subscription.user) === normalizeId(userId)) {
        return {
            canView: true,

            canEdit: true,

            canDelete: true,

            isOwner: true,

            isFamilyMember: false,
        };
    }

    // ------------------------------------------------------------------------
    // NO FAMILY
    // ------------------------------------------------------------------------

    if (!subscription.family) {
        return {
            canView: false,

            canEdit: false,

            canDelete: false,

            isOwner: false,

            isFamilyMember: false,
        };
    }

    // ------------------------------------------------------------------------
    // FAMILY
    // ------------------------------------------------------------------------

    const family = await Family.findById(subscription.family);

    if (!family) {
        return {
            canView: false,

            canEdit: false,

            canDelete: false,

            isOwner: false,

            isFamilyMember: false,
        };
    }

    const membership = getFamilyMembership(family, userId);

    if (!membership) {
        return {
            canView: false,

            canEdit: false,

            canDelete: false,

            isOwner: false,

            isFamilyMember: false,
        };
    }

    // ------------------------------------------------------------------------
    // FAMILY SUBSCRIPTION SHARING
    // ------------------------------------------------------------------------

    if (!subscription.sharing?.shared) {
        return {
            canView: false,

            canEdit: false,

            canDelete: false,

            isOwner: false,

            isFamilyMember: true,
        };
    }

    const sharedMember = subscription.sharing.members.find(
        (item) => normalizeId(item.user) === normalizeId(userId),
    );

    if (!sharedMember) {
        return {
            canView: false,

            canEdit: false,

            canDelete: false,

            isOwner: false,

            isFamilyMember: true,
        };
    }

    // ------------------------------------------------------------------------
    // FAMILY PERMISSION
    // ------------------------------------------------------------------------

    const canView = membership.permissions?.subscriptions !== false;

    const canEdit = canView && sharedMember.access === "Edit";

    return {
        canView,

        canEdit,

        canDelete: false,

        isOwner: false,

        isFamilyMember: true,
    };
};

// ============================================================================
// ASSERT VIEW ACCESS
// ============================================================================

const assertCanView = async (subscription, userId) => {
    const access = await getSubscriptionAccess(subscription, userId);

    if (!access.canView) {
        throw createServiceError(
            "You do not have permission to view this subscription.",
            403,
        );
    }

    return access;
};

// ============================================================================
// ASSERT EDIT ACCESS
// ============================================================================

const assertCanEdit = async (subscription, userId) => {
    const access = await getSubscriptionAccess(subscription, userId);

    if (!access.canEdit) {
        throw createServiceError(
            "You do not have permission to edit this subscription.",
            403,
        );
    }

    return access;
};

// ============================================================================
// ASSERT OWNER
// ============================================================================

const assertOwner = (subscription, userId) => {
    if (normalizeId(subscription.user) !== normalizeId(userId)) {
        throw createServiceError(
            "Only the subscription owner can perform this action.",
            403,
        );
    }
};

// ============================================================================
// RESOLVE OWNED ASSET
// ============================================================================

const resolveOwnedAsset = async (assetId, userId) => {
    if (assetId === undefined || assetId === null || assetId === "") {
        return null;
    }

    if (!mongoose.Types.ObjectId.isValid(assetId)) {
        throw createServiceError("Invalid asset ID.", 400);
    }

    const asset = await Asset.findOne({
        _id: assetId,

        owner: userId,
    }).select("_id");

    if (!asset) {
        throw createServiceError("Selected asset was not found.", 404);
    }

    return asset._id;
};

// ============================================================================
// NORMALIZE SUBSCRIPTION DATA
// ============================================================================

const normalizeSubscriptionData = (data = {}) => {
    const allowedFields = [
        "name",

        "provider",

        "plan",

        "category",

        "amount",

        "currency",

        "billingCycle",

        "startDate",

        "nextBillingDate",

        "autoRenew",

        "status",

        "asset",

        "paymentMethod",

        "notes",

        "reminderDays",
    ];

    const result = {};

    allowedFields.forEach((field) => {
        if (Object.prototype.hasOwnProperty.call(data, field)) {
            result[field] = data[field];
        }
    });

    // ------------------------------------------------------------------------
    // String normalization
    // ------------------------------------------------------------------------

    const stringFields = [
        "name",

        "provider",

        "plan",

        "currency",

        "paymentMethod",

        "notes",
    ];

    stringFields.forEach((field) => {
        if (typeof result[field] === "string") {
            result[field] = result[field].trim();
        }
    });

    // ------------------------------------------------------------------------
    // Currency
    // ------------------------------------------------------------------------

    if (result.currency) {
        result.currency = result.currency.toUpperCase();
    }

    // ------------------------------------------------------------------------
    // Amount
    // ------------------------------------------------------------------------

    if (result.amount !== undefined) {
        const amount = Number(result.amount);

        if (!Number.isFinite(amount)) {
            throw createServiceError(
                "Subscription amount must be a valid number.",
                400,
            );
        }

        if (amount < 0) {
            throw createServiceError("Subscription amount cannot be negative.", 400);
        }

        result.amount = amount;
    }

    // ------------------------------------------------------------------------
    // Reminder days
    // ------------------------------------------------------------------------

    if (result.reminderDays !== undefined) {
        const reminderDays = Number(result.reminderDays);

        if (
            !Number.isInteger(reminderDays) ||
            reminderDays < 0 ||
            reminderDays > 365
        ) {
            throw createServiceError("Reminder days must be between 0 and 365.", 400);
        }

        result.reminderDays = reminderDays;
    }

    // ------------------------------------------------------------------------
    // Dates
    // ------------------------------------------------------------------------

    if (result.startDate) {
        const date = new Date(result.startDate);

        if (Number.isNaN(date.getTime())) {
            throw createServiceError("Invalid start date.", 400);
        }
    }

    if (result.nextBillingDate) {
        const date = new Date(result.nextBillingDate);

        if (Number.isNaN(date.getTime())) {
            throw createServiceError("Invalid next billing date.", 400);
        }
    }

    // ------------------------------------------------------------------------
    // Boolean
    // ------------------------------------------------------------------------

    if (result.autoRenew !== undefined) {
        result.autoRenew = Boolean(result.autoRenew);
    }

    return result;
};

// ============================================================================
// BUILD ACCESS QUERY
// ============================================================================

const buildAccessQuery = async (userId) => {
    const family = await getUserFamily(userId);

    const conditions = [
        {
            user: userId,
        },
    ];

    if (family) {
        conditions.push({
            family: family._id,

            "sharing.shared": true,

            "sharing.members.user": userId,
        });
    }

    return {
        $or: conditions,
    };
};

// ============================================================================
// BUILD FILTER QUERY
// ============================================================================

const buildSubscriptionQuery = async (userId, filters = {}) => {
    const query = await buildAccessQuery(requireUserId(userId));

    // ------------------------------------------------------------------------
    // SEARCH
    // ------------------------------------------------------------------------

    if (filters.search?.trim()) {
        const search = filters.search.trim();

        query.$and = [
            {
                ...query,
            },

            {
                $or: [
                    {
                        name: {
                            $regex: search,

                            $options: "i",
                        },
                    },

                    {
                        provider: {
                            $regex: search,

                            $options: "i",
                        },
                    },

                    {
                        plan: {
                            $regex: search,

                            $options: "i",
                        },
                    },
                ],
            },
        ];
    }

    if (filters.status && filters.status !== "all") {
        query.status = filters.status;
    }

    if (filters.category && filters.category !== "all") {
        query.category = filters.category;
    }

    return query;
};

// ============================================================================
// CREATE SUBSCRIPTION
// ============================================================================

export const createSubscription = async (subscriptionData, userId = null) => {
    const authenticatedUserId = requireUserId(userId);

    const data = normalizeSubscriptionData(subscriptionData);

    // ------------------------------------------------------------------------
    // Owner cannot be overridden
    // ------------------------------------------------------------------------

    data.user = authenticatedUserId;

    // ------------------------------------------------------------------------
    // Asset ownership validation
    // ------------------------------------------------------------------------

    if (Object.prototype.hasOwnProperty.call(data, "asset")) {
        data.asset = await resolveOwnedAsset(data.asset, authenticatedUserId);
    }

    // ------------------------------------------------------------------------
    // Always start as personal subscription
    // ------------------------------------------------------------------------

    data.family = null;

    data.sharing = {
        shared: false,

        members: [],
    };

    return Subscription.create(data);
};

// ============================================================================
// GET ALL SUBSCRIPTIONS
// ============================================================================

export const getSubscriptions = async (userId = null, filters = {}) => {
    const query = await buildSubscriptionQuery(userId, filters);

    const page = Math.max(Number(filters.page) || DEFAULT_PAGE, 1);

    const limit = Math.min(
        Math.max(Number(filters.limit) || DEFAULT_LIMIT, 1),
        MAX_LIMIT,
    );

    const skip = (page - 1) * limit;

    const sortField = ["nextBillingDate", "createdAt", "amount", "name"].includes(
        filters.sortBy,
    )
        ? filters.sortBy
        : "nextBillingDate";

    const sortOrder = filters.sortOrder === "desc" ? -1 : 1;

    const sort = {
        [sortField]: sortOrder,
    };

    const [subscriptions, total] = await Promise.all([
        Subscription.find(query)

            .populate("asset", "name brand category")

            .populate("user", "name email profileImage")

            .populate("family", "name owner")

            .populate("sharing.members.user", "name email profileImage")

            .sort(sort)

            .skip(skip)

            .limit(limit)

            .lean(),

        Subscription.countDocuments(query),
    ]);

    return {
        subscriptions,

        pagination: {
            page,

            limit,

            total,

            pages: Math.ceil(total / limit),
        },
    };
};

// ============================================================================
// GET SINGLE SUBSCRIPTION
// ============================================================================

export const getSubscriptionById = async (subscriptionId, userId = null) => {
    const authenticatedUserId = requireUserId(userId);

    if (!mongoose.Types.ObjectId.isValid(subscriptionId)) {
        throw createServiceError("Invalid subscription ID.", 400);
    }

    const subscription = await Subscription.findById(subscriptionId);

    if (!subscription) {
        throw createServiceError("Subscription not found.", 404);
    }

    await assertCanView(subscription, authenticatedUserId);

    await subscription.populate([
        {
            path: "asset",

            select: "name brand category",
        },

        {
            path: "user",

            select: "name email profileImage",
        },

        {
            path: "family",

            select: "name owner members",
        },

        {
            path: "sharing.members.user",

            select: "name email profileImage",
        },
    ]);

    return subscription;
};

// ============================================================================
// UPDATE SUBSCRIPTION
// ============================================================================

export const updateSubscription = async (
    subscriptionId,
    subscriptionData,
    userId = null,
) => {
    const authenticatedUserId = requireUserId(userId);

    if (!mongoose.Types.ObjectId.isValid(subscriptionId)) {
        throw createServiceError("Invalid subscription ID.", 400);
    }

    const subscription = await Subscription.findById(subscriptionId);

    if (!subscription) {
        throw createServiceError("Subscription not found.", 404);
    }

    await assertCanEdit(subscription, authenticatedUserId);

    const data = normalizeSubscriptionData(subscriptionData);

    // ------------------------------------------------------------------------
    // Never allow ownership manipulation
    // ------------------------------------------------------------------------

    delete data.user;

    delete data.family;

    delete data.sharing;

    // ------------------------------------------------------------------------
    // Asset validation
    // ------------------------------------------------------------------------

    if (Object.prototype.hasOwnProperty.call(data, "asset")) {
        data.asset = await resolveOwnedAsset(data.asset, authenticatedUserId);
    }

    Object.assign(subscription, data);

    await subscription.save();

    await subscription.populate("asset", "name brand category");

    return subscription;
};

// ============================================================================
// DELETE SUBSCRIPTION
// ============================================================================

export const deleteSubscription = async (subscriptionId, userId = null) => {
    const authenticatedUserId = requireUserId(userId);

    if (!mongoose.Types.ObjectId.isValid(subscriptionId)) {
        throw createServiceError("Invalid subscription ID.", 400);
    }

    const subscription = await Subscription.findById(subscriptionId);

    if (!subscription) {
        throw createServiceError("Subscription not found.", 404);
    }

    assertOwner(subscription, authenticatedUserId);

    await subscription.deleteOne();

    return subscription;
};

// ============================================================================
// GET UPCOMING SUBSCRIPTIONS
// ============================================================================

export const getUpcomingSubscriptions = async (userId = null, days = 30) => {
    const authenticatedUserId = requireUserId(userId);

    const normalizedDays = Number(days);

    if (!Number.isFinite(normalizedDays) || normalizedDays < 0) {
        throw createServiceError("Invalid days value.", 400);
    }

    const today = new Date();

    const futureDate = new Date();

    futureDate.setDate(futureDate.getDate() + normalizedDays);

    const query = await buildAccessQuery(authenticatedUserId);

    query.status = "active";

    query.nextBillingDate = {
        $gte: today,

        $lte: futureDate,
    };

    return Subscription.find(query)

        .populate("asset", "name brand category")

        .populate("user", "name email profileImage")

        .populate("family", "name")

        .sort({
            nextBillingDate: 1,
        })

        .lean();
};

// ============================================================================
// GET SUBSCRIPTION STATS
// ============================================================================

export const getSubscriptionStats = async (userId = null) => {
    const authenticatedUserId = requireUserId(userId);

    const query = await buildAccessQuery(authenticatedUserId);

    const subscriptions = await Subscription.find(query).lean();

    // --------------------------------------------------------------------
    // STATUS GROUPS
    // --------------------------------------------------------------------

    const active = subscriptions.filter(
        (subscription) => subscription.status === "active",
    );

    const paused = subscriptions.filter(
        (subscription) => subscription.status === "paused",
    );

    const cancelled = subscriptions.filter(
        (subscription) => subscription.status === "cancelled",
    );

    const expired = subscriptions.filter(
        (subscription) => subscription.status === "expired",
    );

    // --------------------------------------------------------------------
    // MONTHLY COST
    // --------------------------------------------------------------------

    const monthlyCost = active.reduce(
        (total, subscription) => {
            const amount = Number(subscription.amount) || 0;

            switch (subscription.billingCycle) {
                case "weekly":
                    return total + amount * 4.345;

                case "monthly":
                    return total + amount;

                case "quarterly":
                    return total + amount / 3;

                case "half-yearly":
                    return total + amount / 6;

                case "yearly":
                    return total + amount / 12;

                default:
                    return total;
            }
        },

        0,
    );

    const yearlyCost = monthlyCost * 12;

    // --------------------------------------------------------------------
    // UPCOMING
    // --------------------------------------------------------------------

    const today = new Date();

    const thirtyDaysLater = new Date();

    thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);

    const upcoming = active.filter((subscription) => {
        if (!subscription.nextBillingDate) {
            return false;
        }

        const billingDate = new Date(subscription.nextBillingDate);

        return billingDate >= today && billingDate <= thirtyDaysLater;
    });

    // --------------------------------------------------------------------
    // SHARED
    // --------------------------------------------------------------------

    const shared = subscriptions.filter(
        (subscription) => subscription.sharing?.shared === true,
    );

    // --------------------------------------------------------------------
    // RESULT
    // --------------------------------------------------------------------

    return {
        total: subscriptions.length,

        active: active.length,

        paused: paused.length,

        cancelled: cancelled.length,

        expired: expired.length,

        upcoming: upcoming.length,

        shared: shared.length,

        monthlyCost: Number(monthlyCost.toFixed(2)),

        yearlyCost: Number(yearlyCost.toFixed(2)),
    };
};

// ============================================================================
// SHARE SUBSCRIPTION
// ============================================================================
//
// Owner only.
//
// Body:
//
// {
//     memberIds: [],
//     access: "View" | "Edit"
// }
//
// ============================================================================

export const shareSubscription = async (subscriptionId, userId, data = {}) => {
    const authenticatedUserId = requireUserId(userId);

    const subscription = await Subscription.findById(subscriptionId);

    if (!subscription) {
        throw createServiceError("Subscription not found.", 404);
    }

    assertOwner(subscription, authenticatedUserId);

    const family = await getUserFamily(authenticatedUserId);

    if (!family) {
        throw createServiceError("You do not have a Family workspace.", 400);
    }

    const memberIds = Array.isArray(data.memberIds) ? data.memberIds : [];

    if (memberIds.length === 0) {
        throw createServiceError("Please select at least one family member.", 400);
    }

    const access = data.access === "Edit" ? "Edit" : "View";

    const validMembers = family.members.filter(
        (member) =>
            member.status === "Active" &&
            memberIds.some((id) => normalizeId(member.user) === normalizeId(id)),
    );

    if (validMembers.length === 0) {
        throw createServiceError("No valid family members were selected.", 400);
    }

    subscription.family = family._id;

    const existingMembers = subscription.sharing?.members || [];

    validMembers.forEach((familyMember) => {
        const existing = existingMembers.find(
            (item) => normalizeId(item.user) === normalizeId(familyMember.user),
        );

        if (existing) {
            existing.access = access;

            existing.sharedAt = new Date();
        } else {
            existingMembers.push({
                user: familyMember.user,

                access,

                sharedAt: new Date(),
            });
        }
    });

    subscription.sharing = {
        shared: true,

        members: existingMembers,
    };

    await subscription.save();

    // --------------------------------------------------------------------
    // FAMILY ACTIVITY
    // --------------------------------------------------------------------

    family.activity.unshift({
        actor: toObjectId(authenticatedUserId),

        action: "SUBSCRIPTION_SHARED",

        entityType: "Subscription",

        entityId: subscription._id,

        message: `${subscription.name} was shared with family members.`,

        metadata: {
            memberIds: validMembers.map((member) => member.user),

            access,
        },

        createdAt: new Date(),
    });

    await family.save();

    return subscription;
};

// ============================================================================
// UNSHARE SUBSCRIPTION
// ============================================================================

export const unshareSubscription = async (
    subscriptionId,
    userId,
    data = {},
) => {
    const authenticatedUserId = requireUserId(userId);

    const subscription = await Subscription.findById(subscriptionId);

    if (!subscription) {
        throw createServiceError("Subscription not found.", 404);
    }

    assertOwner(subscription, authenticatedUserId);

    const memberIds = Array.isArray(data.memberIds) ? data.memberIds : [];

    // --------------------------------------------------------------------
    // Remove all sharing
    // --------------------------------------------------------------------

    if (memberIds.length === 0) {
        subscription.family = null;

        subscription.sharing = {
            shared: false,

            members: [],
        };
    } else {
        subscription.sharing.members = (subscription.sharing?.members || []).filter(
            (member) =>
                !memberIds.some((id) => normalizeId(member.user) === normalizeId(id)),
        );

        if (subscription.sharing.members.length === 0) {
            subscription.family = null;

            subscription.sharing.shared = false;
        }
    }

    await subscription.save();

    // --------------------------------------------------------------------
    // FAMILY ACTIVITY
    // --------------------------------------------------------------------

    const family = await getUserFamily(authenticatedUserId);

    if (family) {
        family.activity.unshift({
            actor: toObjectId(authenticatedUserId),

            action: "SUBSCRIPTION_UNSHARED",

            entityType: "Subscription",

            entityId: subscription._id,

            message: `${subscription.name} sharing was updated.`,

            metadata: {
                memberIds,
            },

            createdAt: new Date(),
        });

        await family.save();
    }

    return subscription;
};

// ============================================================================
// UPDATE SHARING PERMISSION
// ============================================================================

export const updateSubscriptionSharingPermission = async (
    subscriptionId,
    userId,
    memberId,
    access,
) => {
    const authenticatedUserId = requireUserId(userId);

    const subscription = await Subscription.findById(subscriptionId);

    if (!subscription) {
        throw createServiceError("Subscription not found.", 404);
    }

    assertOwner(subscription, authenticatedUserId);

    if (!["View", "Edit"].includes(access)) {
        throw createServiceError("Invalid subscription access level.", 400);
    }

    const member = subscription.sharing?.members?.find(
        (item) => normalizeId(item.user) === normalizeId(memberId),
    );

    if (!member) {
        throw createServiceError(
            "This family member does not have access to the subscription.",
            404,
        );
    }

    member.access = access;

    await subscription.save();

    return subscription;
};

// ============================================================================
// REMOVE MEMBER ACCESS
// ============================================================================

export const removeSubscriptionMemberAccess = async (
    subscriptionId,
    userId,
    memberId,
) => {
    return unshareSubscription(
        subscriptionId,

        userId,

        {
            memberIds: [memberId],
        },
    );
};

// ============================================================================
// GET FAMILY SHARED SUBSCRIPTIONS
// ============================================================================

export const getFamilySharedSubscriptions = async (userId) => {
    const authenticatedUserId = requireUserId(userId);

    const family = await getUserFamily(authenticatedUserId);

    if (!family) {
        return [];
    }

    return Subscription.find({
        family: family._id,

        "sharing.shared": true,

        "sharing.members.user": authenticatedUserId,
    })

        .populate("asset", "name brand category")

        .populate("user", "name email profileImage")

        .populate("sharing.members.user", "name email profileImage")

        .sort({
            nextBillingDate: 1,
        })

        .lean();
};

// ============================================================================
// GET OVERDUE SUBSCRIPTIONS
// ============================================================================

export const getOverdueSubscriptions = async (userId) => {
    const authenticatedUserId = requireUserId(userId);

    const query = await buildAccessQuery(authenticatedUserId);

    query.status = "active";

    query.nextBillingDate = {
        $lt: new Date(),
    };

    return Subscription.find(query)

        .populate("asset", "name brand category")

        .populate("user", "name email profileImage")

        .sort({
            nextBillingDate: 1,
        })

        .lean();
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
    getSubscriptions,

    getSubscriptionById,

    createSubscription,

    updateSubscription,

    deleteSubscription,

    getUpcomingSubscriptions,

    getSubscriptionStats,

    shareSubscription,

    unshareSubscription,

    updateSubscriptionSharingPermission,

    removeSubscriptionMemberAccess,

    getFamilySharedSubscriptions,

    getOverdueSubscriptions,
};
