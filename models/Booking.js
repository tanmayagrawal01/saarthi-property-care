import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  property_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  caretaker_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Caretaker', required: true },
  service_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  feedback: { type: String },
  isDeleted: { type: Boolean, default: false }
});

export default mongoose.model('Booking', BookingSchema);
