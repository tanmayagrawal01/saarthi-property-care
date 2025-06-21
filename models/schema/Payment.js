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
    required: true
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
    type: String,
    required: false
  },
  payment_gateway: {
    type: String,
    default: 'Razorpay'
  },
  response_data: {
    type: mongoose.Schema.Types.Mixed  
  },
  createdAt: {
    type: Date,
    default: Date.now
  },

  isDeleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Payment', PaymentSchema);