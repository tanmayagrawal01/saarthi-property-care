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
  slug: {
    type: String,
    unique: true
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

// Auto-generate slug from name
ServiceSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
  }
  next();
});

ServiceSchema.index({ name: 1 });
ServiceSchema.index({ active: 1 });
module.exports = mongoose.model('Service', ServiceSchema);
