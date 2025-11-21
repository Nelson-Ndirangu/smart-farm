// Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
           {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <div className="pt-10 mx-auto max-w-7xl px-4 sm:pt-12 sm:px-6 md:pt-16 lg:pt-20 lg:px-8 xl:pt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Connecting Farmers with</span>
                  <span className="block text-green-600">Expert Agronomists</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Empowering small-scale farmers in Kenya with direct access to qualified agricultural experts. 
                  Get personalized advice, crop management solutions, and grow your farming business.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link to="/register" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:py-4 md:text-lg md:px-10 transition duration-300">
                      Get Started
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link to="/book-consultation" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 md:py-4 md:text-lg md:px-10 transition duration-300">
                      Book Consultation
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


<div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
  <div className="h-56 w-full bg-gray-200 sm:h-72 md:h-96 lg:w-full lg:h-full relative">
    {/* Fallback background color */}
    <div className="absolute inset-0 bg-green-600 flex items-center justify-center">
      <div className="text-white text-center p-8">
        <div className="text-6xl mb-4"></div>
        <h3 className="text-2xl font-bold">Growing Together</h3>
        <p className="mt-2">Sustainable farming for a better Kenya</p>
      </div>
    </div>
    
    {/* Image with error handling */}
    <img
      className="w-full h-full object-cover absolute inset-0"
      src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80"
      alt="Farming in Kenya"
     
    />
  </div>
</div>


      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              How Smart Farm Works
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Simple steps to connect with agricultural experts
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {/* Step 1 */}
              <div className="text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mx-auto">
                  <span className="text-xl font-bold">1</span>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Create Account</h3>
                <p className="mt-2 text-base text-gray-500">
                  Sign up as a farmer and create your profile
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mx-auto">
                  <span className="text-xl font-bold">2</span>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Choose Agronomist</h3>
                <p className="mt-2 text-base text-gray-500">
                  Browse qualified agronomists specializing in your crops
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mx-auto">
                  <span className="text-xl font-bold">3</span>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Book Consultation</h3>
                <p className="mt-2 text-base text-gray-500">
                  Schedule a consultation at your convenience
                </p>
              </div>

              {/* Step 4 */}
              <div className="text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mx-auto">
                  <span className="text-xl font-bold">4</span>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Get Expert Advice</h3>
                <p className="mt-2 text-base text-gray-500">
                  Receive personalized farming solutions and guidance
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why Choose Smart Farm?
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Benefit 1 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300">
              <div className="text-green-600 text-4xl mb-4">👨‍🌾</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Expert Agronomists</h3>
              <p className="text-gray-600">
                Connect with certified agricultural experts with proven experience in Kenyan farming conditions.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300">
              <div className="text-green-600 text-4xl mb-4">💬</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Real-time Chat</h3>
              <p className="text-gray-600">
                Get instant answers to your farming questions through our secure chat platform.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300">
              <div className="text-green-600 text-4xl mb-4">🌾</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Crop Specific Advice</h3>
              <p className="text-gray-600">
                Receive tailored recommendations for your specific crops and local conditions.
              </p>
            </div>

            {/* Benefit 4 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300">
              <div className="text-green-600 text-4xl mb-4"></div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Affordable Pricing</h3>
              <p className="text-gray-600">
                Access professional agricultural advice at prices suitable for small-scale farmers.
              </p>
            </div>

            {/* Benefit 5 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300">
              <div className="text-green-600 text-4xl mb-4"></div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Easy to Use</h3>
              <p className="text-gray-600">
                Simple interface designed for farmers with varying levels of tech experience.
              </p>
            </div>

            {/* Benefit 6 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300">
              <div className="text-green-600 text-4xl mb-4"></div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Proven Results</h3>
              <p className="text-gray-600">
                Join hundreds of farmers who have increased their yields with our platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to grow your farm?</span>
            <span className="block text-green-200">Start your journey today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link to="/register" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-white hover:bg-green-50 transition duration-300">
                Get Started Free
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link to="/book-consultation" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-700 hover:bg-green-800 transition duration-300">
                Book Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Smart Farm</h3>
              <p className="text-gray-400">
                Connecting Kenyan farmers with expert agronomists for sustainable agricultural growth.
              </p>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/agronomist" className="text-gray-400 hover:text-white transition duration-300">Agronomists</Link></li>
                <li><Link to="/book-consultation" className="text-gray-400 hover:text-white transition duration-300">Consultation</Link></li>
                <li><Link to="/subscription" className="text-gray-400 hover:text-white transition duration-300">Subscription</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Account</h3>
              <ul className="space-y-2">
                <li><Link to="/login" className="text-gray-400 hover:text-white transition duration-300">Login</Link></li>
                <li><Link to="/register" className="text-gray-400 hover:text-white transition duration-300">Register</Link></li>
                <li><Link to="/profile" className="text-gray-400 hover:text-white transition duration-300">Profile</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link to="/chat" className="text-gray-400 hover:text-white transition duration-300">Live Chat</Link></li>
                <li><Link to="/reset-password" className="text-gray-400 hover:text-white transition duration-300">Reset Password</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700">
            <p className="text-gray-400 text-center">
              &copy; 2025 Smart Farm. Empowering Kenyan farmers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;