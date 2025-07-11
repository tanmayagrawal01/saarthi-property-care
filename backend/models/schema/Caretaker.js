const mongoose = require('mongoose');
const slugify = require('slugify');

const CaretakerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      match: /^[6-9]\d{9}$/ // Indian phone number validation
    },

    password_hash: {
      type: String,
      required: true
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
    profilepicture_url: {
      type: String,
      default: "https://www.pngmart.com/files/23/Profile-PNG-Photo.png"
    },
    // Aadhaar verification-related
    aadhaar_number: {
      type: String,
      minlength: 4,
      maxlength: 4,
      required: false // Only store last 4 digits
    },
    aadhaar_image_url: {
      type: String,// URL of front image of Aadhaar
      default: "https://th.bing.com/th/id/OIP.3U017h9GAnFM3aRkV-WLiwHaHa?w=191&h=190&c=7&r=0&o=7&pid=1.7&rm=3",
      set: (v) => v === "" ? "https://th.bing.com/th/id/OIP.3U017h9GAnFM3aRkV-WLiwHaHa?w=191&h=190&c=7&r=0&o=7&pid=1.7&rm=3" : v
    },
    selfie_with_aadhaar_url: {
      type: String,// URL of selfie holding Aadhaar card
      required: true
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

    otp_code: {
      type: String
    },
    otp_expiry: {
      type: Date
    },
    last_login: {
      type: Date
    },

    // Ratings and feedback
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },

    is_available: {
      type: Boolean,
      default: true
    },

    completed_bookings: {
      type: Number,
      default: 0
    },
    slug: {
      type: String,
      unique: true
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

CaretakerSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    const baseSlug = slugify(this.name, { lower: true });
    this.slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
  }
  next();
});

CaretakerSchema.index({ phone: 1 }, { unique: true });
CaretakerSchema.index({ location_city_id: 1 });
CaretakerSchema.index({ is_available: 1 });
CaretakerSchema.index({ background_verified: 1 });
CaretakerSchema.index({ isDeleted: 1 });

module.exports = mongoose.model('Caretaker', CaretakerSchema);
