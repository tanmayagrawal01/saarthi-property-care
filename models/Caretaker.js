import mongoose from 'mongoose';

const CaretakerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  location_city_id: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
  experience_years: { type: Number, default: 0 },
  background_verified: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  isDeleted: { type: Boolean, default: false }
});

export default mongoose.model('Caretaker', CaretakerSchema);
