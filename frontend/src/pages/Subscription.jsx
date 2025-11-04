import React, { useEffect, useState } from 'react';
import api from '../api/api';

export default function Subscriptions() {
  const [subs, setSubs] = useState([]);

  const fetchSubs = async () => {
    try {
      const res = await api.get('/subscriptions');
      setSubs(res.data.subscriptions);
    } catch (err) {
      alert(err.message || 'Failed to load subscriptions');
    }
  };

  useEffect(() => { fetchSubs(); }, []);

  const buyMock = async () => {
    try {
      await api.post('/subscriptions', { planId: 'monthly-basic', price: 500, durationDays: 30 });
      alert('Subscribed (mock)');
      fetchSubs();
    } catch (err) {
      alert(err.message || 'Failed to subscribe');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Subscriptions</h2>
      <div className="mb-4">
        <button onClick={buyMock} className="px-4 py-2 bg-primary text-white rounded">Buy monthly (mock)</button>
      </div>
      <div className="space-y-3">
        {subs.map(s => (
          <div key={s._id} className="bg-white p-3 rounded shadow">
            <div>{s.planId} — Expires: {new Date(s.expiresAt).toLocaleDateString()}</div>
          </div>
        ))}
        {!subs.length && <div className="text-gray-500">No subscriptions</div>}
      </div>
    </div>
  );
}
