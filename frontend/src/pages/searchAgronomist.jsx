import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Link } from 'react-router-dom';

export default function SearchAgronomists() {
  const [q, setQ] = useState('');
  const [location, setLocation] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const res = await api.get('/users/search/agronomists', { params: { q, location } });
      setResults(res.data.results);
    } catch (err) {
      alert(err.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { search(); }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Find Agronomists</h2>
      <form onSubmit={search} className="flex gap-2 mb-4">
        <Input placeholder="Search by name or skill" value={q} onChange={e => setQ(e.target.value)} />
        <Input placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
        <Button type="submit">Search</Button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {results.map(r => (
          <Card key={r._id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold">{r.name}</div>
                <div className="text-sm text-gray-500">{r.profile?.location}</div>
                <p className="mt-2 text-sm">{r.profile?.bio}</p>
              </div>
              <div className="flex flex-col gap-2">
                <Link to={`/consultations/new?agronomistId=${r._id}`}>
                  <Button size="sm">Request</Button>
                </Link>
                <div className="text-xs text-gray-400">Wallet: {(r.wallet?.balance || 0) / 100} USD</div>
              </div>
            </div>
          </Card>
        ))}
        {!results.length && <div className="text-gray-500">No agronomists found</div>}
      </div>
    </div>
  );
}
