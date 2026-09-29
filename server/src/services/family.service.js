import crypto from "crypto";

import mongoose from "mongoose";

import Family from "../models/Family.js";

// ============================================================================
// FAMILY SERVICE
// ============================================================================
//
// Responsibilities:
//
// - Create family
// - Get family
// - Update family
// - Manage members
// - Create / manage invitations
// - Manage member permissions
// - Manage notification preferences
// - Manage family settings
// - Manage shared resources
// - Create activity records
// - Create / read notifications
// - Prepare family dashboard data
//
// IMPORTANT:
//
// This service contains business logic.
// Controllers should remain thin and should mainly:
//
//     req → service → res
//
// ============================================================================

// ============================================================================
// CONSTANTS
// ============================================================================

const INVITATION_EXPIRY_DAYS = 7;

const MAX_ACTIVITY_ITEMS = 100;

const MAX_NOTIFICATION_ITEMS = 100;

// ============================================================================
// HELPER: NORMALIZE OBJECT ID
// ============================================================================

const normalizeId = (value) => {
    if (!value) {
        return null;
    }

    return value.toString();
};

// ============================================================================
// HELPER: VALIDATE OBJECT ID
// ============================================================================

const isValidObjectId = (value) => {
    return mongoose.Types.ObjectId.isValid(value);
};

// ============================================================================
// HELPER: CREATE OBJECT ID
// ============================================================================

const toObjectId = (value) => {
    if (!value) {
        return null;
    }

    return new mongoose.Types.ObjectId(value);
};

// ============================================================================
// HELPER: GET FAMILY
// ============================================================================

const findFamilyByOwner = async (ownerId) => {
    if (!ownerId) {
        return null;
    }

    return Family.findOne({
        owner: ownerId,
        status: "Active",
    });
};

// ============================================================================
// CREATE FAMILY
// ============================================================================

export const createFamily = async (ownerId, data = {}) => {
    if (!ownerId) {
        throw new Error("Family owner is required.");
    }

    if (!isValidObjectId(ownerId)) {
        throw new Error("Invalid family owner.");
    }

    // ------------------------------------------------------------------------
    // Prevent duplicate family
    // ------------------------------------------------------------------------

    const existingFamily = await Family.findOne({
        owner: ownerId,
    });

    if (existingFamily) {
        return existingFamily;
    }

    // ------------------------------------------------------------------------
    // Create family
    // ------------------------------------------------------------------------

    const family = await Family.create({
        name: data.name?.trim() || "My Family",

        owner: toObjectId(ownerId),

        members: [
            {
                user: toObjectId(ownerId),

                role: "Owner",

                relationship: "Owner",

                status: "Active",

                accessLevel: "Full",

                permissions: {
                    assets: true,
                    subscriptions: true,
                    warranties: true,
                    documents: true,
                    calendar: true,
                },

                notifications: {
                    renewals: true,
                    warrantyExpiry: true,
                    insuranceExpiry: true,
                    activity: true,
                    familyUpdates: true,
                },

                joinedAt: new Date(),

                lastActiveAt: new Date(),
            },
        ],

        settings: {
            renewalAlerts: true,
            warrantyAlerts: true,
            insuranceAlerts: true,
            activityAlerts: true,
            memberUpdateAlerts: true,
        },

        status: "Active",
    });

    return family;
};

// ============================================================================
// GET FAMILY
// ============================================================================

export const getFamily = async (ownerId) => {
    if (!ownerId) {
        throw new Error("User authentication is required.");
    }

    let family = await findFamilyByOwner(ownerId);

    // ------------------------------------------------------------------------
    // Automatically create family for first-time user
    // ------------------------------------------------------------------------

    if (!family) {
        family = await createFamily(ownerId);
    }

    await family.populate([
        {
            path: "owner",

            select: "name email profileImage",
        },

        {
            path: "members.user",

            select: "name email profileImage",
        },

        {
            path: "invitations.invitedBy",

            select: "name email",
        },

        {
            path: "activity.actor",

            select: "name email profileImage",
        },

        {
            path: "notifications.recipient",

            select: "name email",
        },
    ]);

    return family;
};

// ============================================================================
// GET FAMILY BY ID
// ============================================================================

