import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useAuth } from '../contexts/authContext';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      setErr(error.message || 'Login failed');
    }
  };

  return (
    <div className="flex justify-center mt-20">
      <Card className="w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-center">Sign In</h2>
        {err && <div className="text-red-600 mb-2">{err}</div>}
        <form onSubmit={onSubmit} className="space-y-3">
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button type="submit" className="w-full">Login</Button>
        </form>
        <div className="mt-4 text-sm text-center">
          <Link to="/forgot-password" className="text-primary">Forgot password?</Link>
        </div>
      </Card>
    </div>
  );
}
