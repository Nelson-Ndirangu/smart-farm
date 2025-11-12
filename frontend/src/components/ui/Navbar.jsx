// src/components/Layout/Navbar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl text-green-600">Smart Farm</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/agronomists" 
              className={`${isActive('/agronomists') ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'} hover:text-green-600 px-3 py-2 font-medium`}
            >
              Find Agronomists
            </Link>
            
            {user && (
              <>
                <Link 
                  to="/consultations" 
                  className={`${isActive('/consultations') ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'} hover:text-green-600 px-3 py-2 font-medium`}
                >
                  My Consultations
                </Link>
                <Link 
                  to="/subscriptions" 
                  className={`${isActive('/subscriptions') ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'} hover:text-green-600 px-3 py-2 font-medium`}
                >
                  Subscriptions
                </Link>
              </>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Hello, {user.name}</span>
                <Link 
                  to="/dashboard" 
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={logout}
                  className="text-gray-600 hover:text-gray-800 px-3 py-2"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-600 hover:text-green-600 px-3 py-2 font-medium"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-200 font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;