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
      const consultationsData = Array.isArray(response.data) ? response.data : [];
      setConsultations(consultationsData);
    } catch (err) {
      console.error('Error fetching consultations:', err);
      setError('Failed to load consultations. Please try again later.');
      setConsultations([]);
    } finally {
      setLoading(false);
    }
  };

  const updateConsultationStatus = async (consultationId, status) => {
    try {
      await consultationsAPI.update(consultationId, { status });
      await fetchConsultations(); // Refresh list
    } catch (err) {
      console.error('Error updating consultation:', err);
      setError('Failed to update consultation status');
    }
  };

  const handleOpenChat = async (consultationId) => {
    try {
      setCreatingChat(consultationId);
      const response = await chatAPI.getOrCreateChat(consultationId);
      const chat = response.data;
      window.location.href = `/chat?chat=${chat._id}`;
    } catch (err) {
      console.error('Error opening chat:', err);
      setError('Failed to open chat. Please try again.');
    } finally {
      setCreatingChat(null);
    }
  };

  const formatPrice = (priceInCents) => (priceInCents / 100).toFixed(2);

  const filteredConsultations = Array.isArray(consultations) 
    ? consultations.filter(c => filter === 'all' ? true : c.status === filter)
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

  const getStatusCount = (status) => {
    if (!Array.isArray(consultations)) return 0;
    if (status === 'all') return consultations.length;
    return consultations.filter(c => c.status === status).length;
  };

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
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Consultations</h1>

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

        <div className="space-y-6">
          {filteredConsultations.length > 0 ? (
            filteredConsultations.map(consultation => (
              <div key={consultation._id} className="bg-white rounded-lg shadow-md p-6 border">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{consultation.topic}</h3>
                    <p className="text-gray-600 mt-1">
                      with {user?.role === 'farmer'
                        ? (consultation.agronomist?.name || 'Agronomist')
                        : (consultation.farmer?.name || 'Farmer')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(consultation.status)}`}>
                      {getStatusText(consultation.status)}
                    </span>
                    <span className="text-lg font-semibold text-green-600">
                      KES{formatPrice(consultation.price || 0)}
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Scheduled Date</p>
                    <p className="font-medium">
                      {consultation.scheduledAt ? new Date(consultation.scheduledAt).toLocaleString() : 'Not scheduled'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Created</p>
                    <p className="font-medium">
                      {new Date(consultation.createdAt || Date.now()).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment</p>
                    <p className="font-medium capitalize">{consultation.payment?.paidAt ? 'Paid' : 'Pending'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Currency</p>
                    <p className="font-medium uppercase">{consultation.currency || 'KES'}</p>
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

                  {/* Chat button now always available */}
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
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">💬</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No consultations found</h3>
              <p className="text-gray-500 mb-4">
                {filter === 'all' ? "You don't have any consultations yet." : `No consultations with status "${filter}"`}
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
