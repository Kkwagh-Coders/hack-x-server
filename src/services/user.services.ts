import ItemModel from '../model/item.model';
import {
  default as UserModel,
  default as userModel,
} from '../model/user.model';
import { IUser } from '../types';

export const findUser = (email: string) => {
  return UserModel.findOne({ email });
};

export const createUser = (user: IUser) => {
  return UserModel.create(user);
};

export const searchUser = (
  search: string,
  limit: number,
  skip: number,
  sortBy: string,
  type: 1 | -1,
) => {
  return UserModel.aggregate([
    {
      $match: {
        $or: [
          {
            firstName: {
              $regex: new RegExp(search, 'i'),
            },
          },
          {
            middleName: {
              $regex: new RegExp(search, 'i'),
            },
          },
          {
            lastName: {
              $regex: new RegExp(search, 'i'),
            },
          },
          {
            designation: {
              $regex: new RegExp(search, 'i'),
            },
          },
          {
            department: {
              $regex: new RegExp(search, 'i'),
            },
          },
        ],
      },
    },
    {
      $sort: { [sortBy]: type },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ]);
};

export const resetPassword = (email: string, newPassword: string) => {
  return UserModel.findOneAndUpdate({ email }, { password: newPassword });
};

export const getDashboardCardCount = () => {
  return userModel.aggregate([
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        role: '$_id',
        count: 1,
      },
    },
  ]);
};

export const getTotalInventoryCount = () => {
  return ItemModel.aggregate([
    {
      $group: {
        _id: null,
        totalWorking: { $sum: '$working' },
      },
    },
    // {
    //   $project: {
    //     _id: 0,
    //     role: '_id',
    //     count: 1,
    //   },
    // },
  ]);
};

export const deleteUser = (userId: string) => {
  return UserModel.findByIdAndDelete(userId);
};
