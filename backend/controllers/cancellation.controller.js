const Cancellation = require('../models/schema/cancellation');
const Booking = require('../models/schema/Booking');
const Payment = require('../models/schema/Payment');
const mongoose = require('mongoose');

// Create a cancellation (by owner, caretaker, or admin)
exports.createCancellation = async (req, res) => {
  try {
    const user = req.user;
    const { booking_id, reason } = req.body;

    if (!booking_id || !reason) {
      return res.status(400).json({ message: 'Booking ID and reason are required.' });
    }

    const booking = await Booking.findById(booking_id);
    if (!booking || booking.isDeleted) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    // Optional: Check if booking already cancelled
    const existingCancellation = await Cancellation.findOne({ booking_id });
    if (existingCancellation) {
      return res.status(409).json({ message: 'Booking has already been cancelled.' });
    }

    // Determine role for cancellation
    const role = user.role === 'owner' ? 'user' : user.role;

    // Optional: Handle refund logic here (dummy logic)
    let refundAmount = 0;
    let refundStatus = 'not_applicable';

    if (booking.isRefundable && booking.status !== 'cancelled') {
      const payment = await Payment.findOne({ booking_id });
      if (payment && payment.status === 'success') {
        refundAmount = payment.amount;
        refundStatus = 'initiated';

        // Optional: Mark refund info inside Payment
        payment.refund_info = {
          amount: refundAmount,
          refunded_at: new Date(),
          reason,
          refund_id: `manual-${Date.now()}`,
          status: 'initiated'
        };
        await payment.save();
      }
    }

    // Create Cancellation record
    const cancellation = new Cancellation({
      booking_id,
      cancelled_by: user._id,
      role,
      reason,
      refund_status: refundStatus,
      refund_amount: refundAmount,
      created_by: user._id
    });

    await cancellation.save();

    // Update Booking status
    booking.status = 'cancelled';
    booking.cancellation_id = cancellation._id;
    await booking.save();

    res.status(201).json({
      message: 'Booking cancelled successfully',
      cancellation
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to cancel booking', error: err.message });
  }
};

// 🔎 Get cancellation by Booking ID
exports.getByBookingId = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const cancellation = await Cancellation.findOne({ booking_id: bookingId, isDeleted: false });

    if (!cancellation) {
      return res.status(404).json({ message: 'No cancellation found for this booking' });
    }

    res.json(cancellation);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cancellation', error: err.message });
  }
};

// 🔎 Get cancellations made by current user
exports.getMyCancellations = async (req, res) => {
  try {
    const userId = req.user._id;
    const cancellations = await Cancellation.find({ cancelled_by: userId, isDeleted: false })
      .sort({ createdAt: -1 });

    res.json(cancellations);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cancellations', error: err.message });
  }
};

// 🛠 Admin: Get all cancellations
exports.getAllCancellations = async (req, res) => {
  try {
    const cancellations = await Cancellation.find({ isDeleted: false })
      .populate('booking_id')
      .populate('cancelled_by')
      .sort({ createdAt: -1 });

    res.json(cancellations);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch cancellations', error: err.message });
  }
};
