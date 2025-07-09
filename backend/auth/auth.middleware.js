const jwt = require('jsonwebtoken');
const User = require('../models/schema/User'); // for owners
const Admin = require('../models/schema/Admin');
const Caretaker = require('../models/schema/Caretaker');

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to authenticate and attach user
exports.authenticate = async (req, res, next) => {
  try {
    let token;

    // ✅ Try Authorization header (Postman, React, etc.)
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // ✅ Then try accessToken from cookie (browser login)
    if (!token && req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({ message: 'Authorization token missing' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    let user;
    if (decoded.role === 'caretaker') {
      user = await Caretaker.findById(decoded._id);
    } else if (decoded.role === 'owner') {
      user = await User.findById(decoded._id);
    } else {
      user = await Admin.findById(decoded._id);
    }

    if (!user || user.isDeleted) {
      return res.status(401).json({ message: 'User not found or deleted' });
    }

    req.user = user;
    req.user.role = decoded.role;
    next();
  } catch (err) {
    console.error('Auth error:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Role checkers
exports.verifyCaretaker = (req, res, next) => {
  if (req.user?.role === 'caretaker') return next();
  return res.status(403).json({ message: 'Access denied: Caretaker only' });
};

exports.verifyOwner = (req, res, next) => {
  if (req.user?.role === 'owner') return next();
  return res.status(403).json({ message: 'Access denied: Owner only' });
};

exports.verifyAdmin = (req, res, next) => {
  if (req.user?.role === 'moderator' || req.user?.role === 'superadmin') return next();
  return res.status(403).json({ message: 'Access denied: Admin only' });
};

exports.verifySuperAdmin = (req, res, next) => {
  if (req.user?.role === 'superadmin') return next();
  return res.status(403).json({ message: 'Access denied: Superadmin only' });
};

exports.verifyOwnerOrAdmin = (req, res, next) => {
  if (['owner', 'admin', 'superadmin'].includes(req.user?.role)) return next();
  return res.status(403).json({ message: 'Access denied: Owner or Admin only' });
};
