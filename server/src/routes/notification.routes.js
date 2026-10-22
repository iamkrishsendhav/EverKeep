
import express from "express";

import {
    getNotifications,
    getUnreadCount,
    markAllNotificationsRead,
    markNotificationRead,
    dismissNotification,
    createNotification,
    getNotificationPreferences,
    updateNotificationPreferences,
    createTestNotification,
} from "../controllers/notification.controller.js";

// IMPORTANT:
// Replace this import with the exact path/export used by your project
// if your existing authentication middleware has a different name.
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// All notification routes require authentication.
router.use(authMiddleware);

// GET /api/notifications
router.get("/", getNotifications);

// GET /api/notifications/unread-count
// Keep this static route before /:id routes.
router.get("/unread-count", getUnreadCount);
router.get("/preferences", getNotificationPreferences);
router.put("/preferences", updateNotificationPreferences);
router.post("/test", createTestNotification);

// PATCH /api/notifications/read-all
router.patch("/read-all", markAllNotificationsRead);

// PATCH /api/notifications/:id/read
router.patch("/:id/read", markNotificationRead);

// PATCH /api/notifications/:id/dismiss
router.patch("/:id/dismiss", dismissNotification);

// POST /api/notifications
router.post("/", createNotification);

export default router;
