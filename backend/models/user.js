const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const WalletSchema = new mongoose.Schema({
  balance: { type: Number, default: 0 }, // amount in cents
  currency: { type: String, default: 'usd' }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6, select: false },
  role: { type: String, enum: ['farmer', 'agronomist', 'admin'], default: 'farmer' },
  category: { type: String, enum: ['organic', 'conventional', 'hydroponic', 'horticulture', 'dairy'], default: 'conventional' },
  profile: {
    bio: String,
    location: String,
    skills: [String]
  },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  wallet: WalletSchema,
  isVerified: { type: Boolean, default: false },
  refreshTokens: [{ token: String, createdAt: Date }],
  passwordResetToken: String,
  passwordResetExpires: Date
}, { timestamps: true });

// hash password before save (if modified)
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (candidate) {
  return await bcrypt.compare(candidate, this.password);
};

UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashed = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetToken = hashed;
  this.passwordResetExpires = Date.now() + 1000 * 60 * 60; // 1 hour
  return resetToken;
};

 const User = mongoose.model('User', UserSchema);
module.exports = User;