export const getFamilyById = async (familyId) => {
    if (!familyId || !isValidObjectId(familyId)) {
        throw new Error("Invalid family ID.");
    }

    return Family.findById(familyId).populate([
        {
            path: "owner",

            select: "name email profileImage",
        },

        {
            path: "members.user",

            select: "name email profileImage",
        },
    ]);
};

// ============================================================================
// UPDATE FAMILY
// ============================================================================

export const updateFamily = async (ownerId, data = {}) => {
    const family = await findFamilyByOwner(ownerId);

    if (!family) {
        throw new Error("Family not found.");
    }

    // ------------------------------------------------------------------------
    // Update allowed fields only
    // ------------------------------------------------------------------------

    if (typeof data.name === "string") {
        const name = data.name.trim();

        if (!name) {
            throw new Error("Family name cannot be empty.");
        }

        if (name.length > 100) {
            throw new Error("Family name cannot exceed 100 characters.");
        }

        family.name = name;
    }

    // ------------------------------------------------------------------------
    // Update family settings
    // ------------------------------------------------------------------------

    if (data.settings && typeof data.settings === "object") {
        const allowedSettings = [
            "renewalAlerts",
            "warrantyAlerts",
            "insuranceAlerts",
            "activityAlerts",
            "memberUpdateAlerts",
        ];

        allowedSettings.forEach((key) => {
            if (typeof data.settings[key] === "boolean") {
                family.settings[key] = data.settings[key];
            }
        });
    }

    await family.save();

    return family;
};

// ============================================================================
// GET FAMILY MEMBERS
// ============================================================================

export const getFamilyMembers = async (ownerId) => {
    const family = await findFamilyByOwner(ownerId);

    if (!family) {
        throw new Error("Family not found.");
    }

    await family.populate({
        path: "members.user",

        select: "name email profileImage createdAt",
    });

    return family.members;
};

// ============================================================================
// FIND MEMBER
// ============================================================================

const findMember = (family, memberId) => {
    if (!memberId) {
        return null;
    }

    return family.members.id(memberId);
};

// ============================================================================
// CHECK FAMILY OWNER
// ============================================================================

export const isFamilyOwner = async (ownerId, family) => {
    if (!family || !ownerId) {
        return false;
    }

    return normalizeId(family.owner) === normalizeId(ownerId);
};

// ============================================================================
// CHECK FAMILY MEMBER
// ============================================================================

export const isFamilyMember = async (userId, family) => {
    if (!family || !userId) {
        return false;
    }

    if (normalizeId(family.owner) === normalizeId(userId)) {
        return true;
    }

    return family.members.some(
        (member) =>
            normalizeId(member.user) === normalizeId(userId) &&
            member.status === "Active",
    );
};

// ============================================================================
// GET MEMBER
// ============================================================================

export const getFamilyMember = async (familyId, memberId) => {
    if (!familyId || !isValidObjectId(familyId)) {
        throw new Error("Invalid family ID.");
    }

    const family = await Family.findById(familyId);

    if (!family) {
        throw new Error("Family not found.");
    }

    const member = findMember(family, memberId);

    if (!member) {
        throw new Error("Family member not found.");
    }

    await family.populate({
        path: "members.user",

        select: "name email profileImage",
    });

    return family.members.id(memberId);
};

// ============================================================================
// INVITE MEMBER
// ============================================================================

