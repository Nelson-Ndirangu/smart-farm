const mongoose = require('mongoose');

const ConsultationSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  agronomist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  topic: { type: String, required: true },
  description: { type: String },
  scheduledAt: { type: Date }, // optional scheduled time
  price: { type: Number, required: true }, // cents
  currency: { type: String, default: 'usd' },
  status: {
    type: String,
    enum: ['pending', 'paid', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  payment: {
    paymentId: String,
    provider: String, // stripe, mock
    paidAt: Date
  },
  notes: { type: String }
}, { timestamps: true });

const Consultation = mongoose.model('Consultation', ConsultationSchema);
module.exports = Consultation;