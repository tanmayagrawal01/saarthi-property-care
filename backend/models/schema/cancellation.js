const mongoose = require('mongoose');
const slugify = require('slugify');
const CancellationSchema = new mongoose.Schema({
    booking_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },
    cancelled_by: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'role',
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
    refunded_at: {
        type: Date
    },
    refund_id: {
        type: String // Optional: Razorpay refund ID, etc.
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    slug: {
        type: String,
        unique: true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    },

    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    }
},
    {
        timestamps: true
    }
);


CancellationSchema.pre('save', function (next) {
  if (!this.slug && this.booking_id && this.role) {
    const rolePart = slugify(this.role, { lower: true });
    const timePart = Date.now().toString().slice(-5); // last 5 digits for uniqueness
    this.slug = `${rolePart}-cancel-${timePart}`;
  }
  next();
});


CancellationSchema.index({ booking_id: 1 });
CancellationSchema.index({ cancelled_by: 1 });
CancellationSchema.index({ refund_status: 1 });
CancellationSchema.index({ isDeleted: 1 });

module.exports = mongoose.model('Cancellation', CancellationSchema);
