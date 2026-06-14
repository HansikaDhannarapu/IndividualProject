import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'https://individualproject-2b0a.onrender.com';

const api = axios.create({
  baseURL: API_URL,
});

export const getStoredUser = () => {
  const raw = localStorage.getItem('user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const getToken = () => localStorage.getItem('token');

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const apiRequest = async (path, options = {}) => {
  try {
    const isFormData = options.body instanceof FormData || options.data instanceof FormData;
    const response = await api({
      url: path,
      method: options.method || 'GET',
      data: isFormData ? options.body || options.data : options.body ? JSON.parse(options.body) : options.data,
      headers: options.headers,
    });

    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.msg || 'Request failed');
  }
};

export default api;
