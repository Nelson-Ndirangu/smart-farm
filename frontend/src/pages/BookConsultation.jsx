import React from "react";
import { useParams, Link } from "react-router-dom";

const BookConsultation = () => {
  const { agronomistId } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">

          <h1 className="text-xl font-bold mb-4">
            Book Consultation with Agronomist {agronomistId}
          </h1>

          <Link
            to={`/consultation/confirm/${agronomistId}`}
            className="w-full block text-center bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition duration-200 font-medium"
          >
            Continue to Booking
          </Link>

        </div>
      </div>
    </div>
  );
};

export default BookConsultation;
