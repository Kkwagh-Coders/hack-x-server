import { Schema } from 'mongoose';
import { ILog } from '../types';

const log = new Schema<ILog>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  //TODO oldItem: IItem;
  //TODO newItem: IItem;
  createdAt: { type: Date, default: Date.now },
  action: { type: String, required: true },
});