export const inviteMember = async (ownerId, data = {}) => {
    const family = await findFamilyByOwner(ownerId);

    if (!family) {
        throw new Error("Family not found.");
    }

    // ------------------------------------------------------------------------
    // Validate email
    // ------------------------------------------------------------------------

    const email = data.email?.trim().toLowerCase();

    if (!email) {
        throw new Error("Member email is required.");
    }

    // ------------------------------------------------------------------------
    // Prevent owner inviting themselves
    // ------------------------------------------------------------------------

    const ownerUser = await mongoose
        .model("User")
        .findById(ownerId)
        .select("email");

    if (ownerUser?.email?.toLowerCase() === email) {
        throw new Error("You cannot invite yourself.");
    }

    // ------------------------------------------------------------------------
    // Check existing member
    // ------------------------------------------------------------------------

    const existingMember = family.members.find(
        (member) => member.user && member.status === "Active",
    );

    if (existingMember) {
        await family.populate({
            path: "members.user",

            select: "email",
        });

        const alreadyMember = family.members.some(
            (member) =>
                member.user?.email?.toLowerCase() === email &&
                member.status === "Active",
        );

        if (alreadyMember) {
            throw new Error("This user is already a family member.");
        }
    }

    // ------------------------------------------------------------------------
    // Prevent duplicate pending invitation
    // ------------------------------------------------------------------------

    const now = new Date();

    const existingInvitation = family.invitations.find(
        (invitation) =>
            invitation.email === email &&
            invitation.status === "Pending" &&
            invitation.expiresAt > now,
    );

    if (existingInvitation) {
        throw new Error("A pending invitation already exists for this email.");
    }

    // ------------------------------------------------------------------------
    // Generate secure token
    // ------------------------------------------------------------------------

    const token = crypto.randomBytes(32).toString("hex");

    // ------------------------------------------------------------------------
    // Expiration
    // ------------------------------------------------------------------------

    const expiresAt = new Date();

    expiresAt.setDate(expiresAt.getDate() + INVITATION_EXPIRY_DAYS);

    // ------------------------------------------------------------------------
    // Invitation configuration
    // ------------------------------------------------------------------------

    const invitation = {
        email,

        invitedBy: toObjectId(ownerId),

        role:
            data.role === "Admin"
                ? "Admin"
                : data.role === "Viewer"
                    ? "Viewer"
                    : "Member",

        relationship: data.relationship?.trim() || "Family",

        accessLevel:
            data.accessLevel === "Full"
                ? "Full"
                : data.accessLevel === "ViewOnly"
                    ? "ViewOnly"
                    : "Limited",

        permissions: {
            assets: data.permissions?.assets !== false,

            subscriptions: data.permissions?.subscriptions !== false,

            warranties: data.permissions?.warranties !== false,

            documents: data.permissions?.documents === true,

            calendar: data.permissions?.calendar !== false,
        },

        notifications: {
            renewals: data.notifications?.renewals !== false,

            warrantyExpiry: data.notifications?.warrantyExpiry !== false,

            insuranceExpiry: data.notifications?.insuranceExpiry !== false,

            activity: data.notifications?.activity !== false,

            familyUpdates: data.notifications?.familyUpdates !== false,
        },

        token,

        expiresAt,

        status: "Pending",
    };

    family.invitations.push(invitation);

    // ------------------------------------------------------------------------
    // Activity
    // ------------------------------------------------------------------------

    family.activity.unshift({
        actor: toObjectId(ownerId),

        action: "MEMBER_INVITED",

        entityType: "Member",

        message: `Family invitation sent to ${email}.`,

        metadata: {
            email,
        },

        createdAt: new Date(),
    });

    await family.save();

    return {
        family,
        invitation,
        token,
    };
};

// ============================================================================
// ACCEPT INVITATION
// ============================================================================

export const acceptInvitation = async (userId, token) => {
    if (!userId) {
        throw new Error("User authentication is required.");
    }

    if (!token) {
        throw new Error("Invitation token is required.");
    }

    const family = await Family.findOne({
        "invitations.token": token,
        "invitations.status": "Pending",
    });

    if (!family) {
        throw new Error("Invitation is invalid or no longer available.");
    }

    const invitation = family.invitations.find(
        (item) => item.token === token && item.status === "Pending",
    );

    if (!invitation) {
        throw new Error("Invitation not found.");
    }

    // ------------------------------------------------------------------------
    // Check expiry
    // ------------------------------------------------------------------------

    if (invitation.expiresAt < new Date()) {
        invitation.status = "Expired";

        await family.save();

        throw new Error("This invitation has expired.");
    }

    // ------------------------------------------------------------------------
    // Prevent duplicate membership
    // ------------------------------------------------------------------------

    const alreadyMember = family.members.some(
        (member) =>
            normalizeId(member.user) === normalizeId(userId) &&
            member.status === "Active",
    );

    if (alreadyMember) {
        invitation.status = "Accepted";

        invitation.acceptedAt = new Date();

        await family.save();

        return family;
    }

    // ------------------------------------------------------------------------
    // Add member
    // ------------------------------------------------------------------------

    family.members.push({
        user: toObjectId(userId),

        role: invitation.role,

        relationship: invitation.relationship,

        status: "Active",

        accessLevel: invitation.accessLevel,

        permissions: invitation.permissions,

        notifications: invitation.notifications,

        joinedAt: new Date(),

        lastActiveAt: new Date(),
    });

    // ------------------------------------------------------------------------
    // Mark invitation accepted
    // ------------------------------------------------------------------------

    invitation.status = "Accepted";

    invitation.acceptedAt = new Date();

    // ------------------------------------------------------------------------
    // Activity
    // ------------------------------------------------------------------------

    family.activity.unshift({
        actor: toObjectId(userId),

        action: "MEMBER_JOINED",

        entityType: "Member",

        entityId: toObjectId(userId),

        message: "A new family member joined the workspace.",

        metadata: {},

        createdAt: new Date(),
    });

    await family.save();

    return family;
};

