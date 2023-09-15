import mongoose, { Schema } from 'mongoose';
import { INotification } from '../types';

const notificationSchema = new Schema<INotification>({
  isViewed: { type: Boolean, default: false },
  text: { type: String, required: true },
  type: { type: String, required: true },
});

export default mongoose.model<INotification>(
  'Notification',
  notificationSchema,
);
