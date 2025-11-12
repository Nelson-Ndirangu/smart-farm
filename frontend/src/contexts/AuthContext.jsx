import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await authAPI.verify();
      setUser(response.data.user);
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      setUser(user);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data?.error || 'Login failed';
      return { 
        success: false, 
        message 
      };
    }
  };

  const register = async (userData) => {
    try {
      console.log('Registering user with data:', userData);
      
      // Map frontend field names to backend schema
      const backendUserData = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role, // Using 'role' instead of 'userType'
        phone: userData.phone,
        profile: {
          location: userData.location,
          bio: userData.bio // if you add bio field to register form
        },
        category: userData.category || 'conventional' // default category
      };

      const response = await authAPI.register(backendUserData);
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      setUser(user);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error.response?.data);
      const message = error.response?.data?.message || error.response?.data?.error || 'Registration failed';
      return { 
        success: false, 
        message 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateUser = (updatedUserData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...updatedUserData
    }));
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};