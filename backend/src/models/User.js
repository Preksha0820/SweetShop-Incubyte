import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const OrderItemSchema = new mongoose.Schema({
  sweetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sweet', required: true },
  sweetName: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  purchaseDate: { type: Date, default: Date.now }
});

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    orders: [OrderItemSchema] // Add orders array
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', UserSchema);