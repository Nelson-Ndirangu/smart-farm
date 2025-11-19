// src/pages/BookConsultation.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { consultationsAPI } from '../services/api';
import { chatAPI } from '../services/ChatAPI';

const BookConsultation = () => {
  const { agronomistId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [agronomist, setAgronomist] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch agronomist details
  useEffect(() => {
    const fetchAgronomist = async () => {
      try {
        const response = await fetch(`/api/users/${agronomistId}`);
        const data = await response.json();
        setAgronomist(data);
      } catch (err) {
        console.error('Error fetching agronomist:', err);
        setError('Failed to load agronomist details.');
      }
    };

    fetchAgronomist();
  }, [agronomistId]);

  const handleBookConsultation = async () => {
    if (!agronomist) return;

    setLoading(true);
    setError('');

    try {
      // Create new consultation
      const consultationData = {
        farmer: user._id,
        agronomist: agronomist._id,
        topic: `Consultation with ${agronomist.name}`,
        description: '',
        price: 0, // set default or add form input
        status: 'pending',
      };

      const res = await consultationsAPI.create(consultationData);
      const consultation = res.data;

      // Create chat for consultation
      await chatAPI.getOrCreateChat(consultation._id);

      // Redirect to consultations page
      navigate('/consultations');
    } catch (err) {
      console.error('Error booking consultation:', err);
      setError('Failed to book consultation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!agronomist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading agronomist info...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-xl font-bold mb-4">
            Book Consultation with {agronomist.name}
          </h1>

          <button
            onClick={handleBookConsultation}
            disabled={loading}
            className="w-full block text-center bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Booking...' : 'Continue to Booking'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookConsultation;
