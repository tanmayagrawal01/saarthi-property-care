const express = require('express');
const router = express.Router();
const BookingController = require('../controllers/booking.controller');
const auth = require('../middlewares/auth.middleware');

// Create a new booking (owner only)
router.post(
  '/',
  auth.authenticate,
  auth.verifyOwner,
  BookingController.createBooking
);

// Get a specific booking by ID (owner or admin)
router.get(
  '/:id',
  auth.authenticate,
  auth.verifyOwnerOrAdmin,
  BookingController.getBookingById
);

// Get all bookings for logged-in owner
router.get(
  '/owner/all',
  auth.authenticate,
  auth.verifyOwner,
  BookingController.getOwnerBookings
);

// Get all bookings for logged-in caretaker
router.get(
  '/caretaker/all',
  auth.authenticate,
  auth.verifyCaretaker,
  BookingController.getCaretakerBookings
);

// Owner cancels a booking
router.patch(
  '/:id/cancel',
  auth.authenticate,
  auth.verifyOwner,
  BookingController.cancelBooking
);

// Admin changes status (confirmed/completed/cancelled)
router.patch(
  '/:id/status',
  auth.authenticate,
  auth.verifyAdmin,
  BookingController.updateBookingStatus
);

// Owner submits guest feedback
router.patch(
  '/:id/feedback',
  auth.authenticate,
  auth.verifyOwner,
  BookingController.submitFeedback
);

// Admin soft deletes a booking
router.delete(
  '/:id',
  auth.authenticate,
  auth.verifyAdmin,
  BookingController.softDeleteBooking
);

module.exports = router;
