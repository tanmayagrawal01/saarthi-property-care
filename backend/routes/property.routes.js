const express = require('express');
const router = express.Router();
const PropertyController = require('../controllers/property.controller');
const auth = require('../auth/auth.middleware');

// All routes below require authentication
router.use(auth.authenticate);

// Create property (Only Property Owner)
router.post('/', auth.verifyOwner, PropertyController.createProperty);

// Update property
router.put('/:id', auth.verifyOwner, PropertyController.updateProperty);

// Soft delete property
router.delete('/:id', auth.verifyOwner, PropertyController.deleteProperty);

// Get all properties owned by current user
router.get('/user/all', auth.verifyOwner, PropertyController.getPropertiesByUser);

// Get all properties by city
router.get('/city/:cityId', PropertyController.getPropertiesByCity);

// Get all active properties (admin/dashboard)
router.get('/admin/all', auth.verifyAdmin, PropertyController.getAllProperties);

// 🟢 Moved this to the bottom
router.get('/:id', PropertyController.getPropertyById);

module.exports = router;
