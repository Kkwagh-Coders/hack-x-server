import { Types } from 'mongoose';

export type IAuthToken = {
  id: Types.ObjectId;
  email: string;
  role: string;
};

export interface IEmailVerificationToken {
  id: Types.ObjectId;
  email: string;
}

export interface IForgotPasswordToken {
  id: Types.ObjectId;
  email: string;
}
