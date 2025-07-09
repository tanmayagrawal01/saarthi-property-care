const express = require('express');
const router = express.Router();
const auth = require('../auth/auth.middleware');
const SubscriptionController = require('../controllers/subscription.controller');

// 🟢 1. Create a new subscription (only Property Owners)
router.post(
  '/',
  auth.authenticate,
  auth.verifyOwner,
  SubscriptionController.createSubscription
);

// 🟢 2. Get logged-in owner's subscriptions
router.get(
  '/my',
  auth.authenticate,
  auth.verifyOwner,
  SubscriptionController.getUserSubscriptions
);

// 🟢 3. Get subscription by ID (owner or admin)
router.get(
  '/:id',
  auth.authenticate,
  SubscriptionController.getSubscriptionById
);

// 🟢 4. Cancel a subscription (owner)
router.patch(
  '/:id/cancel',
  auth.authenticate,
  auth.verifyOwner,
  SubscriptionController.cancelSubscription
);

// 🟢 5. Admin: Get all subscriptions
router.get(
  '/admin/all',
  auth.authenticate,
  auth.verifyAdmin,
  SubscriptionController.getAllSubscriptions
);

// 🟢 6. Admin: Update subscription status (paused, expired, etc.)
router.patch(
  '/:id/status',
  auth.authenticate,
  auth.verifyAdmin,
  SubscriptionController.updateSubscriptionStatus
);

module.exports = router;
