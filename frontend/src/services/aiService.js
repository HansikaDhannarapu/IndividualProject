import { apiRequest } from './api';

export const suggestPrice = (payload) =>
  apiRequest('/api/ai/price', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const generateDescription = (payload) =>
  apiRequest('/api/ai/description', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const detectScam = (payload) =>
  apiRequest('/api/ai/scam-check', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