// ============================================================================
// RESEND INVITATION
// ============================================================================

export const resendInvitation = async (ownerId, invitationId) => {
    const family = await findFamilyByOwner(ownerId);

    if (!family) {
        throw new Error("Family not found.");
    }

    const invitation = family.invitations.id(invitationId);

    if (!invitation) {
        throw new Error("Invitation not found.");
    }

    if (invitation.status === "Accepted") {
        throw new Error("This invitation has already been accepted.");
    }

    const token = crypto.randomBytes(32).toString("hex");

    const expiresAt = new Date();

    expiresAt.setDate(expiresAt.getDate() + INVITATION_EXPIRY_DAYS);

    invitation.token = token;

    invitation.expiresAt = expiresAt;

    invitation.status = "Pending";

    await family.save();

    return {
        invitation,
        token,
    };
};

// ============================================================================
// CANCEL INVITATION
// ============================================================================

export const cancelInvitation = async (ownerId, invitationId) => {
    const family = await findFamilyByOwner(ownerId);

    if (!family) {
        throw new Error("Family not found.");
    }

    const invitation = family.invitations.id(invitationId);

    if (!invitation) {
        throw new Error("Invitation not found.");
    }

    if (invitation.status !== "Pending") {
        throw new Error("Only pending invitations can be cancelled.");
    }

    invitation.status = "Cancelled";

    await family.save();

    return family;
};

// ============================================================================
// UPDATE MEMBER
// ============================================================================

export const updateMember = async (ownerId, memberId, data = {}) => {
    const family = await findFamilyByOwner(ownerId);

    if (!family) {
        throw new Error("Family not found.");
    }

    const member = findMember(family, memberId);

    if (!member) {
        throw new Error("Family member not found.");
    }

    // ------------------------------------------------------------------------
    // Owner cannot be changed through member update
    // ------------------------------------------------------------------------

    if (member.role === "Owner") {
        if (data.role && data.role !== "Owner") {
            throw new Error("Family owner role cannot be changed.");
        }
    }

    // ------------------------------------------------------------------------
    // Role
    // ------------------------------------------------------------------------

    if (data.role && ["Admin", "Member", "Viewer"].includes(data.role)) {
        member.role = data.role;
    }

    // ------------------------------------------------------------------------
    // Relationship
    // ------------------------------------------------------------------------

    if (typeof data.relationship === "string") {
        const relationship = data.relationship.trim();

        if (relationship.length > 50) {
            throw new Error("Relationship cannot exceed 50 characters.");
        }

        member.relationship = relationship;
    }

    // ------------------------------------------------------------------------
    // Access level
    // ------------------------------------------------------------------------

    if (["Full", "Limited", "ViewOnly"].includes(data.accessLevel)) {
        member.accessLevel = data.accessLevel;
    }

    // ------------------------------------------------------------------------
    // Permissions
    // ------------------------------------------------------------------------

    if (data.permissions && typeof data.permissions === "object") {
        const permissionKeys = [
            "assets",
            "subscriptions",
            "warranties",
            "documents",
            "calendar",
        ];

        permissionKeys.forEach((key) => {
            if (typeof data.permissions[key] === "boolean") {
                member.permissions[key] = data.permissions[key];
            }
        });
    }

    // ------------------------------------------------------------------------
    // Notification preferences
    // ------------------------------------------------------------------------

    if (data.notifications && typeof data.notifications === "object") {
        const notificationKeys = [
            "renewals",
            "warrantyExpiry",
            "insuranceExpiry",
            "activity",
            "familyUpdates",
        ];

        notificationKeys.forEach((key) => {
            if (typeof data.notifications[key] === "boolean") {
                member.notifications[key] = data.notifications[key];
            }
        });
    }

    // ------------------------------------------------------------------------
    // Activity
    // ------------------------------------------------------------------------

    family.activity.unshift({
        actor: toObjectId(ownerId),

        action: "MEMBER_UPDATED",

        entityType: "Member",

        entityId: member.user,

        message: "Family member settings were updated.",

        metadata: {},

        createdAt: new Date(),
    });

    await family.save();

    return member;
};

