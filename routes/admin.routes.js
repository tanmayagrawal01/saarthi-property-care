const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/admin.controller');
const auth = require('../middlewares/auth.middleware');

// Register admin (superadmin only)
router.post(
  '/register',
  auth.authenticate,
  auth.verifySuperAdmin,
  AdminController.registerAdmin
);

// Admin login
router.post('/login', AdminController.loginAdmin);

// Get own profile
router.get(
  '/me',
  auth.authenticate,
  auth.verifyAdmin,
  AdminController.getMyProfile
);

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
