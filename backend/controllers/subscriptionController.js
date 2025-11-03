const Subscription = require('../models/subcription');
const payments = require('../utils/payment');

exports.createSubscription = async (req, res) => {
  // Farmer subscribes to plan
  if (req.user.role !== 'farmer') return res.status(403).json({ message: 'Only farmers can subscribe' });
  const { planId, price, durationDays } = req.body;
  if (!planId || !price || !durationDays) return res.status(400).json({ message: 'Missing fields' });

  const startedAt = new Date();
  const expiresAt = new Date(startedAt.getTime() + durationDays * 24 * 60 * 60 * 1000);

  // Simulate or create checkout
  const successUrl = `${process.env.FRONTEND_URL}/subscription/success?planId=${planId}`;
  const cancelUrl = `${process.env.FRONTEND_URL}/subscription/cancel?planId=${planId}`;
  const session = await payments.createCheckoutSession({
    amount: Math.round(price),
    currency: 'usd',
    successUrl,
    cancelUrl,
    metadata: { userId: req.user._id.toString(), planId }
  });

  // Note: We create subscription record on webhook / success in production. For mock: we create it now.
  if (!process.env.STRIPE_SECRET_KEY) {
    // immediate create for mock
    const sub = await Subscription.create({
      farmer: req.user._id,
      planId,
      price: Math.round(price),
      currency: 'usd',
      startedAt,
      expiresAt,
      provider: 'mock',
      active: true
    });
    return res.status(201).json({ subscription: sub, checkout: session });
  }

  res.json({ checkout: session });
};

exports.getSubscriptions = async (req, res) => {
  const subs = await Subscription.find({ farmer: req.user._id });
  res.json({ subscriptions: subs });
};
