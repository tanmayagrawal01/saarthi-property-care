const Caretaker = require('../models/schema/Caretaker');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_token';

// ✅ Register caretaker
exports.registerCaretaker = async (req, res) => {
  try {
    const {
      name, email, phone, password,
      location_city_id, experience_years,
      aadhaar_number, aadhaar_image_url,
      selfie_with_aadhaar_url
    } = req.body;

    if (!name || !phone || !password || !location_city_id || !selfie_with_aadhaar_url) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

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

// ✅ Login caretaker
exports.loginCaretaker = async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) {
      return res.status(400).json({ message: 'Phone and password required' });
    }

    const caretaker = await Caretaker.findOne({ phone, isDeleted: false });
    if (!caretaker) {
      return res.status(404).json({ message: 'Caretaker not found' });
    }

    const isMatch = await bcrypt.compare(password, caretaker.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { _id: caretaker._id, role: 'caretaker' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    caretaker.last_login = new Date();
    await caretaker.save();

    res.json({ token, caretaker });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// ✅ Get own profile
exports.getMyProfile = async (req, res) => {
  try {
    const caretaker = await Caretaker.findById(req.user._id);
    if (!caretaker || caretaker.isDeleted) {
      return res.status(404).json({ message: 'Caretaker not found' });
    }
    res.json(caretaker);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
  }
};

// ✅ Update availability (caretaker only)
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

// ✅ Admin: get all caretakers
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

// ✅ Admin: verify caretaker background
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

// ✅ Public: get caretaker by ID
exports.getCaretakerById = async (req, res) => {
  try {
    const caretaker = await Caretaker.findById(req.params.id)
      .select('-password_hash');

    if (!caretaker || caretaker.isDeleted) {
      return res.status(404).json({ message: 'Caretaker not found' });
    }

    res.json(caretaker);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch caretaker', error: err.message });
  }
};
