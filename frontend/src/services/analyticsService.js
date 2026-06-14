import { apiRequest } from './api';

export const getMarketplaceAnalytics = () => apiRequest('/api/analytics');
