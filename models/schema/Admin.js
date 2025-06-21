const mongoose = require('mongoose');
const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  role: { type: String, enum: ['superadmin', 'moderator'], default: 'moderator' },
  isDeleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Admin', AdminSchema);