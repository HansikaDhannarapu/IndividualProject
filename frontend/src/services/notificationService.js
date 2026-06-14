import { apiRequest } from './api';

export const NOTIFICATIONS_READ_EVENT = 'notificationsRead';

export const notifyNotificationsRead = (detail = {}) => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(NOTIFICATIONS_READ_EVENT, { detail }));
};

export const getNotifications = () => apiRequest('/api/notifications');

export const markNotificationsRead = async (filters = {}) => {
  const data = await apiRequest('/api/notifications/read', {
    method: 'PUT',
    body: JSON.stringify(filters),
  });
  notifyNotificationsRead({
    ...filters,
    hasUnread: data.hasUnread,
    removed: data.removed,
  });
  return data;
};
