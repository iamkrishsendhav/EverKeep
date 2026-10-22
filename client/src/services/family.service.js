// ============================================================================
// EVERKEEP — FAMILY API SERVICE
// ============================================================================
//
// Centralized API layer for the Family Workspace.
//
// Responsibilities:
// - Family CRUD
// - Member management
// - Invitations
// - Permissions
// - Notification preferences
// - Dashboard / statistics
// - Activity
// - Notifications
//
// UI components should NOT call fetch/axios directly.
// All Family API communication should come through this file.
//
// ============================================================================

// ============================================================================
// API CONFIGURATION
// ============================================================================

import api from "../lib/axios";

// ============================================================================
// CUSTOM API ERROR
// ============================================================================

class FamilyApiError extends Error {
    constructor(message, status = 500, data = null) {
        super(message);

        this.name = "FamilyApiError";

        this.status = status;

        this.data = data;
    }
}

// ============================================================================
// ============================================================================
// REQUEST HELPER
// ============================================================================

const request = async (endpoint, options = {}) => {
    try {
        const { method = "GET", body, ...config } = options;
        const response = await api.request({
            url: `/family${endpoint}`,
            method,
            data: body,
            ...config,
        });
        return response.data;
    } catch (error) {
        const status = error?.response?.status || 0;
        const data = error?.response?.data || null;
        const message = status === 401
            ? "Your session has expired. Please log in again."
            : status === 403
                ? data?.message || "You do not have permission to access this Family resource."
                : data?.message || (status
                    ? "Something went wrong while processing the Family request."
                    : "Unable to connect to EverKeep server.");
        throw new FamilyApiError(message, status, data || error);
    }
};

// ============================================================================
// RESPONSE DATA HELPER
// ============================================================================

const getData = (response, fallback = null) => {
    return response?.data ?? fallback;
};

// ============================================================================
// FAMILY
// ============================================================================

// ============================================================================
// GET CURRENT FAMILY
// GET /api/family
// ============================================================================

export const getFamily = async () => {
    const response = await request("/");

    return getData(response, null);
};

// ============================================================================
// CREATE FAMILY
// POST /api/family
// ============================================================================

export const createFamily = async (familyData) => {
    const response = await request("/", {
        method: "POST",
        body: familyData,
    });

    return getData(response);
};

// ============================================================================
// UPDATE FAMILY
// PATCH /api/family
// ============================================================================

export const updateFamily = async (familyData) => {
    const response = await request("/", {
        method: "PATCH",
        body: familyData,
    });

    return getData(response);
};

// ============================================================================
// FAMILY DASHBOARD
// GET /api/family/dashboard
// ============================================================================

export const getFamilyDashboard = async () => {
    const response = await request("/dashboard");

    return getData(response, {});
};

// ============================================================================
// FAMILY STATS
// GET /api/family/stats
// ============================================================================

export const getFamilyStats = async () => {
    const response = await request("/stats");

    return getData(response, {});
};

// ============================================================================
// FAMILY SETTINGS
// PATCH /api/family/settings
// ============================================================================

export const updateFamilySettings = async (settings) => {
    const response = await request("/settings", {
        method: "PATCH",
        body: settings,
    });

    return getData(response);
};

// ============================================================================
// MEMBERS
// ============================================================================

// ============================================================================
// GET ALL MEMBERS
// GET /api/family/members
// ============================================================================

export const getFamilyMembers = async () => {
    const response = await request("/members");

    return getData(response, []);
};

// ============================================================================
// GET SINGLE MEMBER
// GET /api/family/members/:memberId
// ============================================================================

export const getFamilyMember = async (memberId) => {
    if (!memberId) {
        throw new FamilyApiError("Member ID is required.", 400);
    }

    const response = await request(`/members/${memberId}`);

    return getData(response);
};

// ============================================================================
// INVITE MEMBER
// POST /api/family/members/invite
// ============================================================================

export const inviteFamilyMember = async (memberData) => {
    const response = await request("/members/invite", {
        method: "POST",
        body: memberData,
    });

    return getData(response);
};

// ============================================================================
// UPDATE MEMBER
// PATCH /api/family/members/:memberId
// ============================================================================

export const updateFamilyMember = async (memberId, memberData) => {
    if (!memberId) {
        throw new FamilyApiError("Member ID is required.", 400);
    }

    const response = await request(`/members/${memberId}`, {
        method: "PATCH",
        body: memberData,
    });

    return getData(response);
};

// ============================================================================
// REMOVE MEMBER
// DELETE /api/family/members/:memberId
// ============================================================================

export const removeFamilyMember = async (memberId) => {
    if (!memberId) {
        throw new FamilyApiError("Member ID is required.", 400);
    }

    const response = await request(`/members/${memberId}`, {
        method: "DELETE",
    });

    return getData(response);
};

// ============================================================================
// MEMBER PERMISSIONS
// ============================================================================

// ============================================================================
// UPDATE MEMBER PERMISSIONS
// PATCH /api/family/members/:memberId/permissions
// ============================================================================

export const updateFamilyMemberPermissions = async (memberId, permissions) => {
    if (!memberId) {
        throw new FamilyApiError("Member ID is required.", 400);
    }

    const response = await request(`/members/${memberId}/permissions`, {
        method: "PATCH",
        body: permissions,
    });

    return getData(response);
};

// ============================================================================
// UPDATE MEMBER NOTIFICATIONS
// PATCH /api/family/members/:memberId/notifications
// ============================================================================

