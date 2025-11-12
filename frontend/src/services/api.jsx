// src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  verify: () => api.get('/api/auth/verify'),
};

// src/services/api.js - Update the usersAPI section

export const usersAPI = {
  // Get all users and filter for agronomists on the frontend
  getAllUsers: () => api.get('/api/users').catch(error => {
    console.warn('Users endpoint not available, using mock data');
    // Return mock data if endpoint doesn't exist
    if (error.response?.status === 404)   throw error;
  }),

  // If you have a specific endpoint for agronomists, use this instead:
  getAgronomists: () => api.get('/api/users?userType=agronomist').catch(error => {
    console.warn('Agronomists filter not available, using getAllUsers fallback');
    return usersAPI.getAllUsers();
  }),

  getUserStats: () => api.get('/api/users/stats').catch(error => {
    if (error.response?.status === 404) {
      return { data: {
        totalConsultations: 0,
        pendingConsultations: 0,
        completedConsultations: 0,
        subscriptionStatus: 'inactive',
        hasPaidPlatformFee: false
      }};
    }
    throw error;
  }),

  updateProfile: (userData) => api.patch('/api/users/profile', userData),
};



// ConsultationsAPI 
export const consultationsAPI = {
  getAll: () => api.get('/api/consultations').then(response => {
    // Ensure response.data is always an array
    return {
      ...response,
      data: Array.isArray(response.data) ? response.data : []
    };
  }).catch(error => {
    console.warn('Consultations endpoint not available, using empty array');
    return { data: [] };
  }),
  
  getRecent: () => api.get('/api/consultations?limit=3').then(response => {
    // Ensure response.data is always an array
    return {
      ...response,
      data: Array.isArray(response.data) ? response.data : []
    };
  }).catch(error => {
    console.warn('Recent consultations endpoint not available, using getAll fallback');
    return consultationsAPI.getAll().then(response => {
      const allConsultations = Array.isArray(response.data) ? response.data : [];
      const recent = allConsultations
        .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
        .slice(0, 3);
      return { data: recent };
    });
  }),
  
  getById: (id) => api.get(`/api/consultations/${id}`),
  create: (consultationData) => api.post('/api/consultations', consultationData),
  update: (id, updateData) => api.patch(`/api/consultations/${id}`, updateData),
  cancel: (id) => api.patch(`/api/consultations/${id}`, { status: 'cancelled' }),
};


// SubscriptionsAPI
export const subscriptionsAPI = {
  get: () => api.get('/api/subscriptions').then(response => {
    return {
      ...response,
      data: Array.isArray(response.data) ? response.data : []
    };
  }).catch(error => {
    console.warn('Subscriptions endpoint not available, using empty array');
    return { data: [] };
  }),
  
  getPayments: () => api.get('/api/subscriptions/payments').then(response => {
    return {
      ...response,
      data: Array.isArray(response.data) ? response.data : []
    };
  }).catch(error => {
    console.warn('Payments endpoint not available, using empty array');
    return { data: [] };
  }),
  
  payPlatformFee: () => api.post('/api/subscriptions/pay-platform-fee'),
  createSubscription: (planId) => api.post('/api/subscriptions', { planId }),
  cancelSubscription: (id) => api.patch(`/api/subscriptions/${id}`, { active: false }),
};
export default api;