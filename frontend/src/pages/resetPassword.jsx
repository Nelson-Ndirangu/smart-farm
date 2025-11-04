import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import authService from '../api/authService';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const id = params.get('id');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!token || !id) return setMessage('Invalid reset link');
    try {
      await authService.resetPassword({ token, id, password });
      setMessage('Password reset successful. Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setMessage(err.message || 'Reset failed');
    }
  };

  return (
    <div className="flex justify-center mt-20">
      <Card className="w-full max-w-md p-6">
        <h2 className="text-lg font-semibold text-center mb-4">Set new password</h2>
        <form onSubmit={onSubmit} className="space-y-3">
          <Input placeholder="New password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button type="submit" className="w-full">Set password</Button>
        </form>
        {message && <p className="mt-3 text-sm text-gray-600">{message}</p>}
      </Card>
    </div>
  );
}