// ============================================================================
// REMOVE MEMBER
// ============================================================================

export const removeMember = async (ownerId, memberId) => {
    const family = await findFamilyByOwner(ownerId);

    if (!family) {
        throw new Error("Family not found.");
    }

    const member = findMember(family, memberId);

    if (!member) {
        throw new Error("Family member not found.");
    }

    // ------------------------------------------------------------------------
    // Owner protection
    // ------------------------------------------------------------------------

    if (member.role === "Owner") {
        throw new Error("Family owner cannot be removed.");
    }

    const removedUserId = member.user;

    family.members.pull(memberId);

    // ------------------------------------------------------------------------
    // Activity
    // ------------------------------------------------------------------------

    family.activity.unshift({
        actor: toObjectId(ownerId),

        action: "MEMBER_REMOVED",

        entityType: "Member",

        entityId: removedUserId,

        message: "A family member was removed.",

        metadata: {},

        createdAt: new Date(),
    });

    await family.save();

    return family;
};

// ============================================================================
// UPDATE MEMBER PERMISSIONS
// ============================================================================

export const updateMemberPermissions = async (
    ownerId,
    memberId,
    permissions = {},
) => {
    return updateMember(ownerId, memberId, {
        permissions,
    });
};

// ============================================================================
// UPDATE MEMBER NOTIFICATIONS
// ============================================================================

export const updateMemberNotifications = async (
    ownerId,
    memberId,
    notifications = {},
) => {
    return updateMember(ownerId, memberId, {
        notifications,
    });
};

// ============================================================================
// SHARE RESOURCE
// ============================================================================
//
// The actual Asset / Subscription / Document / Warranty model remains
// unchanged.
//
// Family stores sharing information as activity for now.
//
// Later the corresponding resource model can be extended with a familyId
// or sharedWith field without changing this Family architecture.
//
// ============================================================================

export const shareResource = async (
    ownerId,
    resourceType,
    resourceId,
    memberIds = [],
) => {
    const family = await findFamilyByOwner(ownerId);

    if (!family) {
        throw new Error("Family not found.");
    }

    if (!resourceId || !isValidObjectId(resourceId)) {
        throw new Error("Invalid resource ID.");
    }

    const allowedTypes = [
        "Asset",
        "Subscription",
        "Document",
        "Warranty",
        "Calendar",
    ];

    if (!allowedTypes.includes(resourceType)) {
        throw new Error("Invalid resource type.");
    }

    const validMembers = family.members.filter(
        (member) =>
            member.status === "Active" &&
            (memberIds.length === 0 ||
                memberIds.some((id) => normalizeId(member.user) === normalizeId(id))),
    );

    if (memberIds.length > 0 && validMembers.length === 0) {
        throw new Error("No valid family members were selected.");
    }

    family.activity.unshift({
        actor: toObjectId(ownerId),

        action: `${resourceType.toUpperCase()}_SHARED`,

        entityType: resourceType,

        entityId: toObjectId(resourceId),

        message: `${resourceType} was shared with family members.`,

        metadata: {
            memberIds: validMembers.map((member) => member.user),
        },

        createdAt: new Date(),
    });

    await family.save();

    return {
        family,
        sharedWith: validMembers.map((member) => member.user),
    };
};

// ============================================================================
// UNSHARE RESOURCE
// ============================================================================

