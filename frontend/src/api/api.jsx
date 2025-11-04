// src/api/api.js
import axios from 'axios';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token from localStorage on every request
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('fc_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch (e) {
    // ignore
  }
  return config;
});

// Normalize errors; on 401 clear token and surface message
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (!error.response) {
      return Promise.reject({ message: error.message || 'Network Error', status: null, original: error });
    }
    const { status, data } = error.response;
    if (status === 401) {
      localStorage.removeItem('fc_token');
      // do not redirect here — let UI handle it if needed
      return Promise.reject({ message: data?.message || 'Unauthorized', status: 401, original: error });
    }
    return Promise.reject({ message: data?.message || error.message || 'Request failed', status, original: error });
  }
);

export default api;
