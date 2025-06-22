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
    start_time: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/ // "HH:mm" 24-hr format
    },
    end_time: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/
    }
    ,
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

    cancellation_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cancellation',
      default: null
    },

    feedback: {
      comment: { type: String, maxlength: 1000 },
      rating: { type: Number, min: 1, max: 5 }
    },

    isDeleted: {
      type: Boolean,
      default: false
    },

    // Recurring bookings
    recurrence: {
      type: String,
      enum: ['none', 'daily', 'weekly'],
      default: 'none'
    },

    isRefundable: {
      type: Boolean,
      default: true
    },

    cancellation_deadline: {
      type: Date
    },

    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    // Status history log
    status_log: [
      {
        status: { type: String },
        changed_at: { type: Date, default: Date.now },
        changed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
      }
    ]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// 🔒 Index to prevent caretaker double booking
BookingSchema.index(
  { caretaker_id: 1, date: 1, start_time: 1, end_time: 1 },
  { unique: false }
);

// 🔁 Auto-confirm + status_log tracker
BookingSchema.pre('save', function (next) {
  if (this.payment_status === 'paid' && this.status === 'pending') {
    this.status = 'confirmed';
  }

  // Push only if status changed
  if (this.isModified('status')) {
    this.status_log = this.status_log || [];
    this.status_log.push({
      status: this.status,
      changed_at: new Date()
    });
  }

  next();
});

BookingSchema.index({ user_id: 1 });
BookingSchema.index({ caretaker_id: 1 });
BookingSchema.index({ date: 1 });
BookingSchema.index({ isDeleted: 1 });
BookingSchema.index({ status: 1 });

module.exports = mongoose.model('Booking', BookingSchema);
