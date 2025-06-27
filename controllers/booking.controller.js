const Booking = require('../models/schema/Booking');
const Property = require('../models/schema/Property');
const mongoose = require('mongoose');

// Create new booking
exports.createBooking = async (req, res) => {
  try {
    const { property_id, caretaker_id, service_id, guest, date, start_time, end_time } = req.body;
    const owner_id = req.user._id;

    if (!property_id || !caretaker_id || !service_id || !guest || !date || !start_time || !end_time) {
      return res.status(400).json({ message: 'Missing required booking fields' });
    }

    // Conflict detection (double booking)
    const conflict = await Booking.findOne({
      caretaker_id,
      date,
      isDeleted: false,
      $or: [
        {
          start_time: { $lt: end_time },
          end_time: { $gt: start_time }
        }
      ]
    });

    if (conflict) {
      return res.status(409).json({ message: 'Caretaker already booked for that time' });
    }

    const newBooking = new Booking({
      property_id,
      caretaker_id,
      service_id,
      owner_id,
      guest,
      date,
      start_time,
      end_time,
      created_by: owner_id
    });

    await newBooking.save();
    res.status(201).json({ message: 'Booking created', booking: newBooking });

  } catch (err) {
    res.status(500).json({ message: 'Booking creation failed', error: err.message });
  }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('property_id')
      .populate('caretaker_id')
      .populate('service_id');

    if (!booking || booking.isDeleted) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get booking', error: err.message });
  }
};

// Owner: Get all bookings
exports.getOwnerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      owner_id: req.user._id,
      isDeleted: false
    }).sort({ date: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bookings', error: err.message });
  }
};

// Caretaker: Get assigned bookings
exports.getCaretakerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      caretaker_id: req.user._id,
      isDeleted: false
    }).sort({ date: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bookings', error: err.message });
  }
};

// Owner cancels a booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking || booking.isDeleted) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (String(booking.owner_id) !== String(req.user._id)) {
      return res.status(403).json({ message: 'You are not allowed to cancel this booking' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    booking.status = 'cancelled';
    booking.updated_by = req.user._id;
    booking.status_log.push({
      status: 'cancelled',
      changed_by: req.user._id
    });

    await booking.save();
    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (err) {
    res.status(500).json({ message: 'Cancellation failed', error: err.message });
  }
};

// Admin updates booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking || booking.isDeleted) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    booking.updated_by = req.user._id;
    booking.status_log.push({
      status,
      changed_by: req.user._id
    });

    await booking.save();
    res.json({ message: 'Booking status updated', booking });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update status', error: err.message });
  }
};

// Submit guest feedback (by property owner)
exports.submitFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking || booking.isDeleted) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (String(booking.owner_id) !== String(req.user._id)) {
      return res.status(403).json({ message: 'You cannot submit feedback for this booking' });
    }

    booking.feedback = {
      rating,
      comment
    };
    booking.updated_by = req.user._id;

    await booking.save();
    res.json({ message: 'Feedback submitted', booking });
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit feedback', error: err.message });
  }
};

// Soft delete booking (admin only)
exports.softDeleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking || booking.isDeleted) {
      return res.status(404).json({ message: 'Booking not found or already deleted' });
    }

    booking.isDeleted = true;
    booking.updated_by = req.user._id;

    await booking.save();
    res.json({ message: 'Booking deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete booking', error: err.message });
  }
};
