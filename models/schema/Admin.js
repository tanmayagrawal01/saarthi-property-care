const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
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
    trim: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // basic email validation
  },
  password_hash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['superadmin', 'moderator'],
    default: 'moderator'
  },
  profile_photo_url: {
    type: String
  },

  last_login_at: {
    type: Date
  },
  login_attempts: {
    type: Number,
    default: 0
  },

  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },

  status_log: [
    {
      role: {
        type: String,
        enum: ['superadmin', 'moderator']
      },
      changed_at: {
        type: Date,
        default: Date.now
      },
      changed_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
      }
    }
  ],

  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

AdminSchema.index({ role: 1 });

module.exports = mongoose.model('Admin', AdminSchema);
