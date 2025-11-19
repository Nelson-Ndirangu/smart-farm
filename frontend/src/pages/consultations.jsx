// src/pages/Consultations.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { consultationsAPI } from '../services/api';
import { chatAPI } from '../services/ChatAPI';

const Consultations = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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

      const res = await consultationsAPI.getAll();
      const data = Array.isArray(res.data) ? res.data : [];

      console.log("Loaded Consultations:", data);

      setConsultations(data);
    } catch (err) {
      console.error('Error fetching consultations:', err);
      setError('Failed to load consultations.');
      setConsultations([]);
    } finally {
      setLoading(false);
    }
  };

  const updateConsultationStatus = async (id, status) => {
    try {
      await consultationsAPI.update(id, { status });
      fetchConsultations();
    } catch (err) {
      console.error("Error updating:", err);
      setError("Could not update consultation");
    }
  };

  // ALWAYS allow chat
  const handleOpenChat = async (consultationId) => {
    try {
      setCreatingChat(consultationId);

      const res = await chatAPI.getOrCreateChat(consultationId);
      const chat = res.data;

      navigate(`/chat?chat=${chat._id}`);
    } catch (err) {
      console.error("Chat error:", err);
      setError("Could not open chat.");
    } finally {
      setCreatingChat(null);
    }
  };

  const filteredConsultations =
    filter === "all"
      ? consultations
      : consultations.filter((c) => c.status === filter);

  const getCount = (status) => {
    if (status === "all") return consultations.length;
    return consultations.filter((c) => c.status === status).length;
  };

  const getStatusText = (status) => {
    const map = {
      pending: "Pending Payment",
      paid: "Paid",
      confirmed: "Confirmed",
      completed: "Completed",
      cancelled: "Cancelled",
    };
    return map[status] || status;
  };

  const getStatusColor = (status) => {
    const map = {
      pending: "bg-yellow-100 text-yellow-800",
      paid: "bg-blue-100 text-blue-800",
      confirmed: "bg-green-100 text-green-800",
      completed: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return map[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-b-2 border-green-600 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">
            {error}
          </div>
        )}

        <h1 className="text-3xl font-bold mb-4">My Consultations</h1>

        {/* Filter Tabs */}
        <div className="flex space-x-4 border-b overflow-x-auto">
          {["all", "pending", "paid", "confirmed", "completed", "cancelled"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 font-medium capitalize ${
                  filter === status
                    ? "border-b-2 border-green-600 text-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {status === "all" ? "All" : getStatusText(status)} ({getCount(status)})
              </button>
            )
          )}
        </div>

        {/* Consultations List */}
        <div className="mt-6 space-y-6">
          {filteredConsultations.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl text-gray-400 mb-4">💬</div>
              <p className="font-semibold text-gray-700 mb-1">
                No consultations found
              </p>
              <Link
                to="/agronomists"
                className="bg-green-600 text-white px-6 py-3 rounded-lg"
              >
                Find Agronomists
              </Link>
            </div>
          ) : (
            filteredConsultations.map((c) => (
              <div key={c._id} className="bg-white p-6 rounded-lg shadow border">

                <div className="flex justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">{c.topic}</h3>
                    <p className="text-gray-600 mt-1">
                      with{" "}
                      {user.role === "farmer"
                        ? c.agronomist?.name
                        : c.farmer?.name}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                      c.status
                    )}`}
                  >
                    {getStatusText(c.status)}
                  </span>
                </div>

                <p className="mt-4">
                  Created:{" "}
                  <strong>
                    {new Date(c.createdAt).toLocaleDateString()}
                  </strong>
                </p>

                {/* ACTION BUTTONS */}
                <div className="flex mt-4 space-x-3 flex-wrap">

                  {/* ALWAYS ALLOW CHAT */}
                  <button
                    onClick={() => handleOpenChat(c._id)}
                    disabled={creatingChat === c._id}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2 disabled:opacity-50"
                  >
                    {creatingChat === c._id ? (
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      "💬 Chat"
                    )}
                  </button>

                  {/* Status actions (agronomist) */}
                  {user.role === "agronomist" && c.status === "pending" && (
                    <>
                      <button
                        onClick={() =>
                          updateConsultationStatus(c._id, "confirmed")
                        }
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                      >
                        Confirm
                      </button>

                      <button
                        onClick={() =>
                          updateConsultationStatus(c._id, "cancelled")
                        }
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                      >
                        Decline
                      </button>
                    </>
                  )}

                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Consultations;
