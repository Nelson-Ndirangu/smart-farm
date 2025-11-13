// src/pages/Consultations.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { consultationsAPI } from '../services/api';
import { chatAPI } from '../services/ChatAPI';

const Consultations = () => {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');
  const [creatingChat, setCreatingChat] = useState(null);

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await consultationsAPI.getAll();
      
      // Ensure we always have an array
      const consultationsData = Array.isArray(response.data) ? response.data : [];
      console.log('Consultations data:', consultationsData);
      
      setConsultations(consultationsData);
      
    } catch (error) {
      console.error('Error fetching consultations:', error);
      setError('Failed to load consultations. Please try again later.');
      setConsultations([]); // Always set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const updateConsultationStatus = async (consultationId, status) => {
    try {
      await consultationsAPI.update(consultationId, { status });
      fetchConsultations(); // Refresh the list
    } catch (error) {
      console.error('Error updating consultation:', error);
      setError('Failed to update consultation status');
    }
  };

  const handleOpenChat = async (consultationId) => {
    try {
      setCreatingChat(consultationId);
      
      // Get or create chat for this consultation
      const response = await chatAPI.getOrCreateChat(consultationId);
      const chat = response.data;
      
      // Navigate to chat page with the chat ID
      window.location.href = `/chat?chat=${chat._id}`;
      
    } catch (error) {
      console.error('Error opening chat:', error);
      setError('Failed to open chat. Please try again.');
    } finally {
      setCreatingChat(null);
    }
  };

  // Format price from cents to dollars
  const formatPrice = (priceInCents) => {
    return (priceInCents / 100).toFixed(2);
  };

  // Safe filtering - ensure consultations is always treated as array
  const filteredConsultations = Array.isArray(consultations) 
    ? consultations.filter(consultation => {
        if (filter === 'all') return true;
        return consultation.status === filter;
      })
    : [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending Payment';
      case 'paid': return 'Paid';
      case 'confirmed': return 'Confirmed';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  // Get count for each status - safely
  const getStatusCount = (status) => {
    if (!Array.isArray(consultations)) return 0;
    if (status === 'all') return consultations.length;
    return consultations.filter(c => c.status === status).length;
  };

  // Check if chat is available for consultation
  const isChatAvailable = (consultation) => {
    // Chat is available for paid and confirmed consultations
    return consultation.status === 'paid' || consultation.status === 'confirmed' || consultation.status === 'completed';
  };

  // Mock data for development
  const getMockConsultations = () => {
    const baseConsultations = [
      {
        _id: '1',
        farmer: { _id: 'f1', name: 'Samuel Kariuki' },
        agronomist: { _id: 'a1', name: 'Dr. Jane Mwangi' },
        topic: 'Crop disease identification',
        description: 'Need help identifying a disease affecting my maize plants',
        scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        price: 1500,
        currency: 'usd',
        status: 'pending',
        notes: 'Plants showing yellow spots on leaves',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        _id: '2',
        farmer: { _id: 'f2', name: 'Mary Wanjiku' },
        agronomist: { _id: 'a2', name: 'John Kimani' },
        topic: 'Soil analysis and fertilizer recommendation',
        description: 'Soil testing and fertilizer advice for vegetable garden',
        scheduledAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        price: 2000,
        currency: 'usd',
        status: 'paid',
        payment: {
          paymentId: 'pay_123',
          provider: 'stripe',
          paidAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
        },
        notes: 'Soil samples already collected',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        _id: '3',
        farmer: { _id: 'f3', name: 'Peter Kamau' },
        agronomist: { _id: 'a1', name: 'Dr. Jane Mwangi' },
        topic: 'Irrigation system setup',
        description: 'Planning irrigation system for 5-acre farm',
        scheduledAt: null,
        price: 3000,
        currency: 'usd',
        status: 'confirmed',
        payment: {
          paymentId: 'pay_124',
          provider: 'stripe',
          paidAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        },
        notes: 'System installed successfully',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      }
    ];

    // Filter based on user role for realistic mock data
    if (user?.role === 'farmer') {
      return baseConsultations.filter(c => c.farmer._id === 'f1');
    } else if (user?.role === 'agronomist') {
      return baseConsultations.filter(c => c.agronomist._id === 'a1');
    }
    
    return baseConsultations;
  };

  // Use mock data if no real data available
  const displayConsultations = Array.isArray(consultations) && consultations.length > 0 
    ? filteredConsultations 
    : getMockConsultations();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Development Notice */}
        {(!Array.isArray(consultations) || consultations.length === 0) && (
          <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-600 px-4 py-3 rounded">
            <strong>Development Mode:</strong> Showing sample consultation data.
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            My Consultations
          </h1>
          
          {/* Filter Tabs */}
          <div className="flex space-x-4 border-b overflow-x-auto">
            {['all', 'pending', 'paid', 'confirmed', 'completed', 'cancelled'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 font-medium capitalize whitespace-nowrap ${
                  filter === status
                    ? 'border-b-2 border-green-500 text-green-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {status === 'all' ? 'All' : getStatusText(status)} 
                {` (${getStatusCount(status)})`}
              </button>
            ))}
          </div>
        </div>

        {/* Consultations List */}
        <div className="space-y-6">
          {Array.isArray(displayConsultations) && displayConsultations.map(consultation => (
            <div key={consultation._id} className="bg-white rounded-lg shadow-md p-6 border">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {consultation.topic}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    with {user?.role === 'farmer' 
                      ? (consultation.agronomist?.name || 'Agronomist')
                      : (consultation.farmer?.name || 'Farmer')
                    }
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(consultation.status)}`}>
                    {getStatusText(consultation.status)}
                  </span>
                  <span className="text-lg font-semibold text-green-600">
                    ${formatPrice(consultation.price || 0)}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Scheduled Date</p>
                  <p className="font-medium">
                    {consultation.scheduledAt 
                      ? new Date(consultation.scheduledAt).toLocaleString()
                      : 'Not scheduled'
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Created</p>
                  <p className="font-medium">
                    {new Date(consultation.createdAt || consultation.date || Date.now()).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment</p>
                  <p className="font-medium capitalize">
                    {consultation.payment?.paidAt ? 'Paid' : 'Pending'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Currency</p>
                  <p className="font-medium uppercase">
                    {consultation.currency || 'usd'}
                  </p>
                </div>
              </div>

              {consultation.description && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Description</p>
                  <p className="text-gray-900">{consultation.description}</p>
                </div>
              )}

              {consultation.notes && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Notes</p>
                  <p className="text-gray-900">{consultation.notes}</p>
                </div>
              )}

              {/* Payment Information */}
              {consultation.payment?.paidAt && (
                <div className="mb-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-600">
                    Paid via {consultation.payment.provider} on {new Date(consultation.payment.paidAt).toLocaleString()}
                  </p>
                  {consultation.payment.paymentId && (
                    <p className="text-xs text-green-500 mt-1">
                      Payment ID: {consultation.payment.paymentId}
                    </p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t flex-wrap gap-2">
                {user?.role === 'agronomist' && consultation.status === 'pending' && (
                  <>
                    <button
                      onClick={() => updateConsultationStatus(consultation._id, 'confirmed')}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200 text-sm"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => updateConsultationStatus(consultation._id, 'cancelled')}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200 text-sm"
                    >
                      Decline
                    </button>
                  </>
                )}

                {user?.role === 'farmer' && consultation.status === 'pending' && (
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 text-sm">
                    Make Payment
                  </button>
                )}

                {consultation.status === 'confirmed' && (
                  <button
                    onClick={() => updateConsultationStatus(consultation._id, 'completed')}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 text-sm"
                  >
                    Mark Complete
                  </button>
                )}

                {/* Chat Button - Available for paid, confirmed, and completed consultations */}
                {isChatAvailable(consultation) && (
                  <button
                    onClick={() => handleOpenChat(consultation._id)}
                    disabled={creatingChat === consultation._id}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {creatingChat === consultation._id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Opening...</span>
                      </>
                    ) : (
                      <>
                        <span>💬</span>
                        <span>Open Chat</span>
                      </>
                    )}
                  </button>
                )}

                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition duration-200 text-sm">
                  View Details
                </button>

                {consultation.status === 'confirmed' && consultation.scheduledAt && (
                  <button className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition duration-200 text-sm">
                    Join Call
                  </button>
                )}
              </div>

              {/* Chat availability notice */}
              {!isChatAvailable(consultation) && consultation.status === 'pending' && (
                <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
                  💬 Chat will be available after payment is confirmed
                </div>
              )}
            </div>
          ))}

          {(!Array.isArray(displayConsultations) || displayConsultations.length === 0) && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">💬</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No consultations found</h3>
              <p className="text-gray-500 mb-4">
                {filter === 'all' 
                  ? "You don't have any consultations yet."
                  : `No consultations with status "${filter}"`
                }
              </p>
              {user?.role === 'farmer' && (
                <Link 
                  to="/agronomists"
                  className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-200 font-medium"
                >
                  Find Agronomists
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Consultations;