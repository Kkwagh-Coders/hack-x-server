import UserModel from '../model/user.model';
import { IUser } from '../types';

export const findUser = (email: string) => {
  return UserModel.findOne({ email });
};

export const createUser = (user: IUser) => {
  return UserModel.create(user);
};
