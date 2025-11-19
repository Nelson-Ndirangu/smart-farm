// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Connect with Expert 
            <span className="text-green-600"> Agronomists</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Get professional agricultural advice and consultation services. 
            Connect with certified agronomists to boost your farm productivity.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            {!user ? (
              <>
                <Link 
                  to="/register" 
                  className="bg-green-500 text-white px-8 py-4 rounded-lg hover:bg-green-600 transition duration-200 text-lg font-semibold shadow-lg"
                >
                  Get Started - KES 300
                </Link>
                <Link 
                  to="/agronomists" 
                  className="border-2 border-green-500 text-green-600 px-8 py-4 rounded-lg hover:bg-green-50 transition duration-200 text-lg font-semibold"
                >
                  Browse Agronomists
                </Link>
              </>
            ) : (
              <Link 
                to="/agronomists" 
                className="bg-green-500 text-white px-8 py-4 rounded-lg hover:bg-green-600 transition duration-200 text-lg font-semibold shadow-lg"
              >
                Find Agronomists
              </Link>
            )}
          </div>

          {/* Platform Fee Badge */}
          <div className="inline-flex items-center bg-yellow-100 text-yellow-800 px-6 py-3 rounded-full font-medium">
            <span className="mr-2"></span>
            Platform Access Fee: KES 300
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '',
                title: 'Sign Up',
                description: 'Create your account as a farmer or agronomist'
              },
              {
                icon: '',
                title: 'Pay Platform Fee',
                description: 'KES 300 one-time access fee for farmers'
              },
              {
                icon: '',
                title: 'Start Consulting',
                description: 'Connect with agronomists and get expert advice'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;