import mongoose from 'mongoose';

const CitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  state: { type: String, required: true }
});

export default mongoose.model('City', CitySchema);
