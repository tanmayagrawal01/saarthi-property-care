const express = require('express');
const router = express.Router();
const auth = require('../auth/auth.middleware');

// Home Page
router.get('/', (req, res) => {
  res.render('home'); // views/home.ejs
});

// Caretaker Registration Page
router.get('/caretakers/register', (req, res) => {
  res.render('caretaker_register'); // views/caretaker_register.ejs
});

// Admin Login Page
router.get('/admins/login', (req, res) => {
  res.render('login');
});

// Owner Login Page
router.get('/users/login', (req, res) => {
  res.render('login'); 
});

router.get('/users/dashboard', auth.authenticate, auth.verifyOwner, (req, res) => {
  res.render('user_dashboard', { user: req.user });
});

// Admin registration page (for superadmin only)
router.get('/admins/register', (req, res) => {
  res.render('admin_register', { error: null });
});

module.exports = router;
