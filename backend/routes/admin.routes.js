const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/admin.controller');
const auth = require('../auth/auth.middleware');
const Admin = require('../models/schema/Admin');

// Register admin (superadmin only)
router.post(
  '/register',
  auth.authenticate,
  auth.verifySuperAdmin,
  AdminController.registerAdmin
);


// router.get(
//   '/profile',
//   auth.authenticate,
//   auth.verifyAdmin,
//   async (req, res) => {
//     try {
//       const admin = await Admin.findById(req.user._id).select('-password_hash');
//       if (!admin) return res.status(404).render('404');
//       res.render('admin_profile', { admin });
//     } catch (err) {
//       console.error("Profile error:", err);
//       res.status(500).send("Internal Server Error");
//     }
//   }
// );

// 🧾 EJS login page (only for browser)
router.get('/login', (req, res) => res.render('login'));

// 🔐 Login logic (used by both /admins/login and /api/admins/login)
router.post('/login', AdminController.loginAdmin);

// 👤 Admin profile (API or EJS)
router.get('/profile', auth.authenticate, auth.verifyAdmin, AdminController.getMyProfile);


// // Get own profile
// router.get(
//   '/profile',
//   auth.authenticate,
//   auth.verifyAdmin,
//   AdminController.getMyProfile
// );

// Superadmin: get all admins
router.get(
  '/all',
  auth.authenticate,
  auth.verifySuperAdmin,
  AdminController.getAllAdmins
);

// Superadmin: change role
router.patch(
  '/:id/role',
  auth.authenticate,
  auth.verifySuperAdmin,
  AdminController.changeAdminRole
);

// Superadmin: soft delete admin
router.delete(
  '/:id',
  auth.authenticate,
  auth.verifySuperAdmin,
  AdminController.softDeleteAdmin
);

// Superadmin: restore deleted admin
router.patch(
  '/:id/restore',
  auth.authenticate,
  auth.verifySuperAdmin,
  AdminController.restoreAdmin
);

module.exports = router;
