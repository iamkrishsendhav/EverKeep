import * as familyService from "../services/family.service.js";

// ============================================================================
// FAMILY CONTROLLER
// ============================================================================
//
// Responsibilities:
//
// - Receive HTTP requests
// - Validate basic request data
// - Call family.service.js
// - Return consistent API responses
// - Handle controller-level errors
//
// Business logic stays inside family.service.js.
//
// ============================================================================

// ============================================================================
// HELPER: GET AUTHENTICATED USER ID
// ============================================================================

const getUserId = (req) => {
    return req.user?._id || req.user?.id || null;
};

// ============================================================================
// HELPER: SEND ERROR RESPONSE
// ============================================================================

const handleError = (res, error, fallbackMessage = "Something went wrong.") => {
    console.error("Family controller error:", error);

    const message = error?.message || fallbackMessage;

    // ------------------------------------------------------------------------
    // Validation / business errors
    // ------------------------------------------------------------------------

    const clientErrors = [
        "Family owner is required.",
        "Invalid family owner.",
        "User authentication is required.",
        "Family not found.",
        "Member email is required.",
        "You cannot invite yourself.",
        "This user is already a family member.",
        "A pending invitation already exists for this email.",
        "Invitation is invalid or no longer available.",
        "Invitation not found.",
        "This invitation has expired.",
        "This invitation has already been accepted.",
        "Only pending invitations can be cancelled.",
        "Family member not found.",
        "Family owner cannot be removed.",
        "Family owner role cannot be changed.",
        "You cannot update this notification.",
        "Notification not found.",
        "No valid family members were selected.",
        "Invalid resource type.",
        "Invalid resource ID.",
        "Invalid family ID.",
        "Family name cannot be empty.",
        "Family name cannot exceed 100 characters.",
        "Relationship cannot exceed 50 characters.",
        "Activity actor is required.",
        "Notification recipient is required.",
    ];

    if (clientErrors.includes(message)) {
        return res.status(400).json({
            success: false,

            message,
        });
    }

    // ------------------------------------------------------------------------
    // Default server error
    // ------------------------------------------------------------------------

    return res.status(500).json({
        success: false,

        message: fallbackMessage,
    });
};

// ============================================================================
// CREATE FAMILY
// ============================================================================
//
// POST /api/family
//
// ============================================================================

export const createFamily = async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,

                message: "Authentication required.",
            });
        }

        const family = await familyService.createFamily(userId, req.body);

        return res.status(201).json({
            success: true,

            message: "Family created successfully.",

            data: family,
        });
    } catch (error) {
        return handleError(res, error, "Unable to create family.");
    }
};

// ============================================================================
// GET MY FAMILY
// ============================================================================
//
// GET /api/family
//
// ============================================================================

export const getFamily = async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,

                message: "Authentication required.",
            });
        }

        const family = await familyService.getFamily(userId);

        return res.status(200).json({
            success: true,

            data: family,
        });
    } catch (error) {
        return handleError(res, error, "Unable to load family.");
    }
};

// ============================================================================
// UPDATE FAMILY
// ============================================================================
//
// PATCH /api/family
//
// ============================================================================

export const updateFamily = async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,

                message: "Authentication required.",
            });
        }

        const family = await familyService.updateFamily(userId, req.body);

        return res.status(200).json({
            success: true,

            message: "Family updated successfully.",

            data: family,
        });
    } catch (error) {
        return handleError(res, error, "Unable to update family.");
    }
};

// ============================================================================
// GET FAMILY MEMBERS
// ============================================================================
//
// GET /api/family/members
//
// ============================================================================

export const getFamilyMembers = async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,

                message: "Authentication required.",
            });
        }

        const members = await familyService.getFamilyMembers(userId);

        return res.status(200).json({
            success: true,

            count: members.length,

            data: members,
        });
    } catch (error) {
        return handleError(res, error, "Unable to load family members.");
    }
};

// ============================================================================
// GET SINGLE FAMILY MEMBER
// ============================================================================
//
// GET /api/family/members/:memberId
//
// ============================================================================

