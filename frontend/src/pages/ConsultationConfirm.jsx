import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ConsultationConfirm = () => {
    const { consultationId } = useParams();
    const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-6">
        <div className="bg-white rounded-xl shadow-md p-8">
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Consultation Confirmation
          </h1>

          <p className="text-gray-600 mb-6">
            Thank you for adding a consulation. {agronomistId} will reach out to you soon.
          </p>

          <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
            <p className="text-gray-700">
              <span className="font-semibold">Consultation ID:</span>{" "}
              <span className="text-green-700">{consultationId}</span>
            </p>
          </div>

           <button
                className="mt-8 w-full bg-green-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-green-700 transition"
                onClick={() => navigate("/dashboard")}
                >
                Go Back
            </button>

        </div>
      </div>
    </div>
  );
};

export default ConsultationConfirm;
