import { apiRequest } from './api';

export const register = async (payload) => {
  return apiRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const login = async (payload) => {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const getCurrentUser = async () => {
  return apiRequest('/api/auth/me');
};

export const changePassword = async (payload) => {
  return apiRequest('/api/auth/password', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
};
