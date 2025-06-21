import mongoose from 'mongoose';

const CitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String , required: true},
  isDeleted: { type: Boolean, default: false }
});

export default mongoose.model('City', CitySchema);
