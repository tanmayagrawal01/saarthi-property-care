const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      set: v => v.toLowerCase()
    },
    address: {
      type: String,
      required: true,
      trim: true
    },
    city_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'City',
      required: true
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    property_type: {
      type: String,
      enum: ['hotel', 'guesthouse', 'airbnb', 'pg', 'villa', 'homestay'],
      required: true
    },
    photos: {
      type: [String], // array of image URLs
      default: []
    },
    description: {
      type: String,
      maxlength: 1000
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
PropertySchema.index({ user_id: 1 });
PropertySchema.index({ city_id: 1 });
module.exports = mongoose.model('Property', PropertySchema);