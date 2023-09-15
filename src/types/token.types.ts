import { Types } from 'mongoose';

export type IAuthToken = {
  id: Types.ObjectId;
  email: string;
};
