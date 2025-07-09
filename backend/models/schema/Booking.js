const mongoose = require('mongoose');
const slugify = require('slugify');
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
    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // property owner
      required: true
    },

    // Embedded guest info
    guest: {
      name: { type: String, required: true },
      email: { type: String },
      phone: {
        type: String,
        match: /^[6-9]\d{9}$/,
        required: true
      }
    },

    date: {
      type: Date,
      required: true
    },
    start_time: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/ // "HH:mm" 24-hour format
    },
    end_time: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/
    },

    // Optional: Keep if you allow non-subscription payments in future
    // amount: { type: Number, min: 0 },
    // payment_status: {
    //   type: String,
    //   enum: ['not_paid', 'paid', 'failed', 'refunded'],
    //   default: 'not_paid'
    // },
    // payment_id: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Payment'
    // },

    cancellation_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cancellation',
      default: null
    },

    isDeleted: {
      type: Boolean,
      default: false
    },

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

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending'
    },

    status_log: [
      {
        status: { type: String },
        changed_at: { type: Date, default: Date.now },
        changed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
      }
    ],
    
    slug: {
      type: String
    },

    feedback: {
      comment: { type: String, maxlength: 1000 },
      rating: { type: Number, min: 1, max: 5 }
    }

  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// 🔒 Prevent double-booking
BookingSchema.index(
  { caretaker_id: 1, date: 1, start_time: 1, end_time: 1 },
  { unique: false }
);

// 📝 Audit log on status change
BookingSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    this.status_log = this.status_log || [];
    this.status_log.push({
      status: this.status,
      changed_at: new Date()
    });
  }

  if (!this.slug && this.guest?.name && this.date) {
    const datePart = this.date.toISOString().split('T')[0];
    const guestPart = slugify(this.guest.name, { lower: true });
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    this.slug = `${guestPart}-${datePart}-${randomSuffix}`;
  }
  next();
});

BookingSchema.index({ owner_id: 1 });
BookingSchema.index({ caretaker_id: 1 });
BookingSchema.index({ date: 1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ isDeleted: 1 });
BookingSchema.index({ slug: 1 }, { unique: true, sparse: true });
module.exports = mongoose.model('Booking', BookingSchema);
