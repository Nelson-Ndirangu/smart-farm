const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  planId: { type: String, required: true }, // e.g. monthly-basic
  price: { type: Number, required: true }, // cents
  currency: { type: String, default: 'usd' },
  startedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  provider: { type: String, default: 'mock' }, // stripe or mock
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Subscription', SubscriptionSchema);
