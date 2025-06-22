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
  type: String,
  trim: true,
  unique: true, // optional but recommended
  sparse: true  // useful if some payments (like COD) may not have it
},
  isCOD: {
    type: Boolean,
    default: false
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
  reason: { type: String },
  refund_id: { type: String }, // from Razorpay or PG
  status: { type: String, enum: ['initiated', 'processed', 'failed'] }
}
,
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

PaymentSchema.index({ booking_id: 1 });
PaymentSchema.index({ caretaker_id: 1 });
PaymentSchema.index({ user_id: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Payment', PaymentSchema);
