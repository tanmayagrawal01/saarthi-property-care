const express = require('express');
const router = express.Router();
const CityController = require('../controllers/city.controller');
const auth = require('../middlewares/auth.middleware');

// 🌐 Public route to get all cities
router.get('/', CityController.getAllCities);

// 🔐 Protected routes — Only Admin can manage cities
router.use(auth.authenticate, auth.verifyAdmin);

// ➕ Create new city
router.post('/', CityController.createCity);

// ✏️ Update existing city
router.put('/:id', CityController.updateCity);

// ❌ Soft delete a city
router.delete('/:id', CityController.deleteCity);

module.exports = router;
