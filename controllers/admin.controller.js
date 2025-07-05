const Admin = require('../models/schema/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const JWT_SECRET = process.env.JWT_SECRET;

// 🔐 Register a new admin (Superadmin only)
exports.registerAdmin = async (req, res) => {
  const isApiRequest = req.originalUrl.startsWith('/api/');

  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      if (isApiRequest) {
        return res.status(400).json({ message: 'All fields are required' });
      } else {
        return res.status(400).render('admin_register', { error: 'All fields are required' });
      }
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      if (isApiRequest) {
        return res.status(409).json({ message: 'Admin with this email already exists' });
      } else {
        return res.status(409).render('admin_register', { error: 'Admin with this email already exists' });
      }
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

    if (isApiRequest) {
      return res.status(201).json({ message: 'Admin registered successfully', admin: newAdmin });
    } else {
      return res.redirect('/admins/login'); // or wherever you want to land after success
    }

  } catch (err) {
    if (isApiRequest) {
      return res.status(500).json({ message: 'Registration failed', error: err.message });
    } else {
      return res.status(500).render('admin_register', { error: 'Server error during registration' });
    }
  }
};


// 🔑 Admin Login
// 🔑 Admin Login — works for both /admins/login and /api/admins/login
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const isApiRequest = req.originalUrl.startsWith('/api/');

    const admin = await Admin.findOne({ email, isDeleted: false });
    if (!admin) {
      if (isApiRequest) {
        return res.status(404).json({ message: 'Admin not found' });
      } else {
        return res.status(404).render('admin_login', { error: 'Admin not found' });
      }
    }

    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      admin.login_attempts += 1;
      await admin.save();

      if (isApiRequest) {
        return res.status(401).json({ message: 'Invalid email or password' });
      } else {
        return res.status(401).render('admin_login', { error: 'Invalid email or password' });
      }
    }

    const token = jwt.sign(
      { _id: admin._id, role: admin.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Save login state
    admin.last_login_at = new Date();
    admin.login_attempts = 0;
    await admin.save();

    // API → return JSON token
    if (isApiRequest) {
      return res.status(200).json({ token, admin });
    }

    // Browser → set cookie and redirect
    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.redirect('/admins/profile');

  } catch (err) {
    const isApiRequest = req.originalUrl.startsWith('/api/');
    if (isApiRequest) {
      return res.status(500).json({ message: 'Login failed', error: err.message });
    } else {
      return res.status(500).render('admin_login', { error: 'Server error during login' });
    }
  }
};


// 👤 Get logged-in admin's profile
// 👤 Get logged-in admin's profile (API or EJS)
exports.getMyProfile = async (req, res) => {
  try {
    const isApiRequest = req.originalUrl.startsWith('/api/');
    const admin = await Admin.findById(req.user._id).select('-password_hash');

    if (!admin || admin.isDeleted) {
      if (isApiRequest) {
        return res.status(404).json({ message: 'Admin not found' });
      } else {
        return res.status(404).render('404', { message: 'Admin not found' });
      }
    }

    if (isApiRequest) {
      return res.json(admin);
    } else {
      return res.render('admin_profile', { admin });
    }
  } catch (err) {
    const isApiRequest = req.originalUrl.startsWith('/api/');
    if (isApiRequest) {
      return res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
    } else {
      return res.status(500).render('500', { message: 'Server error while fetching profile' });
    }
  }
};


// 📋 Superadmin: get all admins
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({ isDeleted: false }).select('-password_hash');
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch admins', error: err.message });
  }
};

// 🔁 Superadmin: change admin role
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

    admin.status_log.push({ role: newRole, changed_by: req.user._id });
    admin.role = newRole;
    admin.updated_by = req.user._id;

    await admin.save();
    res.json({ message: 'Admin role updated', admin });
  } catch (err) {
    res.status(500).json({ message: 'Role update failed', error: err.message });
  }
};

// ❌ Superadmin: soft delete admin
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

// ♻️ Superadmin: restore deleted admin
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
