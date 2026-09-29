import mongoose from "mongoose";

import CalendarEvent from "../models/CalendarEvent.js";
import Asset from "../models/Asset.js";
import Family from "../models/Family.js";
import Warranty from "../models/Warranty.js";
import Subscription from "../models/subscription.model.js";

// ============================================================================
// CALENDAR SERVICE
// ============================================================================
//
// Architecture:
//
// Controller
//     ↓
// Calendar Service
//     ↓
// CalendarEvent Model
//
// Access:
//
// Owner       → View + Edit + Delete
// View member → View
// Edit member → View + Edit
//
// ============================================================================

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
// VALIDATE EVENT ID
// ============================================================================

const validateEventId = (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw createServiceError("Invalid calendar event ID.", 400);
    }
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
// RESOLVE WARRANTY
// ============================================================================

const resolveWarranty = async (warrantyId, userId) => {
    if (warrantyId === undefined || warrantyId === null || warrantyId === "") {
        return null;
    }

    if (!mongoose.Types.ObjectId.isValid(warrantyId)) {
        throw createServiceError("Invalid warranty ID.", 400);
    }

    const warranty = await Warranty.findOne({
        _id: warrantyId,

        owner: userId,
    }).select("_id");

    if (!warranty) {
        throw createServiceError("Selected warranty was not found.", 404);
    }

    return warranty._id;
};

// ============================================================================
// RESOLVE SUBSCRIPTION
// ============================================================================

const resolveSubscription = async (subscriptionId, userId) => {
    if (
        subscriptionId === undefined ||
        subscriptionId === null ||
        subscriptionId === ""
    ) {
        return null;
    }

    if (!mongoose.Types.ObjectId.isValid(subscriptionId)) {
        throw createServiceError("Invalid subscription ID.", 400);
    }

    const subscription = await Subscription.findOne({
        _id: subscriptionId,

        user: userId,
    }).select("_id");

    if (!subscription) {
        throw createServiceError("Selected subscription was not found.", 404);
    }

    return subscription._id;
};

// ============================================================================
// NORMALIZE EVENT DATA
// ============================================================================

const normalizeEventData = (eventData = {}) => {
    const allowedFields = [
        "title",

        "description",

        "type",

        "startDate",

        "endDate",

        "allDay",

        "priority",

        "status",

        "asset",

        "warranty",

        "subscription",

        "reminder",

        "location",

        "notes",
    ];

    const data = {};

    allowedFields.forEach((field) => {
        if (Object.prototype.hasOwnProperty.call(eventData, field)) {
            data[field] = eventData[field];
        }
    });

    // ------------------------------------------------------------------------
    // STRING CLEANUP
    // ------------------------------------------------------------------------

    ["title", "description", "location", "notes"].forEach((field) => {
        if (typeof data[field] === "string") {
            data[field] = data[field].trim();
        }
    });

    // ------------------------------------------------------------------------
    // DATE VALIDATION
    // ------------------------------------------------------------------------

    if (data.startDate) {
        const start = new Date(data.startDate);

        if (Number.isNaN(start.getTime())) {
            throw createServiceError("Invalid event start date.", 400);
        }
    }

    if (data.endDate) {
        const end = new Date(data.endDate);

        if (Number.isNaN(end.getTime())) {
            throw createServiceError("Invalid event end date.", 400);
        }
    }

    // ------------------------------------------------------------------------
    // DATE ORDER
    // ------------------------------------------------------------------------

    if (data.startDate && data.endDate) {
        const start = new Date(data.startDate);

        const end = new Date(data.endDate);

        if (end < start) {
            throw createServiceError(
                "End date cannot be earlier than start date.",
                400,
            );
        }
    }

    // ------------------------------------------------------------------------
    // REMINDER
    // ------------------------------------------------------------------------

    if (data.reminder) {
        const reminder = {
            enabled: Boolean(data.reminder.enabled),

            minutesBefore: Number(data.reminder.minutesBefore ?? 1440),
        };

        if (
            !Number.isFinite(reminder.minutesBefore) ||
            reminder.minutesBefore < 0
        ) {
            throw createServiceError("Invalid reminder time.", 400);
        }

        data.reminder = reminder;
    }

    return data;
};

