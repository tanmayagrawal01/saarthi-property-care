const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  booking_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  caretaker_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Caretaker',
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  status: {
    type: String,
    enum: ['initiated', 'success', 'failed', 'refunded'],
    default: 'initiated'
  },
  method: {
    type: String,
    enum: ['UPI', 'Card', 'Netbanking', 'Wallet', 'COD'],
    default: 'UPI'
  },
  transaction_id: {
    type: String
  },
  payment_gateway: {
    type: String,
    default: 'Razorpay'
  },
  payment_time: {
    type: Date // When payment is marked as 'success'
  },
  response_data: {
    type: mongoose.Schema.Types.Mixed // Full raw response from Razorpay or other PG
  },
  refund_info: {
    amount: { type: Number, min: 0 },
    refunded_at: { type: Date },
    reason: { type: String }
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', PaymentSchema);
