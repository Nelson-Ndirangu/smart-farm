import React, { useEffect, useState } from 'react';
import api from '../api/api';

export default function Consultations() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await api.get('/consultations');
      setList(res.data.consultations);
    } catch (err) {
      alert(err.message || 'Failed to load consultations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/consultations/${id}`, { status });
      fetchList();
    } catch (err) {
      alert(err.message || 'Failed to update');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">My consultations</h2>
      <div className="space-y-3">
        {loading ? <div>Loading…</div> : list.map(c => (
          <div key={c._id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between">
              <div>
                <div className="font-semibold">{c.topic}</div>
                <div className="text-sm text-gray-600">With: {c.agronomist?.name || c.farmer?.name}</div>
                <div className="text-xs text-gray-500">Status: {c.status}</div>
              </div>
              <div className="flex flex-col gap-2">
                {c.status === 'paid' && <button className="px-2 py-1 bg-green-500 text-white rounded text-xs" onClick={() => updateStatus(c._id, 'confirmed')}>Confirm</button>}
                {c.status !== 'completed' && <button className="px-2 py-1 bg-gray-200 rounded text-xs" onClick={() => updateStatus(c._id, 'completed')}>Mark complete</button>}
              </div>
            </div>
          </div>
        ))}
        {!loading && !list.length && <div className="text-gray-500">No consultations yet.</div>}
      </div>
    </div>
  );
}
