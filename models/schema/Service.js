const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    maxlength: 1000
  },
  duration: {
    type: Number, // in hours
    default: 1,
    min: 0.5
  },
  category: {
    type: String,
    enum: ['cleaning', 'maintenance', 'guest_support', 'custom'],
    default: 'cleaning'
  },
  icon_url: {
    type: String
  },
  active: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Service', ServiceSchema);
