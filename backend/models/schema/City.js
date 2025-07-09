const mongoose = require('mongoose');

const CitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      set: v => v.toLowerCase()
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    pincode: {
      type: String,
      required: true,
      match: /^[1-9][0-9]{5}$/ // Indian 6-digit pincode
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
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

CitySchema.index({ name: 1, state: 1, pincode: 1 }, { unique: true });
CitySchema.index({ isDeleted: 1 });
module.exports = mongoose.model('City', CitySchema);
