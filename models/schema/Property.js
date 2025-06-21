const mongoose = require('mongoose');
const PropertySchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  city_id: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  property_type: { type: String, required: true },
  isDeleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Property', PropertySchema);