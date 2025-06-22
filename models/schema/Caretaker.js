const mongoose = require('mongoose');

const CaretakerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      match: /^[6-9]\d{9}$/ // Indian phone number validation
    },
    location_city_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'City',
      required: true
    },
    experience_years: {
      type: Number,
      default: 0,
      min: 0
    },

    // Aadhaar verification-related
    aadhaar_number: {
      type: String,
      minlength: 4,
      maxlength: 4,
      required: false // Only store last 4 digits
    },
    aadhaar_image_url: {
      type: String // URL of front image of Aadhaar
    },
    selfie_with_aadhaar_url: {
      type: String // URL of selfie holding Aadhaar card
    },

    // Verification status
    background_verified: {
      type: Boolean,
      default: false
    },
    verification_level: {
      type: String,
      enum: ['none', 'aadhaar_selfie_verified'],
      default: 'none'
    },

    // Ratings and feedback
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },

    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

CaretakerSchema.index({ phone: 1 }, { unique: true });
CaretakerSchema.index({ location_city_id: 1 });
CaretakerSchema.index({ is_available: 1 });
CaretakerSchema.index({ background_verified: 1 });

module.exports = mongoose.model('Caretaker', CaretakerSchema);
