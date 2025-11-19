import React, { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';
import { Link } from 'react-router-dom';

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

      // ✔ Correct API call
      const response = await usersAPI.getAgronomists();
      const results = Array.isArray(response.data?.results)
        ? response.data.results
        : [];

      console.log('Found agronomists:', results);
      setAgronomists(results);

      if (results.length === 0) {
        setError('No agronomists available at the moment.');
      }

    } catch (error) {
      console.error('Error fetching agronomists:', error);
      setError('Failed to load agronomists. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Extract categories
  const categories = [
    ...new Set(
      agronomists
        .filter(a => a.profile?.category)
        .map(a => a.profile.category)
    ),
  ];

  // Apply category filter
  const filteredAgronomists = selectedCategory
    ? agronomists.filter(a => a.profile?.category === selectedCategory)
    : agronomists;

  const formatCategory = (c) => c ? c.charAt(0).toUpperCase() + c.slice(1) : '';

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

        {error && (
          <div className="mb-4 border px-4 py-3 rounded bg-yellow-50 border-yellow-200 text-yellow-600">
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

          {/* Filters */}
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
                  {formatCategory(category)} (
                  {agronomists.filter(a => a.profile?.category === category).length})
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Agronomists Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgronomists.map(a => (
            <div
              key={a._id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200 border"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl"></span>
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{a.name}</h3>
                  <p className="text-green-600 font-medium">
                    {formatCategory(a.profile?.category || 'Agronomist')} Specialist
                  </p>
                  <p className="text-sm text-gray-500">
                    {a.profile?.location ? ` ${a.profile.location}` : ''}
                  </p>
                </div>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                {a.profile?.bio || 'Experienced agronomist ready to help you.'}
              </p>

              {/* Skills */}
              {a.profile?.skills?.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {a.profile.skills.slice(0, 3).map((skill, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {skill}
                    </span>
                  ))}
                  {a.profile.skills.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                      +{a.profile.skills.length - 3} more
                    </span>
                  )}
                </div>
              )}

             <Link
                  to={`/consultation/book/${a._id}`}
                  className="w-full block text-center bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition duration-200 font-medium"
                >
                  Book Consultation
              </Link>



            </div>
          ))}
        </div>

        {/* No results after filtering */}
        {filteredAgronomists.length === 0 && agronomists.length > 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Agronomists Found</h3>
            <button
              onClick={() => setSelectedCategory('')}
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-200"
            >
              Show All
            </button>
          </div>
        )}

        {/* No data at all */}
        {agronomists.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Agronomists Available
            </h3>
            <button
              onClick={fetchAgronomists}
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-200"
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
