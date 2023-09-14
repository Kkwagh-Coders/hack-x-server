import mongoose, { Schema } from 'mongoose';
import { IItem } from '../types';

const itemSchema = new Schema<IItem>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  working: { type: Number, required: true },
  notWorking: { type: Number, required: true },
  location: { type: String, required: true },
  category: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, required: true },
  expiry: { type: Date, required: true },
});

export default mongoose.model<IItem>('Item', itemSchema);
