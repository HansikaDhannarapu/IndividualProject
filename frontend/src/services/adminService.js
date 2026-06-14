import { apiRequest } from './api';

export const getAdminDashboard = () => apiRequest('/api/admin');

export const setUserBan = (userId, banned) =>
  apiRequest(`/api/admin/users/${userId}/ban`, {
    method: 'PUT',
    body: JSON.stringify({ banned }),
  });

export const setProductFlag = (productId, payload) =>
  apiRequest(`/api/admin/products/${productId}/flag`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

export const removeProduct = (productId) =>
  apiRequest(`/api/admin/products/${productId}`, {
    method: 'DELETE',
  });
