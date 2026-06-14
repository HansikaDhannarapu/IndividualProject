import { apiRequest } from './api';

export const getProducts = (params = {}) => {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== '' && value !== undefined)
  ).toString();
  return apiRequest(`/api/products${query ? `?${query}` : ''}`);
};

export const getProduct = (id) => apiRequest(`/api/products/${id}`);

export const createProduct = (payload) =>
  apiRequest('/api/products', {
    method: 'POST',
    body: payload,
  });

export const getMyProducts = () => apiRequest('/api/products/mine');

export const getSellerProducts = (sellerId) => apiRequest(`/api/products/seller/${sellerId}`);

export const updateProduct = (id, payload) =>
  apiRequest(`/api/products/${id}`, {
    method: 'PUT',
    body: payload instanceof FormData ? payload : JSON.stringify(payload),
  });

export const deleteProduct = (id) =>
  apiRequest(`/api/products/${id}`, {
    method: 'DELETE',
  });
