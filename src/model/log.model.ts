import { Schema } from 'mongoose';
import { ILog } from '../types';

const log = new Schema<ILog>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  oldItem: {
    type: {
      name: String,
      description: String,
      working: Number,
      notWorking: Number,
      location: String,
      category: String,
      createdAt: Date,
      updatedAt: Date,
      expiry: Date,
    },
  },
  newItem: {
    type: {
      name: String,
      description: String,
      working: Number,
      notWorking: Number,
      location: String,
      category: String,
      createdAt: Date,
      updatedAt: Date,
      expiry: Date,
    },
  },
  createdAt: { type: Date, default: Date.now },
  action: { type: String, required: true },
});
