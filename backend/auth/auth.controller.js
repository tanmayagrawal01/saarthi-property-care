const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('./token.utils');
const Admin = require('../models/schema/Admin');
const User = require('../models/schema/User');
const Caretaker = require('../models/schema/Caretaker');
const bcrypt = require('bcryptjs');

// 🔑 LOGIN
exports.login = async (req, res) => {
  const { email, password, role } = req.body;

  let userModel = role === 'owner' ? User :
                  role === 'caretaker' ? Caretaker :
                  Admin;

  const user = await userModel.findOne({ email });
  if (!user || user.isDeleted) {
    return res.status(404).json({ message: 'User not found or deleted' });
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const payload = { _id: user._id, role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // Store refreshToken securely — could be saved to DB if blacklist is needed

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({ accessToken });
};

// 🔁 REFRESH TOKEN
exports.refreshToken = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: 'No refresh token' });

  try {
    const decoded = verifyRefreshToken(token);
    const accessToken = generateAccessToken({ _id: decoded._id, role: decoded.role });
    return res.status(200).json({ accessToken });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
};

// 🚪 LOGOUT
exports.logout = (req, res) => {
  res.clearCookie('refreshToken');
  return res.status(200).json({ message: 'Logged out successfully' });
};
