const Subscription = require('../models/schema/subscription');
const mongoose = require('mongoose');

// Create new subscription
exports.createSubscription = async (req, res) => {
  try {
    const {
      plan_duration,
      plan_tier,
      plan_details,
      start_date,
      end_date,
      auto_renew,
      is_trial,
      coupon_code,
      discount_amount,
      platform_fee,
      total_amount,
      payment_id
    } = req.body;

    if (!plan_duration || !plan_tier || !start_date || !end_date) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const subscription = new Subscription({
      user_id: req.user._id,
      plan_duration,
      plan_tier,
      plan_details,
      start_date,
      end_date,
      auto_renew,
      is_trial,
      coupon_code,
      discount_amount,
      platform_fee,
      total_amount,
      payment_id,
      created_by: req.user._id
    });

    await subscription.save();
    res.status(201).json({ message: 'Subscription created', subscription });

  } catch (err) {
    res.status(500).json({ message: 'Failed to create subscription', error: err.message });
  }
};

// Get current user's subscriptions
exports.getUserSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({
      user_id: req.user._id,
      isDeleted: false
    }).sort({ createdAt: -1 });

    res.json(subscriptions);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get subscriptions', error: err.message });
  }
};

// Get subscription by ID (owner or admin)
exports.getSubscriptionById = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription || subscription.isDeleted) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    // Only allow owner of the subscription or admin to view it
    if (
      req.user.user_type === 'property_owner' &&
      !subscription.user_id.equals(req.user._id)
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(subscription);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch subscription', error: err.message });
  }
};

// Cancel a subscription (owner)
exports.cancelSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription || subscription.isDeleted) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    if (!subscription.user_id.equals(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    subscription.status = 'cancelled';
    subscription.auto_renew = false;
    subscription.updated_by = req.user._id;
    await subscription.save();

    res.json({ message: 'Subscription cancelled successfully', subscription });
  } catch (err) {
    res.status(500).json({ message: 'Failed to cancel subscription', error: err.message });
  }
};

// ✅ 5. Admin: Get all subscriptions
exports.getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ isDeleted: false })
      .populate('user_id', 'name email')
      .sort({ createdAt: -1 });

    res.json(subscriptions);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch subscriptions', error: err.message });
  }
};

// ✅ 6. Admin: Update subscription status
exports.updateSubscriptionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['active', 'paused', 'cancelled', 'expired'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const subscription = await Subscription.findById(req.params.id);
    if (!subscription || subscription.isDeleted) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    subscription.status = status;
    subscription.updated_by = req.user._id;
    await subscription.save();

    res.json({ message: 'Subscription status updated', subscription });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update subscription', error: err.message });
  }
};
