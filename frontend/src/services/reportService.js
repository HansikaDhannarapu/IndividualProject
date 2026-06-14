import { apiRequest } from './api';

export const createReport = (payload) =>
  apiRequest('/api/reports', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const updateReport = (reportId, payload) =>
  apiRequest(`/api/reports/${reportId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
