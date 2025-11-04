import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div>
      <h2 className="text-2xl font-semibold">Welcome, {user?.name}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <Link to="/search" className="p-4 bg-white rounded shadow hover:shadow-md">Find agronomists</Link>
        <Link to="/consultations" className="p-4 bg-white rounded shadow hover:shadow-md">My consultations</Link>
        <Link to="/subscriptions" className="p-4 bg-white rounded shadow hover:shadow-md">My subscriptions</Link>
      </div>
    </div>
  );
}
