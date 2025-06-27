const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const CaretakerController = require('../controllers/caretaker.contoller');

// 🟢 Register a new caretaker
router.post('/register', CaretakerController.registerCaretaker);

// 🟢 Login as caretaker
router.post('/login', CaretakerController.loginCaretaker);

// 🟢 Get logged-in caretaker profile
router.get('/me', auth.authenticate, auth.verifyCaretaker, CaretakerController.getMyProfile);

// 🟢 Update availability (caretaker only)
router.patch('/me/availability', auth.authenticate, auth.verifyCaretaker, CaretakerController.updateAvailability);

// 🔒 Admin: get all caretakers
router.get('/admin/all', auth.authenticate, auth.verifyAdmin, CaretakerController.getAllCaretakers);

// 🔒 Admin: verify caretaker background
router.patch('/admin/:id/verify', auth.authenticate, auth.verifyAdmin, CaretakerController.verifyBackground);

// (Optional) Get caretaker by ID (public info)
router.get('/:id', CaretakerController.getCaretakerById);

module.exports = router;
