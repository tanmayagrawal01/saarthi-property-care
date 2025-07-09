const Payment = require('../models/schema/Payment');
const Booking = require('../models/schema/Booking'); // Optional if booking validation is needed
const mongoose = require('mongoose');

// Create a new payment
exports.createPayment = async (req, res, next) => {
  try {
    const {
      booking_id,
      caretaker_id,
      subscription_id,
      amount,
      coupon_code,
      discount_amount,
      method,
      isCOD,
      transaction_id,
      payment_gateway,
      platform_fee,
      caretaker_earning,
      response_data
    } = req.body;

    if (!booking_id || !caretaker_id || !amount || !method) {
      return res.status(400).json({ message: 'Required fields are missing.' });
    }

    const status = isCOD ? 'initiated' : 'success';

    const payment = new Payment({
      booking_id,
      caretaker_id,
      subscription_id,
      user_id: req.user._id,
      amount,
      coupon_code,
      discount_amount,
      method,
      isCOD,
      transaction_id,
      payment_gateway,
      status,
      payment_time: status === 'success' ? new Date() : null,
      response_data,
      platform_fee,
      caretaker_earning,
      created_by: req.user._id
    });

    await payment.save();
    res.status(201).json(payment);
  } catch (err) {
    next(err);
  }
};

// Get a payment by ID
exports.getPaymentById = async (req, res, next) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.id,
      isDeleted: false
    }).populate('booking_id caretaker_id user_id subscription_id');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json(payment);
  } catch (err) {
    next(err);
  }
};

// Get all payments for the logged-in owner
exports.getUserPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({
      user_id: req.user._id,
      isDeleted: false
    }).sort({ createdAt: -1 });

    res.json(payments);
  } catch (err) {
    next(err);
  }
};

// Get all payments for the logged-in caretaker
exports.getCaretakerPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({
      caretaker_id: req.user._id,
      isDeleted: false
    }).sort({ createdAt: -1 });

    res.json(payments);
  } catch (err) {
    next(err);
  }
};

// Admin: Get all payments
exports.getAllPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ isDeleted: false })
      .populate('user_id booking_id caretaker_id')
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (err) {
    next(err);
  }
};

// Admin: Process refund
exports.processRefund = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const payment = await Payment.findOne({
      _id: req.params.id,
      isDeleted: false
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.status === 'refunded') {
      return res.status(400).json({ message: 'Already refunded' });
    }

    payment.status = 'refunded';
    payment.refund_info = {
      amount: payment.amount,
      refunded_at: new Date(),
      reason: reason || 'Manual refund by admin',
      refund_id: `manual-${Date.now()}`, // for Razorpay, you'd put the real one
      status: 'processed'
    };
    payment.updated_by = req.user._id;

    await payment.save();

    res.json({ message: 'Refund processed successfully', payment });
  } catch (err) {
    next(err);
  }
};
