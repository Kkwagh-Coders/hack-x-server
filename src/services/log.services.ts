import LogModel from '../model/log.model';
import { IItem } from '../types';

export const add = (
  userId: string,
  oldData: IItem,
  newData: IItem,
  action: string,
) => {
  return LogModel.create({
    userId,
    oldItem: oldData,
    newItem: newData,
    action,
  });
};

export const searchLogs = (limit: number, skip: number) => {
  return LogModel.aggregate([
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);
};
