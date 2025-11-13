// src/pages/BookConsultation.jsx
import React from 'react';
import { useParams } from 'react-router-dom';

const BookConsultation = () => {
  const { agronomistId } = useParams();
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Book Consultation with Agronomist {agronomistId}
          </h1>
          <p className="text-gray-600">
            Consultation booking page - Under development
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookConsultation;