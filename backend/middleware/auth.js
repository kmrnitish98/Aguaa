const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Diagnostic: log what cookies/headers arrive (dev only, safe in prod as warn)
  if (process.env.NODE_ENV !== 'production') {
    console.log('[Auth Middleware] cookies:', JSON.stringify(req.cookies));
    console.log('[Auth Middleware] origin:', req.headers.origin);
  }

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    console.warn('[Auth Middleware] No token found in cookies or Authorization header for', req.originalUrl);
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized, token invalid' });
  }
};

module.exports = { protect };
