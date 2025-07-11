const express = require('express');
const router = express.Router();
const auth = require('../auth/auth.middleware');
const CaretakerController = require('../controllers/caretaker.controller');
const Caretaker=require('../models/schema/Caretaker');
const Booking = require('../models/schema/Booking');
// Register a new caretaker
router.post('/register', CaretakerController.registerCaretaker);

// Login as caretaker
router.post('/login', CaretakerController.loginCaretaker);

// Logout caretaker
router.post('/logout', auth.authenticate, auth.verifyCaretaker, CaretakerController.logoutCaretaker);

router.get('/dashboard', auth.authenticate, auth.verifyCaretaker, async (req, res) => {
  const caretaker = await Caretaker.findById(req.user._id).populate('location_city_id');

  const schedule = await Booking.find({
    caretaker_id: caretaker._id,
    status: 'upcoming'
  }).lean();

  const stats = {
    hoursWorked: 120, // Calculate if needed
    totalEarnings: 3250 // Calculate from Booking or Payments
  };

  res.render('caretaker_dashboard', { caretaker, schedule, stats });
});

// Get logged-in caretaker profile
router.get('/me', auth.authenticate, auth.verifyCaretaker, CaretakerController.getMyProfile);

// Update availability (caretaker only)
router.patch('/me/availability', auth.authenticate, auth.verifyCaretaker, CaretakerController.updateAvailability);

// Admin: get all caretakers
router.get('/admin/all', auth.authenticate, auth.verifyAdmin, CaretakerController.getAllCaretakers);

// Admin: verify caretaker background
router.patch('/admin/:id/verify', auth.authenticate, auth.verifyAdmin, CaretakerController.verifyBackground);

// Get caretaker by ID (public info)
router.get('/:id', CaretakerController.getCaretakerById);

module.exports = router;
