// src/contexts/AuthContext.jsx
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
  const [authLoading, setAuthLoading] = useState(false);

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
      console.log('Verifying token...');
      const response = await authAPI.verify();
      console.log('Token verification response:', response.data);
      setUser(response.data.user);
    } catch (error) {
      console.error('Token verification failed:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setAuthLoading(true);
      console.log('Attempting login with:', { email });
      
      const response = await authAPI.login({ email, password });
      console.log('Login API response:', response);
      
      if (!response.data) {
        throw new Error('No data received from server');
      }
      
      const { user, token } = response.data;
      
      if (!token) {
        throw new Error('No token received from server');
      }
      
      localStorage.setItem('token', token);
      setUser(user);
      
      return { success: true, user };
    } catch (error) {
      console.error('Login error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        code: error.code
      });
      
      let message = 'Login failed';
      
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.response?.data?.error) {
        message = error.response.data.error;
      } else if (error.message) {
        message = error.message;
      }
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        message = 'Invalid email or password';
      } else if (error.response?.status === 404) {
        message = 'Server endpoint not found';
      } else if (error.code === 'NETWORK_ERROR') {
        message = 'Network error. Please check your connection.';
      }
      
      return { 
        success: false, 
        message 
      };
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setAuthLoading(true);
      console.log('Attempting registration with:', userData);
      
      // Map frontend fields to backend schema
      const backendUserData = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role,
        phone: userData.phone,
        profile: {
          location: userData.location
        },
        ...(userData.role === 'agronomist' && {
          category: userData.category,
          profile: {
            ...(userData.location && { location: userData.location }),
            ...(userData.bio && { bio: userData.bio })
          }
        })
      };

      console.log('Sending registration data to backend:', backendUserData);
      
      const response = await authAPI.register(backendUserData);
      console.log('Registration API response:', response);
      
      if (!response.data) {
        throw new Error('No data received from server');
      }
      
      const { user, token } = response.data;
      
      if (!token) {
        throw new Error('No token received from server');
      }
      
      localStorage.setItem('token', token);
      setUser(user);
      
      return { success: true, user };
    } catch (error) {
      console.error('Registration error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        code: error.code
      });
      
      let message = 'Registration failed';
      
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.response?.data?.error) {
        message = error.response.data.error;
      } else if (error.message) {
        message = error.message;
      }
      
      // Handle specific error cases
      if (error.response?.status === 400) {
        message = 'Invalid data provided';
      } else if (error.response?.status === 409) {
        message = 'Email already exists';
      } else if (error.response?.status === 404) {
        message = 'Server endpoint not found';
      } else if (error.code === 'NETWORK_ERROR') {
        message = 'Network error. Please check your connection.';
      }
      
      return { 
        success: false, 
        message 
      };
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    console.log('Logging out user...');
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateUser = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    loading,
    authLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};