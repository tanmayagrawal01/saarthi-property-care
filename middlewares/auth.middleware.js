const jwt = require('jsonwebtoken');
const User = require('../models/schema/User'); // adjust path as needed

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Middleware to verify token and attach user to request
exports.authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token missing' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded._id);
    if (!user || user.isDeleted) {
      return res.status(401).json({ message: 'User not found or inactive' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Owner-only access
exports.verifyOwner = (req, res, next) => {
  if (req.user?.role === 'owner') return next();
  return res.status(403).json({ message: 'Access denied: Owner only' });
};

// Caretaker-only access
exports.verifyCaretaker = (req, res, next) => {
  if (req.user?.role === 'caretaker') return next();
  return res.status(403).json({ message: 'Access denied: Caretaker only' });
};

// Admin-only access (admin or superadmin)
exports.verifyAdmin = (req, res, next) => {
  if (req.user?.role === 'admin' || req.user?.role === 'superadmin') return next();
  return res.status(403).json({ message: 'Access denied: Admin only' });
};

// Admin-only access
exports.verifySuperAdmin = (req, res, next) => {
  if (req.user?.role === 'superadmin') return next();
  return res.status(403).json({ message: 'Only superadmin can perform this action' });
};


// Owner or Admin access
exports.verifyOwnerOrAdmin = (req, res, next) => {
  if (req.user?.role === 'owner' || req.user?.role === 'admin') return next();
  return res.status(403).json({ message: 'Access denied: Owner or Admin only' });
};
