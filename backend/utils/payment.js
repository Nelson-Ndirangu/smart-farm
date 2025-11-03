// Simple payments abstraction. If STRIPE secret is provided, use Stripe.

const stripeKey = process.env.STRIPE_SECRET_KEY;
let stripe = null;
if (stripeKey) {
  stripe = require('stripe')(stripeKey);
}

const PLATFORM_FEE_PERCENT = Number(process.env.PLATFORM_FEE_PERCENT || 10);

async function createCheckoutSession({ amount, currency = 'usd', successUrl, cancelUrl, metadata = {} }) {
  if (!stripe) {
    // mocked session
    return {
      id: 'mock_session_' + Date.now(),
      url: successUrl + '?session_id=mock_' + Date.now()
    };
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{ price_data: { currency, product_data: { name: 'FarmConnect payment' }, unit_amount: amount }, quantity: 1 }],
    mode: 'payment',
    success_url: successUrl + '?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: cancelUrl,
    metadata
  });
  return session;
}

async function capturePaymentMock({ amount, currency = 'usd' }) {
  // Simulate successful capture and return provider payment id
  return { id: 'mock_payment_' + Date.now(), provider: 'mock' };
}

// For production: you can later add createPaymentIntent, handle webhook, transfer to agronomist (Stripe Connect).
module.exports = { createCheckoutSession, capturePaymentMock, PLATFORM_FEE_PERCENT };
