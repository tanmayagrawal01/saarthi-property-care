const Admin = require('../models/schema/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET;

// Register a new admin (Superadmin only)
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ message: 'Admin with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      name,
      email,
      password_hash: hashedPassword,
      role,
      created_by: req.user._id
    });

    await newAdmin.save();
    res.status(201).json({ message: 'Admin registered successfully', admin: newAdmin });

  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// Admin login
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email, isDeleted: false });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      admin.login_attempts += 1;
      await admin.save();
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { _id: admin._id, role: admin.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    admin.last_login_at = new Date();
    admin.login_attempts = 0;
    await admin.save();

    res.json({ token, admin });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// Get logged-in admin's profile
exports.getMyProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user._id).select('-password_hash');
    if (!admin || admin.isDeleted) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
  }
};

// Superadmin: get all admins
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({ isDeleted: false }).select('-password_hash');
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch admins', error: err.message });
  }
};

// Superadmin: change admin role
exports.changeAdminRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { newRole } = req.body;

    if (!['superadmin', 'moderator'].includes(newRole)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    const admin = await Admin.findById(id);
    if (!admin || admin.isDeleted) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    admin.status_log.push({
      role: newRole,
      changed_by: req.user._id
    });
    admin.role = newRole;
    admin.updated_by = req.user._id;

    await admin.save();
    res.json({ message: 'Admin role updated', admin });
  } catch (err) {
    res.status(500).json({ message: 'Role update failed', error: err.message });
  }
};

// Superadmin: soft delete admin
exports.softDeleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await Admin.findById(id);
    if (!admin || admin.isDeleted) {
      return res.status(404).json({ message: 'Admin not found or already deleted' });
    }

    admin.isDeleted = true;
    admin.updated_by = req.user._id;
    await admin.save();

    res.json({ message: 'Admin deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};

// Superadmin: restore deleted admin
exports.restoreAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await Admin.findById(id);
    if (!admin || !admin.isDeleted) {
      return res.status(404).json({ message: 'Admin not found or not deleted' });
    }

    admin.isDeleted = false;
    admin.updated_by = req.user._id;
    await admin.save();

    res.json({ message: 'Admin restored successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Restore failed', error: err.message });
  }
};
