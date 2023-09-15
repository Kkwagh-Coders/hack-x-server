import UserModel from '../model/user.model';
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
      $skip: skip,
    },
    {
      $limit: limit,
    },
    {
      $sort: { [sortBy]: type },
    },
    {
      $project: {
        name: 1,
        description: 1,
        working: 1,
        notWorking: 1,
        location: 1,
        category: 1,
        createdAt: 1,
        updatedAt: 1,
        expiry: 1,
        _id: 1,
      },
    },
  ]);
};
