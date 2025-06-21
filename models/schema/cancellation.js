const mongoose = require('mongoose');

const CancellationSchema = new mongoose.Schema({
  booking_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  cancelled_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Could also be admin or caretaker
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'caretaker'],
    required: true
  },
  reason: {
    type: String,
    required: true,
    maxlength: 500
  },
  refund_status: {
    type: String,
    enum: ['not_applicable', 'initiated', 'completed', 'failed'],
    default: 'not_applicable'
  },
  refund_amount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Cancellation', CancellationSchema);
