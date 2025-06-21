const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      match: /^[6-9]\d{9}$/ 
    },
    password_hash: {
      type: String,
      required: true
    },

    user_type: {
      type: String,
      enum: ['property_owner', 'admin', 'caretaker'],
      default: 'property_owner',
      required: true
    },

    profile_photo_url: {
      type: String
    },

    email_verified: {
      type: Boolean,
      default: false
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

    status: {
      type: String,
      enum: ['active', 'blocked'],
      default: 'active'
    },

    address: {
      type: String
    },

    city_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'City'
    },

    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true // adds createdAt and updatedAt
  }
);

module.exports = mongoose.model('User', UserSchema);
