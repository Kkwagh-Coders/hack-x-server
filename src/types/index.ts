import { Types } from 'mongoose';

export type IUserRole = 'admin' | 'teacher' | 'staff';
export type IActionType = 'created' | 'updated' | 'deleted';

export type IUser = {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  password: string;
  designation: string;
  department: string;
  role: IUserRole;
};

export type IItem = {
  name: string;
  description: string;
  working: number;
  notWorking: number;
  location: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
  expiry: Date;
};

export type IItemForm = {
  name: string;
  description: string;
  working: number;
  notWorking: number;
  location: string;
  category: string;
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
