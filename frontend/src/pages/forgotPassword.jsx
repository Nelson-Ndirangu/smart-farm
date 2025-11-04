import React, { useState } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import authService from '../api/authService';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await authService.forgotPassword({ email });
      setMessage('If that email exists, a reset link was sent.');
    } catch (err) {
      setMessage(err.message || 'Failed to request reset');
    }
  };

  return (
    <div className="flex justify-center mt-20">
      <Card className="w-full max-w-md p-6">
        <h2 className="text-lg font-semibold text-center mb-4">Reset password</h2>
        <form onSubmit={onSubmit} className="space-y-3">
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button type="submit" className="w-full">Send reset link</Button>
        </form>
        {message && <p className="mt-3 text-sm text-gray-600">{message}</p>}
      </Card>
    </div>
  );
}
