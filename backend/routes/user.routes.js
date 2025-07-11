const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/schema/User');
const auth = require('../auth/auth.middleware');

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';

// User Registration (Only property owners now)
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'User already exists with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      phone,
      password_hash: hashedPassword
    });

    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Owner login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const isApi = req.originalUrl.startsWith('/api/');

    const user = await User.findOne({ email, isDeleted: false });
    if (!user) {
      const error = { message: 'Invalid email or password' };
      return isApi
        ? res.status(404).json(error)
        : res.status(404).render('login', { error: error.message });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      const error = { message: 'Invalid email or password' };
      return isApi
        ? res.status(401).json(error)
        : res.status(401).render('login', { error: error.message });
    }

    const token = jwt.sign({ _id: user._id, role: 'owner' }, JWT_SECRET, {
      expiresIn: '7d',
    });

    user.last_login = new Date();
    await user.save();

    if (isApi) {
      return res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
      });
    } else {
      // Set token in cookie and redirect to dashboard
      res.cookie('accessToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return res.redirect('/users/dashboard');
    }

  } catch (err) {
    console.error(err);
    const isApi = req.originalUrl.startsWith('/api/') || req.headers.accept.includes('application/json');
    const errorMessage = 'Server error';
    return isApi
      ? res.status(500).json({ message: errorMessage, error: err.message })
      : res.status(500).render('login', { error: errorMessage });
  }
});


// Get current owner profile
router.get('/me', auth.authenticate, auth.verifyOwner, async (req, res) => {
  const isApiRequest = req.originalUrl.startsWith('/api/') || req.headers.accept.includes('application/json');

  if (isApiRequest) {
    return res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone
    });
  }
    return res.render('user_profile', { owner: req.user });
});


// ✅ Update current user profile
router.put('/me', auth.authenticate, async (req, res) => {
  try {
    const updates = req.body;
    const allowedFields = ['name', 'phone', 'address', 'profile_photo_url', 'city_id'];
    const filteredUpdates = {};

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field];
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: filteredUpdates },
      { new: true }
    );

    res.json({ message: 'Profile updated', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile', error: err.message });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('accessToken');
  res.redirect('/users/login');
});

module.exports = router;