export const getFamilyMember = async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,

                message: "Authentication required.",
            });
        }

        const family = await familyService.getFamily(userId);

        const member = await familyService.getFamilyMember(
            family._id,
            req.params.memberId,
        );

        return res.status(200).json({
            success: true,

            data: member,
        });
    } catch (error) {
        return handleError(res, error, "Unable to load family member.");
    }
};

// ============================================================================
// INVITE FAMILY MEMBER
// ============================================================================
//
// POST /api/family/members/invite
//
// ============================================================================

export const inviteMember = async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,

                message: "Authentication required.",
            });
        }

        const result = await familyService.inviteMember(userId, req.body);

        return res.status(201).json({
            success: true,

            message: "Family invitation created successfully.",

            data: {
                invitation: result.invitation,
            },
        });
    } catch (error) {
        return handleError(res, error, "Unable to invite family member.");
    }
};

// ============================================================================
// ACCEPT INVITATION
// ============================================================================
//
// POST /api/family/invitations/:token/accept
//
// ============================================================================

export const acceptInvitation = async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,

                message: "Authentication required.",
            });
        }

        const family = await familyService.acceptInvitation(
            userId,
            req.params.token,
        );

        return res.status(200).json({
            success: true,

            message: "You have joined the family successfully.",

            data: family,
        });
    } catch (error) {
        return handleError(res, error, "Unable to accept family invitation.");
    }
};

// ============================================================================
// RESEND INVITATION
// ============================================================================
//
// POST /api/family/invitations/:invitationId/resend
//
// ============================================================================

export const resendInvitation = async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,

                message: "Authentication required.",
            });
        }

        const result = await familyService.resendInvitation(
            userId,
            req.params.invitationId,
        );

        return res.status(200).json({
            success: true,

            message: "Family invitation resent successfully.",

            data: {
                invitation: result.invitation,
            },
        });
    } catch (error) {
        return handleError(res, error, "Unable to resend invitation.");
    }
};

// ============================================================================
// CANCEL INVITATION
// ============================================================================
//
// DELETE /api/family/invitations/:invitationId
//
// ============================================================================

export const cancelInvitation = async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,

                message: "Authentication required.",
            });
        }

        const family = await familyService.cancelInvitation(
            userId,
            req.params.invitationId,
        );

        return res.status(200).json({
            success: true,

            message: "Family invitation cancelled successfully.",

            data: family,
        });
    } catch (error) {
        return handleError(res, error, "Unable to cancel invitation.");
    }
};

// ============================================================================
// UPDATE FAMILY MEMBER
// ============================================================================
//
// PATCH /api/family/members/:memberId
//
// ============================================================================

export const updateMember = async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,

                message: "Authentication required.",
            });
        }

        const member = await familyService.updateMember(
            userId,
            req.params.memberId,
            req.body,
        );

        return res.status(200).json({
            success: true,

            message: "Family member updated successfully.",

            data: member,
        });
    } catch (error) {
        return handleError(res, error, "Unable to update family member.");
    }
};

// ============================================================================
// REMOVE FAMILY MEMBER
// ============================================================================
//
// DELETE /api/family/members/:memberId
//
// ============================================================================

export const removeMember = async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,

                message: "Authentication required.",
            });
        }

        const family = await familyService.removeMember(
            userId,
            req.params.memberId,
        );

        return res.status(200).json({
            success: true,

            message: "Family member removed successfully.",

            data: family,
        });
    } catch (error) {
        return handleError(res, error, "Unable to remove family member.");
    }
};

// ============================================================================
// UPDATE MEMBER PERMISSIONS
// ============================================================================
//
// PATCH /api/family/members/:memberId/permissions
//
// ============================================================================

export const updateMemberPermissions = async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,

                message: "Authentication required.",
            });
        }

        const member = await familyService.updateMemberPermissions(
            userId,
            req.params.memberId,
            req.body.permissions || req.body,
        );

        return res.status(200).json({
            success: true,

            message: "Member permissions updated successfully.",

            data: member,
        });
    } catch (error) {
        return handleError(res, error, "Unable to update member permissions.");
    }
};

