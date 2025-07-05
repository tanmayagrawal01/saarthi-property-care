const express = require('express');
const router = express.Router();

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
  res.render('admin_login'); // views/admin_login.ejs
});

// Owner Login Page
router.get('/owners/login', (req, res) => {
  res.render('owner_login'); // views/owner_login.ejs
});

// 404 Page (Optional)
// router.get('*', (req, res) => {
//   res.status(404).render('404'); // views/404.ejs
// });

// Admin registration page (for superadmin only)
router.get('/admins/register', (req, res) => {
  res.render('admin_register', { error: null });
});

module.exports = router;
