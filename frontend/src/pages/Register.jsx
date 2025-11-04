import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useAuth } from '../contexts/authContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'farmer', phone: '' });
  const [err, setErr] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      await register(form);
      navigate('/dashboard');
    } catch (error) {
      setErr(error.message || 'Registration failed');
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <Card className="w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-center">Create account</h2>
        {err && <div className="text-red-600 mb-2">{err}</div>}
        <form onSubmit={onSubmit} className="space-y-3">
          <Input name="name" placeholder="Full name" value={form.name} onChange={handleChange} />
          <Input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
          <Input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
          <Input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
          <div className="flex gap-3 items-center">
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" checked={form.role === 'farmer'} onChange={() => setForm({ ...form, role: 'farmer' })} />
              Farmer
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" checked={form.role === 'agronomist'} onChange={() => setForm({ ...form, role: 'agronomist' })} />
              Agronomist
            </label>
          </div>
          <Button type="submit" className="w-full">Register</Button>
        </form>
      </Card>
    </div>
  );
}
