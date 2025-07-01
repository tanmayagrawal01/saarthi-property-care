const jwt = require('jsonwebtoken');
const User = require('../models/schema/User'); // for owners
const Admin = require('../models/schema/Admin');
const Caretaker = require('../models/schema/Caretaker');

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to authenticate and attach user
exports.authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token missing' });
    }

    const token = authHeader.split(' ')[1];
    const { verifyAccessToken } = require('./token.utils');
    const decoded = verifyAccessToken(token);


    let user = null;

    if (decoded.role === 'caretaker') {
      user = await Caretaker.findById(decoded._id);
    } else if (decoded.role === 'owner') {
      user = await User.findById(decoded._id);
    } else if (decoded.role === 'admin' || decoded.role === 'superadmin') {
      user = await Admin.findById(decoded._id);
    }

    if (!user || user.isDeleted) {
      return res.status(401).json({ message: 'User not found or inactive' });
    }

    console.log("Authenticated:", { id: user._id, role: decoded.role });
    req.user = user;
    req.user.role = decoded.role; // attach role from token
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token', error: err.message });
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
  if (req.user?.role === 'admin' || req.user?.role === 'superadmin') return next();
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
