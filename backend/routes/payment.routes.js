const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/payment.controller');
const auth = require('../auth/auth.middleware');

// Create a payment (owner only, must be authenticated)
router.post(
  '/',
  auth.authenticate,
  auth.verifyOwner,
  PaymentController.createPayment
);

// Get all payments for the logged-in user (owner)
router.get(
  '/user/all',
  auth.authenticate,
  auth.verifyOwner,
  PaymentController.getUserPayments
);

// Get all payments for the logged-in caretaker
router.get(
  '/caretaker/all',
  auth.authenticate,
  auth.verifyCaretaker,
  PaymentController.getCaretakerPayments
);

// Get all payments for admin dashboard
router.get(
  '/admin/all',
  auth.authenticate,
  auth.verifyAdmin,
  PaymentController.getAllPayments
);

// Process a refund (admin only)
router.post(
  '/:id/refund',
  auth.authenticate,
  auth.verifyAdmin,
  PaymentController.processRefund
);

// Get payment details by ID (owner or admin)
router.get(
  '/:id',
  auth.authenticate,
  auth.verifyOwnerOrAdmin,
  PaymentController.getPaymentById
);

module.exports = router;
