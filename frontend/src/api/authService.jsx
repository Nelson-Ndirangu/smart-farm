// src/api/authService.js
import api from './api';

const authService = {
  register: async ({ name, email, password, role = 'farmer', phone }) => {
    const res = await api.post('/auth/register', { name, email, password, role, phone });
    return res.data;
  },

  login: async ({ email, password }) => {
    const res = await api.post('/auth/login', { email, password });
    // backend returns { token, user }
    const { token, user } = res.data;
    if (token) {
      localStorage.setItem('fc_token', token);
    }
    return { token, user };
  },

  logout: () => {
    localStorage.removeItem('fc_token');
    localStorage.removeItem('fc_user');
    // optionally call backend logout endpoint if you implement it
  },

  forgotPassword: async ({ email }) => {
    return api.post('/auth/forgot-password', { email });
  },

  resetPassword: async ({ token, id, password }) => {
    // backend expects token & id in query for reset
    return api.post(`/auth/reset-password?token=${encodeURIComponent(token)}&id=${encodeURIComponent(id)}`, { password });
  }
};

export default authService;