// ============================================================================
// UPDATE MEMBER NOTIFICATIONS
// ============================================================================
//
// PATCH /api/family/members/:memberId/notifications
//
// ============================================================================

export const updateMemberNotifications = async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,

                message: "Authentication required.",
            });
        }

        const member = await familyService.updateMemberNotifications(
            userId,
            req.params.memberId,
            req.body.notifications || req.body,
        );

        return res.status(200).json({
            success: true,

            message: "Member notification preferences updated successfully.",

            data: member,
        });
    } catch (error) {
        return handleError(
            res,
            error,
            "Unable to update notification preferences.",
        );
    }
};

// ============================================================================
// SHARE RESOURCE
// ============================================================================
//
// POST /api/family/:resourceType/:resourceId/share
//
// resourceType:
// - assets
// - subscriptions
// - documents
// - warranties
// - calendar
//
// ============================================================================

export const shareResource = async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,

                message: "Authentication required.",
            });
        }

        const resourceMap = {
            assets: "Asset",

            subscriptions: "Subscription",

            documents: "Document",

            warranties: "Warranty",

            calendar: "Calendar",
        };

        const resourceType = resourceMap[req.params.resourceType];

        if (!resourceType) {
            return res.status(400).json({
                success: false,

                message: "Invalid resource type.",
            });
        }

        const memberIds = Array.isArray(req.body.memberIds)
            ? req.body.memberIds
            : [];

        const result = await familyService.shareResource(
            userId,
            resourceType,
            req.params.resourceId,
            memberIds,
        );

        return res.status(200).json({
            success: true,

            message: `${resourceType} shared successfully.`,

            data: result,
        });
    } catch (error) {
        return handleError(res, error, "Unable to share resource.");
    }
};

// ============================================================================
// UNSHARE RESOURCE
// ============================================================================
//
// DELETE /api/family/:resourceType/:resourceId/share
//
// ============================================================================

export const unshareResource = async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,

                message: "Authentication required.",
            });
        }

        const resourceMap = {
            assets: "Asset",

            subscriptions: "Subscription",

            documents: "Document",

            warranties: "Warranty",

            calendar: "Calendar",
        };

        const resourceType = resourceMap[req.params.resourceType];

        if (!resourceType) {
            return res.status(400).json({
                success: false,

                message: "Invalid resource type.",
            });
        }

        const memberIds = Array.isArray(req.body?.memberIds)
            ? req.body.memberIds
            : [];

        const family = await familyService.unshareResource(
            userId,
            resourceType,
            req.params.resourceId,
            memberIds,
        );

        return res.status(200).json({
            success: true,

            message: `${resourceType} sharing removed successfully.`,

            data: family,
        });
    } catch (error) {
        return handleError(res, error, "Unable to remove resource sharing.");
    }
};

// ============================================================================
// GET FAMILY DASHBOARD
// ============================================================================
//
// GET /api/family/dashboard
//
// ============================================================================

export const getFamilyDashboard = async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,

                message: "Authentication required.",
            });
        }

        const dashboard = await familyService.getFamilyDashboard(userId);

        return res.status(200).json({
            success: true,

            data: dashboard,
        });
    } catch (error) {
        return handleError(res, error, "Unable to load family dashboard.");
    }
};

// ============================================================================
// GET FAMILY STATS
// ============================================================================
//
// GET /api/family/stats
//
// ============================================================================

export const getFamilyStats = async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,

                message: "Authentication required.",
            });
        }

        const stats = await familyService.getFamilyStats(userId);

        return res.status(200).json({
            success: true,

            data: stats,
        });
    } catch (error) {
        return handleError(res, error, "Unable to load family statistics.");
    }
};

// ============================================================================
// GET FAMILY ACTIVITY
// ============================================================================
//
// GET /api/family/activity
//
// ============================================================================

export const getFamilyActivity = async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,

                message: "Authentication required.",
            });
        }

        const activity = await familyService.getFamilyActivity(
            userId,
            req.query.limit,
        );

        return res.status(200).json({
            success: true,

            count: activity.length,

            data: activity,
        });
    } catch (error) {
        return handleError(res, error, "Unable to load family activity.");
    }
};

