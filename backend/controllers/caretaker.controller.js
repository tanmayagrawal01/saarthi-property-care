const Caretaker = require('../models/schema/Caretaker');
const Booking = require('../models/schema/Booking');
const City = require('../models/schema/City');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { generateAccessToken, generateRefreshToken } = require('../auth/token.utils');
const JWT_SECRET = process.env.JWT_SECRET || 'secret_token';

// Register caretaker
exports.registerCaretaker = async (req, res) => {
  try {
    const {
      name, email, phone, password,
      city_name, experience_years,
      aadhaar_number, aadhaar_image_url,
      selfie_with_aadhaar_url
    } = req.body;

    if (!name || !phone || !password || !city_name || !selfie_with_aadhaar_url) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const cityDoc = await City.findOne({ name: city_name });
    if (!cityDoc) {
      return res.status(404).json({ message: 'City not found' });
    }
    const location_city_id = cityDoc._id;

    const existing = await Caretaker.findOne({ $or: [{ email }, { phone }] });
    if (existing) {
      return res.status(409).json({ message: 'Caretaker already exists with this phone/email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const caretaker = new Caretaker({
      name,
      email,
      phone,
      password_hash: hashedPassword,
      location_city_id,
      experience_years,
      aadhaar_number,
      aadhaar_image_url,
      selfie_with_aadhaar_url
    });

    await caretaker.save();
    res.status(201).json({ message: 'Caretaker registered successfully', caretaker });

  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// Login caretaker
exports.loginCaretaker = async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) {
      return res.status(400).render('login', { error: 'Phone and password required' });
    }

    const caretaker = await Caretaker.findOne({ phone, isDeleted: false });
    if (!caretaker) {
      return res.status(404).render('login', { error: 'Caretaker not found' });
    }

    const isMatch = await bcrypt.compare(password, caretaker.password_hash);
    if (!isMatch) {
      return res.status(401).render('login', { error: 'Invalid credentials' });
    }

    const payload = { _id: caretaker._id, role: 'caretaker' };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });

    caretaker.last_login = new Date();
    await caretaker.save();

    return res.redirect('/caretakers/dashboard');
  } catch (err) {
    return res.status(500).render('login', { error: 'Login failed: ' + err.message });
  }
};

// Logout caretaker
exports.logoutCaretaker = (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  return res.redirect('/users/login');
};

// Get own profile
exports.getMyProfile = async (req, res) => {
  try {
    const caretaker = await Caretaker.findById(req.user._id).populate('location_city_id');
    if (!caretaker || caretaker.isDeleted) {
      return res.status(404).json({ message: 'Caretaker not found' });
    }
    res.json(caretaker);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
  }
};

// Dashboard route controller
exports.renderDashboard = async (req, res) => {
  try {
    const caretaker = await Caretaker.findById(req.user._id)
      .populate({
        path: 'location_city_id',
        match: { isDeleted: false } // ⬅️ ensures city isn't soft-deleted
      });

    if (!caretaker || caretaker.isDeleted) {
      return res.status(404).render('error', { message: 'Caretaker not found' });
    }

    res.render('caretaker_dashboard', { caretaker });
  } catch (err) {
    res.status(500).render('error', {
      message: 'Something went wrong',
      error: err.message
    });
  }
};

// Update availability (caretaker only)
exports.updateAvailability = async (req, res) => {
  try {
    const { is_available } = req.body;
    const caretaker = await Caretaker.findById(req.user._id);
    if (!caretaker || caretaker.isDeleted) {
      return res.status(404).json({ message: 'Caretaker not found' });
    }
    caretaker.is_available = is_available;
    await caretaker.save();
    res.json({ message: 'Availability updated', is_available });
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

// Admin: get all caretakers
exports.getAllCaretakers = async (req, res) => {
  try {
    const caretakers = await Caretaker.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .select('-password_hash');
    res.json(caretakers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch caretakers', error: err.message });
  }
};

// Admin: verify caretaker background
exports.verifyBackground = async (req, res) => {
  try {
    const { id } = req.params;
    const caretaker = await Caretaker.findById(id);
    if (!caretaker || caretaker.isDeleted) {
      return res.status(404).json({ message: 'Caretaker not found' });
    }
    caretaker.background_verified = true;
    caretaker.verification_level = 'aadhaar_selfie_verified';
    await caretaker.save();
    res.json({ message: 'Caretaker verified successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Verification failed', error: err.message });
  }
};

// Public: get caretaker by ID
exports.getCaretakerById = async (req, res) => {
  try {
    const caretaker = await Caretaker.findById(req.params.id).select('-password_hash');
    if (!caretaker || caretaker.isDeleted) {
      return res.status(404).json({ message: 'Caretaker not found' });
    }
    res.json(caretaker);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch caretaker', error: err.message });
  }
};
