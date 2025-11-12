// src/pages/Subscriptions.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { subscriptionsAPI } from '../services/api';

const Subscriptions = () => {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch subscriptions
      const subscriptionsResponse = await subscriptionsAPI.get();
      const subscriptionsData = Array.isArray(subscriptionsResponse.data) 
        ? subscriptionsResponse.data 
        : [];

      setSubscriptions(subscriptionsData);
      
      // Find active subscription
      const activeSub = subscriptionsData.find(sub => sub.active === true);
      setCurrentSubscription(activeSub || null);

      // Fetch payment history
      try {
        const paymentsResponse = await subscriptionsAPI.getPayments();
        setPaymentHistory(Array.isArray(paymentsResponse.data) ? paymentsResponse.data : []);
      } catch (paymentError) {
        console.warn('Could not fetch payment history:', paymentError);
        setPaymentHistory([]);
      }

    } catch (error) {
      console.error('Error fetching subscription data:', error);
      setError('Failed to load subscription data');
      setSubscriptions([]);
      setCurrentSubscription(null);
      setPaymentHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePlatformPayment = async () => {
    setProcessingPayment(true);
    try {
      const response = await subscriptionsAPI.payPlatformFee();
      
      if (response.data.paymentUrl) {
        // Redirect to payment gateway
        window.location.href = response.data.paymentUrl;
      } else if (response.data.success) {
        // Payment successful
        fetchSubscriptionData();
        alert('Payment successful! You now have access to the platform.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError('Payment failed. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };

  const formatPrice = (priceInCents) => {
    return (priceInCents / 100).toFixed(2);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const isSubscriptionActive = (subscription) => {
    if (!subscription.active) return false;
    if (!subscription.expiresAt) return true;
    return new Date(subscription.expiresAt) > new Date();
  };

  const subscriptionPlans = [
    {
      id: 'platform-access',
      name: 'Platform Access',
      price: 300, // KES 300 in cents
      type: 'one_time',
      duration: '1 year',
      features: [
        'Access to all agronomists',
        'Book unlimited consultations',
        'Basic support',
        'Video call consultations',
        'Message agronomists directly'
      ]
    },
    {
      id: 'premium-monthly',
      name: 'Premium Monthly',
      price: 1000, // KES 1000 in cents
      type: 'monthly',
      duration: '1 month',
      features: [
        'All Platform Access features',
        'Priority support',
        'Unlimited consultations',
        'Advanced analytics',
        '20% discount on consultation fees',
        'Early access to new features'
      ]
    }
  ];

  // Mock data for development
  const getMockSubscriptions = () => [
    {
      _id: 'sub1',
      farmer: user?._id,
      planId: 'platform-access',
      price: 300,
      currency: 'usd',
      startedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      expiresAt: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000), // 335 days left
      provider: 'mock',
      active: true
    }
  ];

  const getMockPaymentHistory = () => [
    {
      _id: 'pay1',
      amount: 300,
      currency: 'usd',
      description: 'Platform Access Fee',
      status: 'completed',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    }
  ];

  // Use mock data if no real data available
  const displaySubscriptions = subscriptions.length > 0 ? subscriptions : getMockSubscriptions();
  const displayPaymentHistory = paymentHistory.length > 0 ? paymentHistory : getMockPaymentHistory();
  const displayCurrentSubscription = currentSubscription || getMockSubscriptions()[0];

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
        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Development Notice */}
        {subscriptions.length === 0 && (
          <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-600 px-4 py-3 rounded">
            <strong>Development Mode:</strong> Showing sample subscription data.
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Subscriptions & Payments
          </h1>
          <p className="text-gray-600">
            Manage your platform access and subscription plans
          </p>
        </div>

        {/* Current Subscription Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Current Subscription
          </h2>
          
          {displayCurrentSubscription ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 border rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Plan</p>
                <p className="text-lg font-semibold text-gray-900 capitalize">
                  {displayCurrentSubscription.planId?.replace('-', ' ') || 'Platform Access'}
                </p>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <p className={`text-lg font-semibold ${
                  isSubscriptionActive(displayCurrentSubscription) 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {isSubscriptionActive(displayCurrentSubscription) ? 'Active' : 'Inactive'}
                </p>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Price</p>
                <p className="text-lg font-semibold text-gray-900">
                  KES {formatPrice(displayCurrentSubscription.price)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {displayCurrentSubscription.planId?.includes('monthly') ? 'per month' : 'one-time'}
                </p>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <p className="text-sm text-gray-600 mb-1">
                  {displayCurrentSubscription.expiresAt ? 'Expires' : 'Started'}
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {displayCurrentSubscription.expiresAt 
                    ? formatDate(displayCurrentSubscription.expiresAt)
                    : formatDate(displayCurrentSubscription.startedAt)
                  }
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-4">💰</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Subscription</h3>
              <p className="text-gray-500 mb-4">
                You don't have an active subscription yet.
              </p>
            </div>
          )}
        </div>

        {/* Platform Fee Payment for Farmers */}
        {user?.role === 'farmer' && (!currentSubscription || !isSubscriptionActive(currentSubscription)) && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-yellow-400 text-2xl">💰</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-yellow-800">
                    Platform Access Required
                  </h3>
                  <p className="text-yellow-700">
                    Pay KES 300 to access all platform features and book consultations with agronomists.
                  </p>
                </div>
              </div>
              <button
                onClick={handlePlatformPayment}
                disabled={processingPayment}
                className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition duration-200 font-medium disabled:opacity-50"
              >
                {processingPayment ? 'Processing...' : 'Pay KES 300'}
              </button>
            </div>
          </div>
        )}

        {/* Subscription Plans */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Plans</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {subscriptionPlans.map(plan => {
              const hasPlan = displaySubscriptions.some(sub => 
                sub.planId === plan.id && isSubscriptionActive(sub)
              );
              
              return (
                <div key={plan.id} className={`bg-white rounded-lg shadow-md border-2 ${
                  hasPlan ? 'border-green-500' : 'border-gray-200 hover:border-green-500'
                } transition duration-200`}>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                      {hasPlan && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          Current Plan
                        </span>
                      )}
                    </div>
                    
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-gray-900">KES {formatPrice(plan.price)}</span>
                      <span className="text-gray-600 ml-2">
                        {plan.type === 'one_time' ? 'one-time' : `/${plan.duration.split(' ')[1]}`}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4">{plan.duration} access</p>
                    
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <span className="text-green-500 mr-2">✓</span>
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button 
                      className={`w-full py-3 rounded-lg font-medium transition duration-200 ${
                        hasPlan
                          ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                      disabled={hasPlan}
                    >
                      {hasPlan ? 'Current Plan' : `Choose ${plan.name}`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment History</h2>
          
          {displayPaymentHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 font-medium text-gray-600">Date</th>
                    <th className="text-left py-3 font-medium text-gray-600">Description</th>
                    <th className="text-left py-3 font-medium text-gray-600">Amount</th>
                    <th className="text-left py-3 font-medium text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {displayPaymentHistory.map(payment => (
                    <tr key={payment._id} className="border-b">
                      <td className="py-3 text-gray-900">
                        {formatDate(payment.createdAt)}
                      </td>
                      <td className="py-3 text-gray-900">{payment.description}</td>
                      <td className="py-3 text-gray-900">
                        KES {formatPrice(payment.amount)}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          payment.status === 'completed' 
                            ? 'bg-green-100 text-green-800'
                            : payment.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-4">💳</div>
              <p className="text-gray-500">No payment history found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;