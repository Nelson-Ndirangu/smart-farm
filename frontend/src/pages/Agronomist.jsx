// src/pages/Agronomists.jsx
import React, { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';

const Agronomists = () => {
  const [agronomists, setAgronomists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchAgronomists();
  }, []);

  const fetchAgronomists = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching users to find agronomists...');
      const response = await usersAPI.getAllUsers();
      
      // Filter users to get only agronomists based on role
      const allUsers = Array.isArray(response.data) ? response.data : [];
      const agronomistsData = allUsers.filter(user => user.role === 'agronomist');
      
      console.log('Found agronomists:', agronomistsData);
      setAgronomists(agronomistsData);
      
      if (agronomistsData.length === 0) {
        setError('No agronomists available at the moment.');
      }
      
    } catch (error) {
      console.error('Error fetching users:', error);
      
      // If the endpoint fails, use mock data for development
      const mockAgronomists = getMockAgronomists();
      setAgronomists(mockAgronomists);
      setError('Using sample data - backend endpoint not available');
    } finally {
      setLoading(false);
    }
  };

  // Mock data that matches your schema
  const getMockAgronomists = () => [
    {
      _id: '1',
      name: 'Dr. Jane Mwangi',
      email: 'jane@agriconsult.com',
      role: 'agronomist',
      category: 'horticulture',
      profile: {
        bio: 'Expert in crop management and pest control with 10 years of experience. Specialized in maize, wheat, and coffee cultivation.',
        location: 'Nairobi',
        skills: ['Crop Management', 'Pest Control', 'Soil Analysis']
      },
      rating: 4.8,
      isVerified: true
    },
    {
      _id: '2',
      name: 'John Kimani',
      email: 'john@agriconsult.com',
      role: 'agronomist',
      category: 'organic',
      profile: {
        bio: 'Specialized in soil analysis and fertilizer recommendations. PhD in Soil Chemistry from University of Nairobi.',
        location: 'Nakuru',
        skills: ['Soil Science', 'Fertilizer', 'Organic Farming']
      },
      rating: 4.6,
      isVerified: true
    },
    {
      _id: '3',
      name: 'Mary Wambui',
      email: 'mary@agriconsult.com',
      role: 'agronomist',
      category: 'organic',
      profile: {
        bio: 'Passionate about sustainable and organic farming practices. Certified organic farming consultant with international experience.',
        location: 'Eldoret',
        skills: ['Organic Farming', 'Sustainability', 'Crop Rotation']
      },
      rating: 4.9,
      isVerified: true
    },
    {
      _id: '4',
      name: 'Dr. Peter Omondi',
      email: 'peter@agriconsult.com',
      role: 'agronomist',
      category: 'dairy',
      profile: {
        bio: 'Expert in integrated crop-livestock farming systems. Helps farmers maximize productivity through sustainable practices.',
        location: 'Kisumu',
        skills: ['Livestock', 'Dairy Farming', 'Integrated Systems']
      },
      rating: 4.7,
      isVerified: true
    },
    {
      _id: '5',
      name: 'Sarah Akinyi',
      email: 'sarah@agriconsult.com',
      role: 'agronomist',
      category: 'hydroponic',
      profile: {
        bio: 'Specialized in greenhouse farming, flowers, and vegetable production. Advanced knowledge in irrigation systems.',
        location: 'Naivasha',
        skills: ['Hydroponics', 'Greenhouse', 'Irrigation']
      },
      rating: 4.8,
      isVerified: true
    },
    {
      _id: '6',
      name: 'David Maina',
      email: 'david@agriconsult.com',
      role: 'agronomist',
      category: 'conventional',
      profile: {
        bio: 'Focuses on farm profitability, market access, and business planning for agricultural enterprises.',
        location: 'Thika',
        skills: ['Agribusiness', 'Market Access', 'Farm Planning']
      },
      rating: 4.5,
      isVerified: true
    }
  ];

  // Get unique categories from agronomists
  const categories = Array.isArray(agronomists) 
    ? [...new Set(agronomists
        .filter(agro => agro.category)
        .map(agro => agro.category)
      )]
    : [];

  // Filter agronomists by selected category
  const filteredAgronomists = Array.isArray(agronomists)
    ? selectedCategory 
      ? agronomists.filter(agro => agro.category === selectedCategory)
      : agronomists
    : [];

  // Format category name for display
  const formatCategory = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Error Message - Show as info if using mock data */}
        {error && (
          <div className={`mb-4 border px-4 py-3 rounded ${
            error.includes('sample data') 
              ? 'bg-blue-50 border-blue-200 text-blue-600'
              : 'bg-yellow-50 border-yellow-200 text-yellow-600'
          }`}>
            {error}
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Available Agronomists
          </h1>
          <p className="text-gray-600 mb-6">
            Connect with certified agricultural experts for personalized consultation
          </p>
          
          {/* Filter Section */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-4 mb-6">
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-4 py-2 rounded-full border transition-colors ${
                  selectedCategory === '' 
                    ? 'bg-green-500 text-white border-green-500' 
                    : 'bg-white text-gray-700 border-gray-300 hover:border-green-500'
                }`}
              >
                All Categories ({agronomists.length})
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full border transition-colors ${
                    selectedCategory === category 
                      ? 'bg-green-500 text-white border-green-500' 
                      : 'bg-white text-gray-700 border-gray-300 hover:border-green-500'
                  }`}
                >
                  {formatCategory(category)} ({agronomists.filter(agro => agro.category === category).length})
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Agronomists Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgronomists.map(agronomist => (
            <div key={agronomist._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200 border">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">👨‍🌾</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {agronomist.name}
                    </h3>
                    {agronomist.isVerified && (
                      <span className="text-blue-500" title="Verified Agronomist">✓</span>
                    )}
                  </div>
                  <p className="text-green-600 font-medium">
                    {formatCategory(agronomist.category)} Specialist
                  </p>
                  <p className="text-sm text-gray-500">
                    {agronomist.profile?.location && `📍 ${agronomist.profile.location}`}
                  </p>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                {agronomist.profile?.bio || 'Experienced agronomist ready to help with your farming challenges.'}
              </p>

              {/* Skills */}
              {agronomist.profile?.skills && agronomist.profile.skills.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {agronomist.profile.skills.slice(0, 3).map((skill, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {agronomist.profile.skills.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                        +{agronomist.profile.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <span className="text-yellow-500">⭐</span>
                  <span className="ml-1">{agronomist.rating?.toFixed(1) || '4.5'}/5</span>
                </div>
                <div className="flex items-center text-green-600 font-medium">
                  <span>Available</span>
                </div>
              </div>

              <button className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition duration-200 font-medium">
                Book Consultation
              </button>
            </div>
          ))}
        </div>

        {filteredAgronomists.length === 0 && agronomists.length > 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Agronomists Found</h3>
            <p className="text-gray-500 mb-4">
              No agronomists found in "{formatCategory(selectedCategory)}" category.
            </p>
            <button 
              onClick={() => setSelectedCategory('')}
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-200 font-medium"
            >
              Show All Agronomists
            </button>
          </div>
        )}

        {/* Empty state when no data at all */}
        {agronomists.length === 0 && filteredAgronomists.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">👨‍🌾</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Agronomists Available</h3>
            <p className="text-gray-500 mb-4">
              There are currently no agronomists available on the platform.
            </p>
            <button 
              onClick={fetchAgronomists}
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-200 font-medium"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Agronomists;