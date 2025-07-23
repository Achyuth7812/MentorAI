import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  coins: { type: Number, default: 100 },
  streak: { type: Number, default: 1 },
});

const User = models.User || model('User', UserSchema);
export default User;
