import { Types } from 'mongoose';

export type IUserRole = 'admin' | 'teacher' | 'staff';
export type IActionType = 'created' | 'updated' | 'deleted';

export type IUser = {
  firstName: String;
  middleName: String;
  lastName: String;
  email: String;
  password: String;
  designation: String;
  department: String;
  role: IUserRole;
};

export type IItem = {
  name: String;
  description: String;
  working: number;
  notWorking: number;
  location: String;
  category: String;
  createdAt: Date;
  updatedAt: Date;
  expiry: Date;
};

export type ILog = {
  userId: Types.ObjectId;
  oldItem: IItem;
  newItem: IItem;
  createdAt: Date;
  action: IActionType;
};
