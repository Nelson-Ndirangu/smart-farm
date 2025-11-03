const jwtUtil = require('../utils/jwt');
const User = require('../models/user');

const auth = (roles = []) => {
  // roles can be string or array
  if (typeof roles === 'string') roles = [roles];

  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No Authorization header' });
      }
      const token = authHeader.split(' ')[1];
      const decoded = jwtUtil.verifyToken(token);
      const user = await User.findById(decoded.id).select('+password');
      if (!user) return res.status(401).json({ message: 'User not found' });
      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Unauthorized', details: err.message });
    }
  };
};

module.exports = auth;
