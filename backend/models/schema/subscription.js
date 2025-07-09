const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Property Owner
        required: true
    },

    plan_duration: {
        type: String,
        required: true,
        enum: ['monthly', 'quarterly', 'yearly']
    },

    plan_tier: {
        type: String,
        required: true,
        enum: ['basic', 'pro', 'business', 'enterprise']
    },

    plan_details: {
        type: mongoose.Schema.Types.Mixed, // Can store JSON like { maxBookingsPerMonth, includedServices: [...] }
        default: {}
    },

    start_date: {
        type: Date,
        required: true
    },

    end_date: {
        type: Date,
        required: true
    },

    status: {
        type: String,
        enum: ['active', 'expired', 'cancelled', 'paused'],
        default: 'active'
    },

    auto_renew: {
        type: Boolean,
        default: true
    },

    is_trial: {
        type: Boolean,
        default: false
    },

    payment_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment'
    },

    // 💸 Discounts
    coupon_code: {
        type: String,
        trim: true
    },

    discount_amount: {
        type: Number,
        min: 0,
        default: 0
    },

    platform_fee: {
        type: Number,
        min: 0,
        default: 0
    },

    total_amount: {
        type: Number,
        min: 0
    },

    // 📊 Usage Metrics
    usage_metrics: {
        bookings_used: { type: Number, default: 0 },
        services_used: { type: Number, default: 0 },
        last_usage_at: { type: Date }
    },

    isDeleted: {
        type: Boolean,
        default: false
    },

    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    },

    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    }

}, {
    timestamps: true
});

SubscriptionSchema.index({ user_id: 1 });
SubscriptionSchema.index({ status: 1 });
SubscriptionSchema.index({ isDeleted: 1 });
SubscriptionSchema.index({ end_date: 1 });

module.exports = mongoose.model('Subscription', SubscriptionSchema);
