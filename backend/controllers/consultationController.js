const Consultation = require('../models/consultation');
const Transaction = require('../models/transaction');
const User = require('../models/user');
const payments = require('../utils/payment');

exports.createConsultationRequest = async (req, res) => {
  // farmer creates request to a specific agronomist
  const { agronomistId, topic, description, scheduledAt, price } = req.body;
  if (!agronomistId || !topic || !price) return res.status(400).json({ message: 'Missing fields' });

  const agr = await User.findById(agronomistId);
  if (!agr || agr.role !== 'agronomist') return res.status(404).json({ message: 'Agronomist not found' });

  const consultation = await Consultation.create({
    farmer: req.user._id,
    agronomist: agr._id,
    topic,
    description,
    scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
    price: Math.round(price), // expect cents
    currency: 'usd',
    status: 'pending'
  });

  // create a checkout session or mock url
  const successUrl = `${process.env.FRONTEND_URL}/consultation/success?consultationId=${consultation._id}`;
  const cancelUrl = `${process.env.FRONTEND_URL}/consultation/cancel?consultationId=${consultation._id}`;
  const session = await payments.createCheckoutSession({
    amount: consultation.price,
    currency: consultation.currency,
    successUrl,
    cancelUrl,
    metadata: { consultationId: String(consultation._id) }
  });

  res.status(201).json({ consultation, checkout: session });
};

exports.handleMockPayment = async (req, res) => {
  // This endpoint simulates completing a payment for local dev.
  const { consultationId } = req.params;
  const consultation = await Consultation.findById(consultationId);
  if (!consultation) return res.status(404).json({ message: 'Not found' });
  if (consultation.status !== 'pending') return res.status(400).json({ message: 'Invalid status' });

  // simulate payment capture
  const payment = await payments.capturePaymentMock({ amount: consultation.price, currency: consultation.currency });

  consultation.status = 'paid';
  consultation.payment = { paymentId: payment.id, provider: payment.provider, paidAt: new Date() };
  await consultation.save();

  // credit agronomist wallet after platform fee
  const agr = await User.findById(consultation.agronomist);
  const PLATFORM_FEE = Math.round(consultation.price * (payments.PLATFORM_FEE_PERCENT / 100));
  const agrAmount = consultation.price - PLATFORM_FEE;

  agr.wallet.balance = (agr.wallet.balance || 0) + agrAmount;
  await agr.save();

  // create transaction record
  await Transaction.create({
    type: 'consultation_payment',
    amount: consultation.price,
    currency: consultation.currency,
    from: consultation.farmer,
    to: consultation.agronomist,
    consultation: consultation._id,
    provider: payment.provider,
    providerPaymentId: payment.id
  });

  res.json({ message: 'Payment processed (mock)', consultation });
};

exports.getConsultationsForUser = async (req, res) => {
  const role = req.user.role;
  const filter = {};
  if (role === 'farmer') filter.farmer = req.user._id;
  if (role === 'agronomist') filter.agronomist = req.user._id;
  const list = await Consultation.find(filter).populate('farmer agronomist', 'name email');
  res.json({ consultations: list });
};

exports.updateConsultationStatus = async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;
  const consultation = await Consultation.findById(id);
  if (!consultation) return res.status(404).json({ message: 'Not found' });

  // only involved parties or admin can change
  if (![String(consultation.farmer), String(consultation.agronomist)].includes(String(req.user._id)) && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not allowed' });
  }

  if (status) consultation.status = status;
  if (notes) consultation.notes = notes;
  await consultation.save();
  res.json({ consultation });
};