export const updateFamilyMemberNotifications = async (
    memberId,
    notifications,
) => {
    if (!memberId) {
        throw new FamilyApiError("Member ID is required.", 400);
    }

    const response = await request(`/members/${memberId}/notifications`, {
        method: "PATCH",
        body: notifications,
    });

    return getData(response);
};

// ============================================================================
// INVITATIONS
// ============================================================================

// ============================================================================
// ACCEPT INVITATION
// POST /api/family/invitations/:token/accept
// ============================================================================

export const acceptFamilyInvitation = async (token) => {
    if (!token) {
        throw new FamilyApiError("Invitation token is required.", 400);
    }

    const response = await request(
        `/invitations/${encodeURIComponent(token)}/accept`,
        {
            method: "POST",
        },
    );

    return getData(response);
};

// ============================================================================
// RESEND INVITATION
// POST /api/family/invitations/:invitationId/resend
// ============================================================================

export const resendFamilyInvitation = async (invitationId) => {
    if (!invitationId) {
        throw new FamilyApiError("Invitation ID is required.", 400);
    }

    const response = await request(`/invitations/${invitationId}/resend`, {
        method: "POST",
    });

    return getData(response);
};

// ============================================================================
// CANCEL INVITATION
// DELETE /api/family/invitations/:invitationId
// ============================================================================

export const cancelFamilyInvitation = async (invitationId) => {
    if (!invitationId) {
        throw new FamilyApiError("Invitation ID is required.", 400);
    }

    const response = await request(`/invitations/${invitationId}`, {
        method: "DELETE",
    });

    return getData(response);
};

// ============================================================================
// CLEAN EXPIRED INVITATIONS
// POST /api/family/invitations/cleanup
// ============================================================================

export const cleanExpiredFamilyInvitations = async () => {
    const response = await request("/invitations/cleanup", {
        method: "POST",
    });

    return getData(response);
};

// ============================================================================
// RESOURCE SHARING
// ============================================================================

// ============================================================================
// SHARE RESOURCE
// POST /api/family/:resourceType/:resourceId/share
// ============================================================================

export const shareFamilyResource = async (
    resourceType,
    resourceId,
    shareData,
) => {
    if (!resourceType) {
        throw new FamilyApiError("Resource type is required.", 400);
    }

    if (!resourceId) {
        throw new FamilyApiError("Resource ID is required.", 400);
    }

    const response = await request(
        `/${encodeURIComponent(resourceType)}/${resourceId}/share`,
        {
            method: "POST",
            body: shareData,
        },
    );

    return getData(response);
};

// ============================================================================
// UNSHARE RESOURCE
// DELETE /api/family/:resourceType/:resourceId/share
// ============================================================================

export const unshareFamilyResource = async (
    resourceType,
    resourceId,
    data = {},
) => {
    if (!resourceType) {
        throw new FamilyApiError("Resource type is required.", 400);
    }

    if (!resourceId) {
        throw new FamilyApiError("Resource ID is required.", 400);
    }

    const response = await request(
        `/${encodeURIComponent(resourceType)}/${resourceId}/share`,
        {
            method: "DELETE",
            body: data,
        },
    );

    return getData(response);
};

// ============================================================================
// ACTIVITY
// ============================================================================

// ============================================================================
// GET FAMILY ACTIVITY
// GET /api/family/activity
// ============================================================================

export const getFamilyActivity = async (params = {}) => {
    const response = await request("/activity", {
        params,
    });

    return getData(response, []);
};

// ============================================================================
// ADD FAMILY ACTIVITY
// POST /api/family/activity
// ============================================================================

export const addFamilyActivity = async (activityData) => {
    const response = await request("/activity", {
        method: "POST",
        body: activityData,
    });

    return getData(response);
};

// ============================================================================
// NOTIFICATIONS
// ============================================================================

// ============================================================================
// GET FAMILY NOTIFICATIONS
// GET /api/family/notifications
// ============================================================================

export const getFamilyNotifications = async (params = {}) => {
    const response = await request("/notifications", {
        params,
    });

    return getData(response, []);
};

// ============================================================================
// MARK NOTIFICATION AS READ
// PATCH /api/family/notifications/:notificationId/read
// ============================================================================

export const markFamilyNotificationRead = async (notificationId) => {
    if (!notificationId) {
        throw new FamilyApiError("Notification ID is required.", 400);
    }

    const response = await request(`/notifications/${notificationId}/read`, {
        method: "PATCH",
    });

    return getData(response);
};

// ============================================================================
// MARK ALL NOTIFICATIONS AS READ
// PATCH /api/family/notifications/read-all
// ============================================================================

export const markAllFamilyNotificationsRead = async () => {
    const response = await request("/notifications/read-all", {
        method: "PATCH",
    });

    return getData(response);
};

// ============================================================================
// EXPORT ERROR CLASS
// ============================================================================

export { FamilyApiError };

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
    // Family
    getFamily,
    createFamily,
    updateFamily,

    // Dashboard
    getFamilyDashboard,
    getFamilyStats,

    // Settings
    updateFamilySettings,

    // Members
    getFamilyMembers,
    getFamilyMember,
    inviteFamilyMember,
    updateFamilyMember,
    removeFamilyMember,

    // Permissions
    updateFamilyMemberPermissions,
    updateFamilyMemberNotifications,

    // Invitations
    acceptFamilyInvitation,
    resendFamilyInvitation,
    cancelFamilyInvitation,
    cleanExpiredFamilyInvitations,

    // Sharing
    shareFamilyResource,
    unshareFamilyResource,

    // Activity
    getFamilyActivity,
    addFamilyActivity,

    // Notifications
    getFamilyNotifications,
    markFamilyNotificationRead,
    markAllFamilyNotificationsRead,
};
