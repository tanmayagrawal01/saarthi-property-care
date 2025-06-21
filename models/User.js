import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password_hash: { type: String, required: true },
  user_type: { type: String, enum: ['hotel_owner', 'other'], required: true },
  isDeleted: { type: Boolean, default: false }
});

export default mongoose.model('User', UserSchema);
