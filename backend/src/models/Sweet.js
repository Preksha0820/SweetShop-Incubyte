import mongoose from 'mongoose';


const SweetSchema = new mongoose.Schema(
{
name: { type: String, required: true, unique: true },
category: { type: String, required: true },
price: { type: Number, required: true },
quantity: { type: Number, required: true },
imageUrl: { type: String, default: null } 
},
{ timestamps: true }
);


export default mongoose.model('Sweet', SweetSchema);