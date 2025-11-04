import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto text-center py-16">
      <h1 className="text-3xl font-bold">FarmConnect</h1>
      <p className="mt-4 text-gray-600">Connect with local agronomists, get expert consultations and manage subscriptions.</p>
      <div className="mt-8 flex justify-center gap-4">
        <Link to="/search" className="px-4 py-2 rounded bg-primary text-white">Find Agronomists</Link>
        <Link to="/register" className="px-4 py-2 rounded border">Get Started</Link>
      </div>
    </div>
  );
}
