// src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Reduced from 15000 to 8000ms
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use((config) => {
  console.log(`🔄 ${config.method?.toUpperCase()} ${config.url}`);
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(` ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
    return response;
  },
  (error) => {
    // Don't log timeout errors for better readability
    if (error.code !== 'ECONNABORTED') {
      console.error('❌ API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: error.message
      });
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      setTimeout(() => {
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }, 100);
    }
    
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  verify: () => api.get('/api/auth/verify'),
};

export const usersAPI = {
  getAgronomists: () => api.get('/api/users/search/agronomists'),
  getUserStats: () => api.get('/api/users/stats'),
  updateProfile: (userData) => api.patch('/api/users/profile', userData),
};

export const consultationsAPI = {
  getAll: () => api.get('/api/consultations'),
  getRecent: () => api.get('/api/consultations?limit=3'),
  getById: (id) => api.get(`/api/consultations/${id}`),
  create: (consultationData) => api.post('/api/consultations', consultationData),
  update: (id, updateData) => api.patch(`/api/consultations/${id}`, updateData),
  cancel: (id) => api.patch(`/api/consultations/${id}`, { status: 'cancelled' }),
};

export const subscriptionsAPI = {
  get: () => api.get('/api/subscriptions'),
  getPayments: () => api.get('/api/subscriptions/payments'),
  payPlatformFee: () => api.post('/api/subscriptions/pay-platform-fee'),
  createSubscription: (planId) => api.post('/api/subscriptions', { planId }),
  cancelSubscription: (id) => api.patch(`/api/subscriptions/${id}`, { active: false }),
};

export const chatAPI = {
  getChats: () => api.get('/api/chat'),
  getChat: (chatId) => api.get(`/api/chat/${chatId}`),
  getOrCreateChat: (consultationId) => api.post(`/api/chat/consultation/${consultationId}`),
  sendMessage: (chatId, messageData) => api.post(`/api/chat/${chatId}/messages`, messageData),
  markAsRead: (chatId) => api.patch(`/api/chat/${chatId}/messages/read`),
};

export default api;