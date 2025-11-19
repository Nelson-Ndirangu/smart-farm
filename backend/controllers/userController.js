const User = require('../models/user');

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password -refreshTokens');
  res.json({ user });
};

exports.searchAgronomists = async (req, res) => {
  const q = req.query.q || '';
  const location = req.query.location;
  const filter = { role: 'agronomist' };
  if (q) filter.$or = [{ name: new RegExp(q, 'i') }, { 'profile.bio': new RegExp(q, 'i') }, { 'profile.skills': new RegExp(q, 'i') }];
  if (location) filter['profile.location'] = new RegExp(location, 'i');
  const ags = await User.find(filter).select('name profile wallet location email');
  res.json({ results: ags });
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -refreshTokens');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};



// Admin or agronomist endpoints to manage profile or withdraw
exports.updateProfile = async (req, res) => {
  const updates = req.body;
  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true }).select('-password');
  res.json({ user });
};

exports.withdraw = async (req, res) => {
  // simple simulated withdraw: moves balance to zero and creates a transaction (not implemented here)
  const amount = Number(req.body.amount || 0);
  if (req.user.role !== 'agronomist') return res.status(403).json({ message: 'Only agronomists can withdraw' });
  if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid amount' });
  if (amount > req.user.wallet.balance) return res.status(400).json({ message: 'Insufficient balance' });

  req.user.wallet.balance -= amount;
  await req.user.save();
  res.json({ message: 'Payout requested (mock)', balance: req.user.wallet.balance });
};
