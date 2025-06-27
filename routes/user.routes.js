const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/schema/User');
const auth = require('../middlewares/auth.middleware');

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';

// ✅ User Registration
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, user_type } = req.body;

    if (!name || !email || !phone || !password || !user_type) {
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
      password_hash: hashedPassword,
      user_type
    });

    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, isDeleted: false });
    if (!user) {
      return res.status(404).json({ message: 'Invalid credentials' });
    }
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { _id: user._id, role: user.user_type === 'property_owner' ? 'owner' : 'caretaker' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    user.last_login = new Date();
    await user.save();

    res.json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        user_type: user.user_type
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ Get current user profile
router.get('/me', auth.authenticate, async (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    phone: req.user.phone,
    user_type: req.user.user_type
  });
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

module.exports = router;
