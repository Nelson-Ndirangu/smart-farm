// Authentication middleware to protect routes
const jwt = require('jsonwebtoken');
const Farmer = require('./models/Farmer');
const Agronomist = require('./models/Agronomist');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user;
    if (decoded.role === 'farmer') {
      user = await Farmer.findById(decoded.userId);
    } else if (decoded.role === 'agronomist') {
      user = await Agronomist.findById(decoded.userId);
    }

    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = user;
    req.role = decoded.role;
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
