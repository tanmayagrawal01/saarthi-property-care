const express = require('express');
const router = express.Router();
const ServiceController = require('../controllers/service.controller');
const auth = require('../auth/auth.middleware');

// Get all active services (public)
router.get('/', ServiceController.getAllActiveServices);

// Get a specific service by ID (public or admin)
router.get('/:id', ServiceController.getServiceById);

// Create a new service (admin only)
router.post(
  '/',
  auth.authenticate,
  auth.verifyAdmin,
  ServiceController.createService
);

// Update an existing service (admin only)
router.patch(
  '/:id',
  auth.authenticate,
  auth.verifyAdmin,
  ServiceController.updateService
);

// Soft delete a service (admin only)
router.delete(
  '/:id',
  auth.authenticate,
  auth.verifyAdmin,
  ServiceController.softDeleteService
);

module.exports = router;
