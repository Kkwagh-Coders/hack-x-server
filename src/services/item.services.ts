import ItemModel from '../model/item.model';
import { IItemForm } from '../types';

export const searchItem = (
  search: string,
  limit: number,
  skip: number,
  sortBy: string,
  type: 1 | -1,
) => {
  return ItemModel.aggregate([
    {
      $match: {
        $or: [
          {
            name: {
              $regex: new RegExp(search, 'i'),
            },
          },
          {
            description: {
              $regex: new RegExp(search, 'i'),
            },
          },
          {
            location: {
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

export const createItem = (itemData: IItemForm) => {
  return ItemModel.create(itemData);
};

export const editItem = (itemId: string, itemData: IItemForm) => {
  const filter = { _id: itemId };
  return ItemModel.findByIdAndUpdate(filter, itemData);
};

export const deleteItem = (itemId: string) => {
  return ItemModel.deleteOne({ _id: itemId });
};

export const getItem = (itemId: string) => {
  return ItemModel.findOne({ _id: itemId });
};

export const getCategoryWiseCount = () => {
  return ItemModel.aggregate([
    {
      $group: {
        _id: '$category',
        value: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        name: '$_id',
        value: 1,
      },
    },
  ]);
};

export const getAllItems = () => {
  return ItemModel.find();
};
