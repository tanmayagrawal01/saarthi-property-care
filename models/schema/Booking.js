const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
  {
    property_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true
    },
    caretaker_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Caretaker',
      required: true
    },
    service_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending'
    },
    payment_status: {
      type: String,
      enum: ['not_paid', 'paid', 'failed', 'refunded'],
      default: 'not_paid'
    },
    payment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment'
    },
    feedback: {
      comment: {
        type: String,
        maxlength: 1000
      },
      rating: {
        type: Number,
        min: 1,
        max: 5
      }
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
BookingSchema.pre('save', function (next) {
  if (this.payment_status === 'paid' && this.status === 'pending') {
    this.status = 'confirmed';
  }
  next();
});

module.exports = mongoose.model('Booking', BookingSchema);