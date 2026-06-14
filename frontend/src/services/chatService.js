import { apiRequest } from './api';

export const createOrGetChat = ({ sellerId, productId }) =>
  apiRequest('/api/chats', {
    method: 'POST',
    body: JSON.stringify({ sellerId, productId }),
  });

export const getMyChats = () => apiRequest('/api/chats');