// ============================================================================
// GET EVENT ACCESS
// ============================================================================

const getCalendarEventAccess = async (event, userId) => {
    // ------------------------------------------------------------------------
    // OWNER
    // ------------------------------------------------------------------------

    if (normalizeId(event.owner) === normalizeId(userId)) {
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

    if (!event.family) {
        return {
            canView: false,

            canEdit: false,

            canDelete: false,

            isOwner: false,

            isFamilyMember: false,
        };
    }

    const family = await Family.findById(event.family);

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

    if (!event.sharing?.shared) {
        return {
            canView: false,

            canEdit: false,

            canDelete: false,

            isOwner: false,

            isFamilyMember: true,
        };
    }

    const sharedMember = event.sharing.members.find(
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

    const canView = membership.permissions?.calendar !== false;

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

const assertCanView = async (event, userId) => {
    const access = await getCalendarEventAccess(event, userId);

    if (!access.canView) {
        throw createServiceError(
            "You do not have permission to view this calendar event.",
            403,
        );
    }

    return access;
};

// ============================================================================
// ASSERT EDIT ACCESS
// ============================================================================

const assertCanEdit = async (event, userId) => {
    const access = await getCalendarEventAccess(event, userId);

    if (!access.canEdit) {
        throw createServiceError(
            "You do not have permission to edit this calendar event.",
            403,
        );
    }

    return access;
};

// ============================================================================
// ASSERT OWNER
// ============================================================================

const assertOwner = (event, userId) => {
    if (normalizeId(event.owner) !== normalizeId(userId)) {
        throw createServiceError(
            "Only the event owner can perform this action.",
            403,
        );
    }
};

// ============================================================================
// CREATE EVENT
// ============================================================================

export const createCalendarEvent = async (eventData, userId) => {
    const authenticatedUserId = requireUserId(userId);

    const data = normalizeEventData(eventData);

    data.owner = authenticatedUserId;

    // ------------------------------------------------------------------------
    // Prevent client-side ownership override
    // ------------------------------------------------------------------------

    delete data.family;

    delete data.sharing;

    // ------------------------------------------------------------------------
    // Resolve linked resources
    // ------------------------------------------------------------------------

    if (Object.prototype.hasOwnProperty.call(data, "asset")) {
        data.asset = await resolveOwnedAsset(data.asset, authenticatedUserId);
    }

    if (Object.prototype.hasOwnProperty.call(data, "warranty")) {
        data.warranty = await resolveWarranty(data.warranty, authenticatedUserId);
    }

    if (Object.prototype.hasOwnProperty.call(data, "subscription")) {
        data.subscription = await resolveSubscription(
            data.subscription,
            authenticatedUserId,
        );
    }

    const event = await CalendarEvent.create(data);

    return event.populate([
        {
            path: "asset",

            select: "name brand category",
        },

        {
            path: "warranty",

            select: "title provider expiryDate",
        },

        {
            path: "subscription",

            select: "name provider nextBillingDate amount",
        },
    ]);
};

// ============================================================================
// GET ALL EVENTS
// ============================================================================

export const getCalendarEvents = async ({
    userId,
    start,
    end,
    type,
    status,
    asset,
    warranty,
    subscription,
} = {}) => {
    const authenticatedUserId = requireUserId(userId);

    const family = await getUserFamily(authenticatedUserId);

    const accessConditions = [
        {
            owner: authenticatedUserId,
        },
    ];

    // ------------------------------------------------------------------------
    // FAMILY SHARED EVENTS
    // ------------------------------------------------------------------------

    if (family) {
        accessConditions.push({
            family: family._id,

            "sharing.shared": true,

            "sharing.members.user": authenticatedUserId,
        });
    }

    const query = {
        $or: accessConditions,
    };

    // ------------------------------------------------------------------------
    // DATE RANGE
    // ------------------------------------------------------------------------

    if (start || end) {
        query.startDate = {};

        if (start) {
            const startDate = new Date(start);

            if (Number.isNaN(startDate.getTime())) {
                throw createServiceError("Invalid calendar start date.", 400);
            }

            query.startDate.$gte = startDate;
        }

        if (end) {
            const endDate = new Date(end);

            if (Number.isNaN(endDate.getTime())) {
                throw createServiceError("Invalid calendar end date.", 400);
            }

            query.startDate.$lte = endDate;
        }
    }

    // ------------------------------------------------------------------------
    // TYPE
    // ------------------------------------------------------------------------

    if (type) {
        query.type = type;
    }

    // ------------------------------------------------------------------------
    // STATUS
    // ------------------------------------------------------------------------

    if (status) {
        query.status = status;
    }

    // ------------------------------------------------------------------------
    // ASSET
    // ------------------------------------------------------------------------

    if (asset) {
        query.asset = await resolveOwnedAsset(asset, authenticatedUserId);
    }

    // ------------------------------------------------------------------------
    // WARRANTY
    // ------------------------------------------------------------------------

    if (warranty) {
        query.warranty = await resolveWarranty(warranty, authenticatedUserId);
    }

    // ------------------------------------------------------------------------
    // SUBSCRIPTION
    // ------------------------------------------------------------------------

    if (subscription) {
        query.subscription = await resolveSubscription(
            subscription,
            authenticatedUserId,
        );
    }

    return CalendarEvent.find(query)

        .populate("asset", "name brand category")

        .populate("warranty", "title provider expiryDate")

        .populate("subscription", "name provider nextBillingDate amount")

        .populate("owner", "name email profileImage")

        .sort({
            startDate: 1,

            createdAt: -1,
        });
};

// ============================================================================
// GET SINGLE EVENT
// ============================================================================

export const getCalendarEventById = async (id, userId) => {
    validateEventId(id);

    const authenticatedUserId = requireUserId(userId);

    const event = await CalendarEvent.findById(id);

    if (!event) {
        throw createServiceError("Calendar event not found.", 404);
    }

    await assertCanView(event, authenticatedUserId);

    await event.populate([
        {
            path: "asset",

            select: "name brand category",
        },

        {
            path: "warranty",

            select: "title provider expiryDate",
        },

        {
            path: "subscription",

            select: "name provider nextBillingDate amount",
        },

        {
            path: "owner",

            select: "name email profileImage",
        },

        {
            path: "family",

            select: "name owner",
        },
    ]);

    return event;
};

// ============================================================================
// UPDATE EVENT
// ============================================================================

export const updateCalendarEvent = async (id, eventData, userId) => {
    validateEventId(id);

    const authenticatedUserId = requireUserId(userId);

    const event = await CalendarEvent.findById(id);

    if (!event) {
        throw createServiceError("Calendar event not found.", 404);
    }

    await assertCanEdit(event, authenticatedUserId);

    const data = normalizeEventData(eventData);

    // Never change ownership/family/sharing
    // through normal update.

    delete data.owner;

    delete data.family;

    delete data.sharing;

    // --------------------------------------------------------------------
    // Linked resources
    // --------------------------------------------------------------------

    if (Object.prototype.hasOwnProperty.call(data, "asset")) {
        data.asset = await resolveOwnedAsset(data.asset, authenticatedUserId);
    }

    if (Object.prototype.hasOwnProperty.call(data, "warranty")) {
        data.warranty = await resolveWarranty(data.warranty, authenticatedUserId);
    }

    if (Object.prototype.hasOwnProperty.call(data, "subscription")) {
        data.subscription = await resolveSubscription(
            data.subscription,
            authenticatedUserId,
        );
    }

    Object.keys(data).forEach((key) => {
        if (data[key] !== undefined) {
            event[key] = data[key];
        }
    });

    await event.save();

    return event.populate([
        {
            path: "asset",

            select: "name brand category",
        },

        {
            path: "warranty",

            select: "title provider expiryDate",
        },

        {
            path: "subscription",

            select: "name provider nextBillingDate amount",
        },
    ]);
};

// ============================================================================
// DELETE EVENT
// ============================================================================

export const deleteCalendarEvent = async (id, userId) => {
    validateEventId(id);

    const authenticatedUserId = requireUserId(userId);

    const event = await CalendarEvent.findById(id);

    if (!event) {
        throw createServiceError("Calendar event not found.", 404);
    }

    assertOwner(event, authenticatedUserId);

    await event.deleteOne();

    return {
        success: true,

        message: "Calendar event deleted successfully.",
    };
};

// ============================================================================
// COMPLETE EVENT
// ============================================================================

export const completeCalendarEvent = async (id, userId) => {
    validateEventId(id);

    const authenticatedUserId = requireUserId(userId);

    const event = await CalendarEvent.findById(id);

    if (!event) {
        throw createServiceError("Calendar event not found.", 404);
    }

    await assertCanEdit(event, authenticatedUserId);

    event.status = "completed";

    await event.save();

    return event.populate("asset", "name brand category");
};

// ============================================================================
// GET UPCOMING EVENTS
// ============================================================================

export const getUpcomingCalendarEvents = async (userId, days = 30) => {
    const authenticatedUserId = requireUserId(userId);

    const normalizedDays = Number(days);

    if (!Number.isFinite(normalizedDays) || normalizedDays < 0) {
        throw createServiceError("Invalid days value.", 400);
    }

    const startDate = new Date();

    const endDate = new Date();

    endDate.setDate(endDate.getDate() + normalizedDays);

    const family = await getUserFamily(authenticatedUserId);

    const accessConditions = [
        {
            owner: authenticatedUserId,
        },
    ];

    if (family) {
        accessConditions.push({
            family: family._id,

            "sharing.shared": true,

            "sharing.members.user": authenticatedUserId,
        });
    }

    return CalendarEvent.find({
        $or: accessConditions,

        startDate: {
            $gte: startDate,

            $lte: endDate,
        },

        status: "upcoming",
    })

        .populate("asset", "name brand category")

        .populate("warranty", "title provider expiryDate")

        .populate("subscription", "name provider nextBillingDate amount")

        .sort({
            startDate: 1,
        });
};

// ============================================================================
// GET FAMILY SHARED EVENTS
// ============================================================================

export const getFamilySharedCalendarEvents = async (userId) => {
    const authenticatedUserId = requireUserId(userId);

    const family = await getUserFamily(authenticatedUserId);

    if (!family) {
        return [];
    }

    return CalendarEvent.find({
        family: family._id,

        "sharing.shared": true,

        "sharing.members.user": authenticatedUserId,
    })

        .populate("asset", "name brand category")

        .populate("warranty", "title provider expiryDate")

        .populate("subscription", "name provider nextBillingDate amount")

        .populate("owner", "name email profileImage")

        .sort({
            startDate: 1,
        });
};

// ============================================================================
// GET CALENDAR STATS
// ============================================================================

export const getCalendarStats = async (userId) => {
    const authenticatedUserId = requireUserId(userId);

    const family = await getUserFamily(authenticatedUserId);

    const accessConditions = [
        {
            owner: authenticatedUserId,
        },
    ];

    if (family) {
        accessConditions.push({
            family: family._id,

            "sharing.shared": true,

            "sharing.members.user": authenticatedUserId,
        });
    }

    const now = new Date();

    const [total, upcoming, completed, cancelled, highPriority, reminders] =
        await Promise.all([
            CalendarEvent.countDocuments({
                $or: accessConditions,
            }),

            CalendarEvent.countDocuments({
                $or: accessConditions,

                status: "upcoming",

                startDate: {
                    $gte: now,
                },
            }),

            CalendarEvent.countDocuments({
                $or: accessConditions,

                status: "completed",
            }),

            CalendarEvent.countDocuments({
                $or: accessConditions,

                status: "cancelled",
            }),

            CalendarEvent.countDocuments({
                $or: accessConditions,

                priority: "high",

                status: "upcoming",
            }),

            CalendarEvent.countDocuments({
                $or: accessConditions,

                "reminder.enabled": true,
            }),
        ]);

    return {
        total,

        upcoming,

        completed,

        cancelled,

        highPriority,

        reminders,
    };
};

// ============================================================================
// SHARE EVENT
// ============================================================================

export const shareCalendarEvent = async (eventId, userId, data = {}) => {
    validateEventId(eventId);

    const authenticatedUserId = requireUserId(userId);

    const event = await CalendarEvent.findById(eventId);

    if (!event) {
        throw createServiceError("Calendar event not found.", 404);
    }

    assertOwner(event, authenticatedUserId);

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

    event.family = family._id;

    const existingMembers = event.sharing?.members || [];

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

    event.sharing = {
        shared: true,

        members: existingMembers,
    };

    await event.save();

    return event;
};

// ============================================================================
// UNSHARE EVENT
// ============================================================================

export const unshareCalendarEvent = async (eventId, userId, data = {}) => {
    validateEventId(eventId);

    const authenticatedUserId = requireUserId(userId);

    const event = await CalendarEvent.findById(eventId);

    if (!event) {
        throw createServiceError("Calendar event not found.", 404);
    }

    assertOwner(event, authenticatedUserId);

    const memberIds = Array.isArray(data.memberIds) ? data.memberIds : [];

    // --------------------------------------------------------------------
    // REMOVE ALL SHARING
    // --------------------------------------------------------------------

    if (memberIds.length === 0) {
        event.family = null;

        event.sharing = {
            shared: false,

            members: [],
        };
    } else {
        event.sharing.members = (event.sharing?.members || []).filter(
            (member) =>
                !memberIds.some((id) => normalizeId(member.user) === normalizeId(id)),
        );

        if (event.sharing.members.length === 0) {
            event.family = null;

            event.sharing.shared = false;
        }
    }

    await event.save();

    return event;
};

// ============================================================================
// UPDATE MEMBER PERMISSION
// ============================================================================

export const updateCalendarMemberPermission = async (
    eventId,
    userId,
    memberId,
    access,
) => {
    validateEventId(eventId);

    const authenticatedUserId = requireUserId(userId);

    const event = await CalendarEvent.findById(eventId);

    if (!event) {
        throw createServiceError("Calendar event not found.", 404);
    }

    assertOwner(event, authenticatedUserId);

    if (!["View", "Edit"].includes(access)) {
        throw createServiceError("Invalid calendar access level.", 400);
    }

    const member = event.sharing?.members?.find(
        (item) => normalizeId(item.user) === normalizeId(memberId),
    );

    if (!member) {
        throw createServiceError(
            "This family member does not have access to the event.",
            404,
        );
    }

    member.access = access;

    await event.save();

    return event;
};

// ============================================================================
// REMOVE MEMBER ACCESS
// ============================================================================

export const removeCalendarMember = async (eventId, userId, memberId) => {
    return unshareCalendarEvent(
        eventId,

        userId,

        {
            memberIds: [memberId],
        },
    );
};

// ============================================================================
// GET EVENT ACCESS DETAILS
// ============================================================================

export const getCalendarEventAccessDetails = async (eventId, userId) => {
    validateEventId(eventId);

    const authenticatedUserId = requireUserId(userId);

    const event = await CalendarEvent.findById(eventId);

    if (!event) {
        throw createServiceError("Calendar event not found.", 404);
    }

    const access = await getCalendarEventAccess(event, authenticatedUserId);

    if (!access.canView) {
        throw createServiceError(
            "You do not have permission to view this calendar event.",
            403,
        );
    }

    return {
        eventId: event._id,

        ...access,
    };
};

// ============================================================================
// EXPORT
// ============================================================================

export default {
    createCalendarEvent,

    getCalendarEvents,

    getCalendarEventById,

    updateCalendarEvent,

    deleteCalendarEvent,

    completeCalendarEvent,

    getUpcomingCalendarEvents,

    getFamilySharedCalendarEvents,

    getCalendarStats,

    shareCalendarEvent,

    unshareCalendarEvent,

    updateCalendarMemberPermission,

    removeCalendarMember,

    getCalendarEventAccessDetails,
};