export const unshareResource = async (
    ownerId,
    resourceType,
    resourceId,
    memberIds = [],
) => {
    const family = await findFamilyByOwner(ownerId);

    if (!family) {
        throw new Error("Family not found.");
    }

    const allowedTypes = [
        "Asset",
        "Subscription",
        "Document",
        "Warranty",
        "Calendar",
    ];

    if (!allowedTypes.includes(resourceType)) {
        throw new Error("Invalid resource type.");
    }

    family.activity.unshift({
        actor: toObjectId(ownerId),

        action: `${resourceType.toUpperCase()}_UNSHARED`,

        entityType: resourceType,

        entityId: isValidObjectId(resourceId) ? toObjectId(resourceId) : null,

        message: `${resourceType} sharing was removed.`,

        metadata: {
            memberIds,
        },

        createdAt: new Date(),
    });

    await family.save();

    return family;
};

// ============================================================================
// ADD ACTIVITY
// ============================================================================

export const addFamilyActivity = async (familyId, data = {}) => {
    if (!familyId || !isValidObjectId(familyId)) {
        throw new Error("Invalid family ID.");
    }

    const family = await Family.findById(familyId);

    if (!family) {
        throw new Error("Family not found.");
    }

    if (!data.actor) {
        throw new Error("Activity actor is required.");
    }

    family.activity.unshift({
        actor: toObjectId(data.actor),

        action: data.action || "FAMILY_ACTIVITY",

        entityType: data.entityType || "Family",

        entityId:
            data.entityId && isValidObjectId(data.entityId)
                ? toObjectId(data.entityId)
                : null,

        message: data.message || "Family activity occurred.",

        metadata: data.metadata || {},

        createdAt: new Date(),
    });

    // ------------------------------------------------------------------------
    // Keep embedded activity under control
    // ------------------------------------------------------------------------

    if (family.activity.length > MAX_ACTIVITY_ITEMS) {
        family.activity = family.activity.slice(0, MAX_ACTIVITY_ITEMS);
    }

    await family.save();

    return family;
};

// ============================================================================
// GET FAMILY ACTIVITY
// ============================================================================

export const getFamilyActivity = async (ownerId, limit = 20) => {
    const family = await findFamilyByOwner(ownerId);

    if (!family) {
        throw new Error("Family not found.");
    }

    const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);

    await family.populate({
        path: "activity.actor",

        select: "name email profileImage",
    });

    return family.activity.slice(0, safeLimit);
};

// ============================================================================
// ADD NOTIFICATION
// ============================================================================

export const addFamilyNotification = async (familyId, data = {}) => {
    if (!familyId || !isValidObjectId(familyId)) {
        throw new Error("Invalid family ID.");
    }

    if (!data.recipient) {
        throw new Error("Notification recipient is required.");
    }

    const family = await Family.findById(familyId);

    if (!family) {
        throw new Error("Family not found.");
    }

    family.notifications.unshift({
        recipient: toObjectId(data.recipient),

        type: data.type || "System",

        title: data.title || "EverKeep Family Update",

        message: data.message || "You have a new family notification.",

        entityType: data.entityType || "Family",

        entityId:
            data.entityId && isValidObjectId(data.entityId)
                ? toObjectId(data.entityId)
                : null,

        read: false,

        readAt: null,

        createdAt: new Date(),
    });

    // ------------------------------------------------------------------------
    // Keep notification array controlled
    // ------------------------------------------------------------------------

    if (family.notifications.length > MAX_NOTIFICATION_ITEMS) {
        family.notifications = family.notifications.slice(
            0,
            MAX_NOTIFICATION_ITEMS,
        );
    }

    await family.save();

    return family;
};

// ============================================================================
// GET FAMILY NOTIFICATIONS
// ============================================================================

export const getFamilyNotifications = async (ownerId, options = {}) => {
    const family = await findFamilyByOwner(ownerId);

    if (!family) {
        throw new Error("Family not found.");
    }

    const limit = Math.min(Math.max(Number(options.limit) || 20, 1), 100);

    const unreadOnly = options.unreadOnly === true;

    const notifications = family.notifications.filter((notification) => {
        const belongsToUser =
            normalizeId(notification.recipient) === normalizeId(ownerId);

        if (!belongsToUser) {
            return false;
        }

        if (unreadOnly && notification.read) {
            return false;
        }

        return true;
    });

    return notifications.slice(0, limit);
};

