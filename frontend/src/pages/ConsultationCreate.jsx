import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/api';

export default function ConsultationCreate() {
  const [params] = useSearchParams();
  const agrId = params.get('agronomistId');
  const [agronomist, setAgronomist] = useState(null);
  const [form, setForm] = useState({ topic: '', description: '', scheduledAt: '', price: 2000 });
  const navigate = useNavigate();

  useEffect(() => {
    if (!agrId) return;
    // fetch agronomist by searching (backend doesn't have GET /users/:id)
    api.get('/users/search/agronomists', { params: { q: '', location: '' } })
      .then(res => setAgronomist(res.data.results.find(r => r._id === agrId)))
      .catch(() => {});
  }, [agrId]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/consultations', {
        agronomistId: agrId,
        topic: form.topic,
        description: form.description,
        scheduledAt: form.scheduledAt,
        price: Number(form.price)
      });
      // backend returns consultation & checkout session (mock or stripe session)
      const consultation = res.data.consultation;
      // Call mock payment endpoint (development)
      await api.post(`/consultations/${consultation._id}/pay/mock`);
      navigate('/consultations');
    } catch (err) {
      alert(err.message || 'Failed to request consultation');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-lg font-semibold">Request Consultation</h2>
      {agronomist && <div className="text-sm text-gray-600 mt-1">With: {agronomist.name}</div>}
      <form onSubmit={onSubmit} className="space-y-3 mt-4">
        <input placeholder="Topic" value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })} className="w-full border px-3 py-2 rounded" />
        <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border px-3 py-2 rounded" />
        <input type="datetime-local" value={form.scheduledAt} onChange={e => setForm({ ...form, scheduledAt: e.target.value })} className="w-full border px-3 py-2 rounded" />
        <div className="flex items-center gap-3">
          <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="border px-3 py-2 rounded w-32" />
          <div className="text-sm text-gray-600">Price is in cents (e.g. 2000 = $20)</div>
        </div>
        <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Request & Pay (mock)</button>
      </form>
    </div>
  );
}
