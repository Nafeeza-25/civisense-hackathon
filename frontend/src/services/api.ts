// API Configuration - Real backend
export const API_BASE_URL = 'http://127.0.0.1:8000';

export const API_ENDPOINTS = {
  complaint: `${API_BASE_URL}/complaint`,
  dashboard: `${API_BASE_URL}/dashboard`,
  updateStatus: (id: string) => `${API_BASE_URL}/status/${id}`,
} as const;
