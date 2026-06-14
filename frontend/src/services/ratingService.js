import { apiRequest } from './api';

export const getSellerRatings = (sellerId) => apiRequest(`/api/ratings/seller/${sellerId}`);

export const createRating = (payload) =>
  apiRequest('/api/ratings', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
