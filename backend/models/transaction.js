const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['consultation_payment', 'payout', 'subscription_payment'], required: true },
  amount: { type: Number, required: true }, // cents
  currency: { type: String, default: 'usd' },
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // payer
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // payee (agronomist)
  consultation: { type: mongoose.Schema.Types.ObjectId, ref: 'Consultation' },
  provider: { type: String, default: 'mock' },
  providerPaymentId: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
