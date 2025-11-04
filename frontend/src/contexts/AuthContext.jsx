import React, { createContext, useContext, useEffect, useState } from 'react';
import authService from '../api/authService';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('fc_user') || 'null');
    } catch {
      return null;
    }
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Keep localStorage synced
    if (user) localStorage.setItem('fc_user', JSON.stringify(user));
    else localStorage.removeItem('fc_user');
  }, [user]);

  const login = async (email, password) => {
    const { token, user: u } = await authService.login({ email, password });
    if (token) {
      setUser(u);
    }
    return { token, user: u };
  };

  const register = async (payload) => {
    const res = await authService.register(payload);
    // backend returns token & user; register route created earlier returns { user, token }
    if (res.token) localStorage.setItem('fc_token', res.token);
    if (res.user) setUser(res.user);
    return res;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    navigate('/login');
  };

  const fetchProfile = async () => {
    const res = await api.get('/users/me');
    setUser(res.data.user);
    return res.data.user;
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
