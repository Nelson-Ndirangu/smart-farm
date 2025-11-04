import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import { Button } from '../../components/ui/button';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-lg font-bold text-primary">Smart-Farm</Link>
        <div className="flex items-center gap-3">
          <Link to="/search" className="hidden sm:block">Find Agronomists</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="hidden sm:block">Dashboard</Link>
              <Button variant="outline" onClick={logout}>Logout</Button>
            </>
          ) : (
            <>
              <Link to="/login"><Button>Login</Button></Link>
              <Link to="/register"><Button variant="outline">Register</Button></Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
