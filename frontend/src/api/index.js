const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

export const authApi = {
  login: (credentials) => apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  register: (userData) => apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
};

export const recordsApi = {
  getRecords: (params = '') => apiFetch(`/records${params}`),
  createRecord: (record) => apiFetch('/records', {
    method: 'POST',
    body: JSON.stringify(record),
  }),
  deleteRecord: (id) => apiFetch(`/records/${id}`, {
    method: 'DELETE',
  }),
};

export const dashboardApi = {
  getSummary: () => apiFetch('/dashboard/summary'),
  getBreakdown: () => apiFetch('/dashboard/category-breakdown'),
};
