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
    trim: true
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
  isDeleted: {
    type: Boolean,
    default: false
  },
  status_log: [
    {
      role: { type: String },
      changed_at: { type: Date, default: Date.now },
      changed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('Admin', AdminSchema);