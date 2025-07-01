const express = require('express');
const router = express.Router();
const CancellationController = require('../controllers/cancellation.controller');
const auth = require('../auth/auth.middleware');

// Create a cancellation request
router.post(
  '/',
  auth.authenticate,
  CancellationController.createCancellation
);

// Get cancellations by booking ID (owner/admin)
router.get(
  '/booking/:bookingId',
  auth.authenticate,
  auth.verifyOwnerOrAdmin,
  CancellationController.getByBookingId
);

// Get cancellations made by logged-in user (owner or caretaker)
router.get(
  '/my',
  auth.authenticate,
  CancellationController.getMyCancellations
);

// Admin: Get all cancellations
router.get(
  '/admin/all',
  auth.authenticate,
  auth.verifyAdmin,
  CancellationController.getAllCancellations
);

module.exports = router;
