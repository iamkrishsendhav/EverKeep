import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import {
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
} from "../controllers/family.controller.js";

const router = express.Router();

// ============================================================================
// FAMILY ROUTES
// ============================================================================
//
// Base URL:
//
// /api/family
//
// All Family routes are protected by authentication.
//
// ============================================================================

router.use(authMiddleware);

// ============================================================================
// FAMILY
// ============================================================================

// Create Family
router.post("/", createFamily);

// Get Current User's Family
router.get("/", getFamily);

// Update Family
router.patch("/", updateFamily);

// ============================================================================
// FAMILY DASHBOARD
// ============================================================================

// Complete Family Dashboard
router.get("/dashboard", getFamilyDashboard);

// Family Statistics
router.get("/stats", getFamilyStats);

// ============================================================================
// FAMILY SETTINGS
// ============================================================================

router.patch("/settings", updateFamilySettings);

// ============================================================================
// FAMILY MEMBERS
// ============================================================================

// Get All Members
router.get("/members", getFamilyMembers);

// Get Single Member
router.get("/members/:memberId", getFamilyMember);

// Update Member
router.patch("/members/:memberId", updateMember);

// Remove Member
router.delete("/members/:memberId", removeMember);

// ============================================================================
// MEMBER PERMISSIONS
// ============================================================================

router.patch("/members/:memberId/permissions", updateMemberPermissions);

// ============================================================================
// MEMBER NOTIFICATION PREFERENCES
// ============================================================================

router.patch("/members/:memberId/notifications", updateMemberNotifications);

// ============================================================================
// FAMILY INVITATIONS
// ============================================================================

// Send Invitation
router.post("/members/invite", inviteMember);

// Accept Invitation
router.post("/invitations/:token/accept", acceptInvitation);

// Resend Invitation
router.post("/invitations/:invitationId/resend", resendInvitation);

// Cancel Invitation
router.delete("/invitations/:invitationId", cancelInvitation);

// Cleanup Expired Invitations
router.post("/invitations/cleanup", cleanExpiredInvitations);

// ============================================================================
// RESOURCE SHARING
// ============================================================================
//
// Supported resource types:
//
// /assets
// /subscriptions
// /documents
// /warranties
// /calendar
//
// ============================================================================

// Share Resource
router.post("/:resourceType/:resourceId/share", shareResource);

// Remove Resource Sharing
router.delete("/:resourceType/:resourceId/share", unshareResource);

// ============================================================================
// FAMILY ACTIVITY
// ============================================================================

// Get Activity
router.get("/activity", getFamilyActivity);

// Add Activity
router.post("/activity", addFamilyActivity);

// ============================================================================
// FAMILY NOTIFICATIONS
// ============================================================================

// Get Notifications
router.get("/notifications", getFamilyNotifications);

// Mark One Notification as Read
router.patch("/notifications/:notificationId/read", markNotificationRead);

// Mark All Notifications as Read
router.patch("/notifications/read-all", markAllNotificationsRead);

// ============================================================================
// EXPORT
// ============================================================================

export default router;