// ============================================================================
// MARK NOTIFICATION AS READ
// ============================================================================

export const markNotificationRead = async (ownerId, notificationId) => {
    const family = await findFamilyByOwner(ownerId);

    if (!family) {
        throw new Error("Family not found.");
    }

    const notification = family.notifications.id(notificationId);

    if (!notification) {
        throw new Error("Notification not found.");
    }

    if (normalizeId(notification.recipient) !== normalizeId(ownerId)) {
        throw new Error("You cannot update this notification.");
    }

    notification.read = true;

    notification.readAt = new Date();

    await family.save();

    return notification;
};

// ============================================================================
// MARK ALL NOTIFICATIONS AS READ
// ============================================================================

export const markAllNotificationsRead = async (ownerId) => {
    const family = await findFamilyByOwner(ownerId);

    if (!family) {
        throw new Error("Family not found.");
    }

    const now = new Date();

    family.notifications.forEach((notification) => {
        if (
            normalizeId(notification.recipient) === normalizeId(ownerId) &&
            !notification.read
        ) {
            notification.read = true;

            notification.readAt = now;
        }
    });

    await family.save();

    return family;
};

// ============================================================================
// GET FAMILY STATS
// ============================================================================
//
// Resource counts are intentionally returned as zero here.
//
// Asset / Subscription / Document / Warranty services will be connected in
// the integration stage. Keeping this method separate makes that integration
// clean and prevents duplicate database logic.
//
// ============================================================================

export const getFamilyStats = async (ownerId) => {
    const family = await findFamilyByOwner(ownerId);

    if (!family) {
        throw new Error("Family not found.");
    }

    const activeMembers = family.members.filter(
        (member) => member.status === "Active",
    ).length;

    const pendingInvitations = family.invitations.filter(
        (invitation) =>
            invitation.status === "Pending" && invitation.expiresAt > new Date(),
    ).length;

    const unreadNotifications = family.notifications.filter(
        (notification) =>
            normalizeId(notification.recipient) === normalizeId(ownerId) &&
            !notification.read,
    ).length;

    return {
        members: activeMembers,

        pendingInvitations,

        sharedAssets: 0,

        sharedSubscriptions: 0,

        sharedDocuments: 0,

        sharedWarranties: 0,

        upcomingRenewals: 0,

        unreadNotifications,
    };
};

// ============================================================================
// GET FAMILY DASHBOARD
// ============================================================================
//
// This is the main data source for Family.jsx.
//
// Existing Asset / Subscription / Warranty / Document modules will be plugged
// into this method in the integration stage.
//
// ============================================================================

export const getFamilyDashboard = async (ownerId) => {
    const family = await getFamily(ownerId);

    const stats = await getFamilyStats(ownerId);

    const activity = await getFamilyActivity(ownerId, 10);

    const notifications = await getFamilyNotifications(ownerId, {
        limit: 10,
    });

    return {
        family,

        members: family.members,

        stats,

        activity,

        notifications,
    };
};

// ============================================================================
// CLEAN EXPIRED INVITATIONS
// ============================================================================

export const cleanExpiredInvitations = async (familyId) => {
    if (!familyId || !isValidObjectId(familyId)) {
        throw new Error("Invalid family ID.");
    }

    const family = await Family.findById(familyId);

    if (!family) {
        throw new Error("Family not found.");
    }

    const now = new Date();

    let changed = false;

    family.invitations.forEach((invitation) => {
        if (invitation.status === "Pending" && invitation.expiresAt < now) {
            invitation.status = "Expired";

            changed = true;
        }
    });

    if (changed) {
        await family.save();
    }

    return family;
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
    createFamily,

    getFamily,

    getFamilyById,

    updateFamily,

    getFamilyMembers,

    getFamilyMember,

    inviteMember,

    acceptInvitation,

    resendInvitation,

    cancelInvitation,

    updateMember,

    removeMember,

    updateMemberPermissions,

    updateMemberNotifications,

    shareResource,

    unshareResource,

    addFamilyActivity,

    getFamilyActivity,

    addFamilyNotification,

    getFamilyNotifications,

    markNotificationRead,

    markAllNotificationsRead,

    getFamilyStats,

    getFamilyDashboard,

    cleanExpiredInvitations,
};
