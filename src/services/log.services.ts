import LogModel from '../model/log.model';
import { IItem, ILogDisplay } from '../types';

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
  return LogModel.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate<ILogDisplay>({ path: 'userId', select: '-password' });
};
