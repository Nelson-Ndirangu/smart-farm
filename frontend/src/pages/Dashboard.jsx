// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { consultationsAPI, subscriptionsAPI } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalConsultations: 0,
    pendingConsultations: 0,
    completedConsultations: 0,
    subscriptionStatus: 'inactive',
    hasPaidPlatformFee: false
  });
  const [recentConsultations, setRecentConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setErrors([]);

      // Fetch consultations data
      let consultationsData = [];
      let userStats = {
        totalConsultations: 0,
        pendingConsultations: 0,
        completedConsultations: 0,
        subscriptionStatus: 'inactive',
        hasPaidPlatformFee: false
      };

      try {
        // Use the main consultations endpoint that exists
        console.log('Fetching consultations from /api/consultations');
        const consultationsResponse = await consultationsAPI.getAll();
        console.log('Consultations response:', consultationsResponse.data);
        
        consultationsData = Array.isArray(consultationsResponse.data) 
          ? consultationsResponse.data 
          : [];

        // Calculate stats from consultations data
        userStats.totalConsultations = consultationsData.length;
        userStats.pendingConsultations = consultationsData.filter(c => c.status === 'pending').length;
        userStats.completedConsultations = consultationsData.filter(c => c.status === 'completed').length;

        // Get recent consultations (last 3)
        const recent = consultationsData
          .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
          .slice(0, 3);
        
        setRecentConsultations(recent);

      } catch (consultationsError) {
        console.warn('Could not fetch consultations:', consultationsError.message);
        setErrors(prev => [...prev, 'Could not load consultations data']);
      }

      // Fetch subscription data
      try {
        console.log('Fetching subscription data from /api/subscriptions');
        const subscriptionResponse = await subscriptionsAPI.get();
        console.log('Subscription response:', subscriptionResponse.data);
        
        if (subscriptionResponse.data) {
          userStats.subscriptionStatus = subscriptionResponse.data.status || 'inactive';
          userStats.hasPaidPlatformFee = subscriptionResponse.data.hasPaidPlatformFee || false;
        }
      } catch (subscriptionError) {
        console.warn('Could not fetch subscription data:', subscriptionError.message);
        setErrors(prev => [...prev, 'Could not load subscription data']);
      }

      setStats(userStats);

    } catch (error) {
      console.error('Unexpected error fetching dashboard data:', error);
      setErrors(prev => [...prev, 'Failed to load dashboard data']);
    } finally {
      setLoading(false);
    }
  };

  // Safe function to render recent consultations
  const renderRecentConsultations = () => {
    const consultations = Array.isArray(recentConsultations) ? recentConsultations : [];
    
    if (consultations.length === 0) {
      return (
        <div className="text-center py-6">
          <div className="text-gray-400 text-4xl mb-3">💬</div>
          <p className="text-gray-500 mb-4">No consultations yet</p>
          <Link 
            to="/agronomists" 
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
          >
            Find Agronomists
          </Link>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {consultations.map(consultation => (
          <div key={consultation._id || consultation.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex-1">
              <p className="font-medium text-gray-900">
                {user?.role === 'farmer' 
                  ? (consultation.agronomist?.name || consultation.agronomistName || 'Agronomist')
                  : (consultation.farmer?.name || consultation.farmerName || 'Farmer')
                }
              </p>
              <p className="text-sm text-gray-500">
                {consultation.topic || consultation.issue || 'General Consultation'}
              </p>
              <p className="text-xs text-gray-400 capitalize">
                {consultation.status || 'pending'} • {new Date(consultation.createdAt || consultation.date).toLocaleDateString()}
              </p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              (consultation.status || 'pending') === 'completed' 
                ? 'bg-green-100 text-green-800'
                : (consultation.status || 'pending') === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : (consultation.status || 'pending') === 'confirmed'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {consultation.status || 'pending'}
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="mb-4 space-y-2">
            {errors.map((error, index) => (
              <div key={index} className="bg-yellow-50 border border-yellow-200 text-yellow-600 px-4 py-3 rounded">
                ⚠️ {error}
              </div>
            ))}
          </div>
        )}

        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            {user?.role === 'farmer' 
              ? 'Here\'s your farming consultation dashboard'
              : 'Manage your agronomy consultations and clients'
            }
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-green-600 text-xl">💬</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Consultations</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalConsultations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-yellow-600 text-xl">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pendingConsultations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-blue-600 text-xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.completedConsultations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-purple-600 text-xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Subscription</p>
                <p className="text-lg font-semibold capitalize text-gray-900">
                  {stats.subscriptionStatus}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Recent Consultations */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Recent Consultations</h2>
              <Link 
                to="/consultations" 
                className="text-green-600 hover:text-green-700 font-medium"
              >
                View All
              </Link>
            </div>
            
            {renderRecentConsultations()}
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link 
                to="/agronomists"
                className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition duration-200"
              >
                <span className="text-xl mr-3">👨‍🌾</span>
                <div>
                  <p className="font-medium text-gray-900">Find Agronomists</p>
                  <p className="text-sm text-gray-500">Book new consultations</p>
                </div>
              </Link>

              <Link 
                to="/subscriptions"
                className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition duration-200"
              >
                <span className="text-xl mr-3">💰</span>
                <div>
                  <p className="font-medium text-gray-900">Manage Subscription</p>
                  <p className="text-sm text-gray-500">Upgrade your plan</p>
                </div>
              </Link>

              {user?.role === 'agronomist' && (
                <Link 
                  to="/consultations"
                  className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition duration-200"
                >
                  <span className="text-xl mr-3">📋</span>
                  <div>
                    <p className="font-medium text-gray-900">My Consultations</p>
                    <p className="text-sm text-gray-500">Manage your schedule</p>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Platform Fee Notice for Farmers */}
        {user?.role === 'farmer' && !stats.hasPaidPlatformFee && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-yellow-400 text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-yellow-800">
                  Platform Access Required
                </h3>
                <div className="mt-2 text-yellow-700">
                  <p>To start booking consultations, please pay the one-time platform access fee of <strong>KES 300</strong></p>
                </div>
                <Link 
                  to="/subscriptions"
                  className="inline-block mt-3 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition duration-200 font-medium"
                >
                  Pay Now
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;