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
    type: String,
    default: "https://th.bing.com/th/id/OIP.3U017h9GAnFM3aRkV-WLiwHaHa?w=191&h=190&c=7&r=0&o=7&pid=1.7&rm=3",
    set: (v) => v === "" ? "https://th.bing.com/th/id/OIP.3U017h9GAnFM3aRkV-WLiwHaHa?w=191&h=190&c=7&r=0&o=7&pid=1.7&rm=3" :v
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
AdminSchema.index({ isDeleted: 1 });

module.exports = mongoose.model('Admin', AdminSchema);
