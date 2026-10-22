
import api from "../lib/axios.js";

const BASE_URL = "/notifications";

/**
 * Fetch notifications with optional filters and pagination.
 *
 * Supported params:
 * page, limit, category, unread
 */
export const getNotifications = async (params = {}) => {
    const response = await api.get(BASE_URL, {
        params,
    });

    return response.data;
};

/**
 * Fetch unread notification count.
 */
export const getUnreadCount = async () => {
    const response = await api.get(`${BASE_URL}/unread-count`);

    return response.data;
};

export const getNotificationPreferences = async () => {
    const response = await api.get(`${BASE_URL}/preferences`);
    return response.data;
};

export const updateNotificationPreferences = async (preferences) => {
    const response = await api.put(`${BASE_URL}/preferences`, preferences);
    return response.data;
};

export const sendTestNotification = async (channel) => {
    const response = await api.post(`${BASE_URL}/test`, { channel });
    return response.data;
};

/**
 * Toggle a notification between read and unread.
 */
export const markNotificationRead = async (id) => {
    if (!id) {
        throw new Error("Notification ID is required.");
    }

    const response = await api.patch(
        `${BASE_URL}/${encodeURIComponent(id)}/read`
    );

    return response.data;
};

/**
 * Mark all notifications as read.
 */
export const markAllNotificationsRead = async () => {
    const response = await api.patch(`${BASE_URL}/read-all`);

    return response.data;
};

/**
 * Dismiss a notification.
 */
export const dismissNotification = async (id) => {
    if (!id) {
        throw new Error("Notification ID is required.");
    }

    const response = await api.patch(
        `${BASE_URL}/${encodeURIComponent(id)}/dismiss`
    );

    return response.data;
};

const notificationService = {
    getNotifications,
    getUnreadCount,
    getNotificationPreferences,
    updateNotificationPreferences,
    sendTestNotification,
    markNotificationRead,
    markAllNotificationsRead,
    dismissNotification,
};

export default notificationService;
