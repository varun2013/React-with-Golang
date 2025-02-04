import { API } from "../api";
import {
  FETCH_LATEST_NOTIFICATION_API,
  NOTIFICATION_API,
} from "../constants/api-constants";

// Fetch all notifications
const fetchAllNotifications = (params: any) => {
  return API.get(NOTIFICATION_API, params);
};

// Fetch the latest notification
const fetchLatestNotification = (params: any) => {
  return API.get(FETCH_LATEST_NOTIFICATION_API, params);
};

// Mark a specific notification as read
const markNotificationAsRead = (payload: any, notificationId: string) => {
  return API.patch(`${NOTIFICATION_API}/${notificationId}/mark-read`, payload);
};

// Mark all notifications as read
const markAllNotificationsAsRead = (payload: any) => {
  return API.patch(`${NOTIFICATION_API}/mark-all-read`, payload);
};

// delete notification
const deleteNotification = (params: any) => {
  return API.delete(NOTIFICATION_API, params);
};

// delete specific notification
const deleteSpecificNotification = (payload: any, notificationId: string) => {
  return API.delete(`${NOTIFICATION_API}/${notificationId}`, payload);
};

// eslint-disable-next-line
export const notificationServices = {
  fetchAllNotifications,
  fetchLatestNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteSpecificNotification,
};