// ============================================================================
// GET FAMILY NOTIFICATIONS
// ============================================================================
//
// GET /api/family/notifications
//
// Optional:
// ?unreadOnly=true
// ?limit=20
//
// ============================================================================

export const getFamilyNotifications = async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,

                message: "Authentication required.",
            });
        }

        const unreadOnly = req.query.unreadOnly === "true";

        const notifications = await familyService.getFamilyNotifications(userId, {
            limit: req.query.limit,

            unreadOnly,
        });

        return res.status(200).json({
            success: true,

            count: notifications.length,

            data: notifications,
        });
    } catch (error) {
        return handleError(res, error, "Unable to load family notifications.");
    }
};

// ============================================================================
// MARK NOTIFICATION AS READ
// ============================================================================
//
// PATCH /api/family/notifications/:notificationId/read
//
// ============================================================================

export const markNotificationRead = async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,

                message: "Authentication required.",
            });
        }

        const notification = await familyService.markNotificationRead(
            userId,
            req.params.notificationId,
        );

        return res.status(200).json({
            success: true,

            message: "Notification marked as read.",

            data: notification,
        });
    } catch (error) {
        return handleError(res, error, "Unable to update notification.");
    }
};

// ============================================================================
// MARK ALL NOTIFICATIONS AS READ
// ============================================================================
//
// PATCH /api/family/notifications/read-all
//
// ============================================================================

export const markAllNotificationsRead = async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,

                message: "Authentication required.",
            });
        }

        const family = await familyService.markAllNotificationsRead(userId);

        return res.status(200).json({
            success: true,

            message: "All family notifications marked as read.",

            data: family,
        });
    } catch (error) {
        return handleError(res, error, "Unable to update notifications.");
    }
};

// ============================================================================
// ADD FAMILY ACTIVITY
// ============================================================================
//
// POST /api/family/activity
//
// This endpoint is mainly useful for internal/admin-style operations.
// Regular resource actions should eventually create activity automatically.
//
// ============================================================================

export const addFamilyActivity = async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,

                message: "Authentication required.",
            });
        }

        const family = await familyService.getFamily(userId);

        const updatedFamily = await familyService.addFamilyActivity(family._id, {
            ...req.body,

            actor: userId,
        });

        return res.status(201).json({
            success: true,

            message: "Family activity recorded successfully.",

            data: updatedFamily,
        });
    } catch (error) {
        return handleError(res, error, "Unable to record family activity.");
    }
};

// ============================================================================
// UPDATE FAMILY SETTINGS
// ============================================================================
//
// PATCH /api/family/settings
//
// ============================================================================

export const updateFamilySettings = async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,

                message: "Authentication required.",
            });
        }

        const family = await familyService.updateFamily(userId, {
            settings: req.body.settings || req.body,
        });

        return res.status(200).json({
            success: true,

            message: "Family settings updated successfully.",

            data: family.settings,
        });
    } catch (error) {
        return handleError(res, error, "Unable to update family settings.");
    }
};

// ============================================================================
// CLEAN EXPIRED INVITATIONS
// ============================================================================
//
// POST /api/family/invitations/cleanup
//
// Owner-only endpoint for now.
//
// ============================================================================

export const cleanExpiredInvitations = async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,

                message: "Authentication required.",
            });
        }

        const family = await familyService.getFamily(userId);

        const updatedFamily = await familyService.cleanExpiredInvitations(
            family._id,
        );

        return res.status(200).json({
            success: true,

            message: "Expired invitations cleaned successfully.",

            data: updatedFamily,
        });
    } catch (error) {
        return handleError(res, error, "Unable to clean expired invitations.");
    }
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    createFamily,

    getFamily,

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

    getFamilyDashboard,

    getFamilyStats,

    getFamilyActivity,

    getFamilyNotifications,

    markNotificationRead,

    markAllNotificationsRead,

    addFamilyActivity,

    updateFamilySettings,

    cleanExpiredInvitations,
};
