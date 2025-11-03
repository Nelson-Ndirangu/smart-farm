const crypto = require('crypto');
const User = require('../models/user');
const { signAccessToken } = require('../utils/jwt');
const { sendEmail } = require('../utils/email');

exports.register = async (req, res) => {
  const { name, email, password, role, phone } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email already in use' });

  const user = await User.create({ name, email, password, role, phone });
  const token = signAccessToken(user);
  res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const isMatch = await user.matchPassword(password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
  const token = signAccessToken(user);
  res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(200).json({ message: 'If that email exists you will receive a password reset link.' });

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&id=${user._id}`;
  const message = `You requested a password reset. Set a new password using the link: ${resetUrl}\nIf you didn't request this please ignore.`;

  await sendEmail({ to: user.email, subject: 'Reset your password', text: message });
  res.json({ message: 'Password reset link sent to email if it exists.' });
};

exports.resetPassword = async (req, res) => {
  const { token, id } = req.query; // token from link
  const { password } = req.body;
  if (!token || !id) return res.status(400).json({ message: 'Invalid request' });

  const hashed = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    _id: id,
    passwordResetToken: hashed,
    passwordResetExpires: { $gt: Date.now() }
  });
  if (!user) return res.status(400).json({ message: 'Token invalid or expired' });

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  const newToken = signAccessToken(user);
  res.json({ message: 'Password reset successful', token: newToken });
};
