import { Request, Response } from 'express';
import * as itemServices from '../services/item.services';
import * as logServices from '../services/log.services';
import { IItem, IItemForm } from '../types';

export const itemSearch = async (req: Request, res: Response) => {
  let search = req.query['search'] as string;
  let page = parseInt(req.query['page'] as string) - 1;
  let limit = parseInt(req.query['limit'] as string);
  let sortBy = req.query['sortBy'] as string;
  let type = parseInt(req.query['type'] as string);

  if (!search) search = '';
  if (!page || page < 0) page = 0;
  if (!limit || limit <= 0) limit = 10;

  if (limit > 100) {
    return res.status(500).json({ message: 'Limit cannot exceed 100' });
  }

  const skip = limit * page;
  try {
    const itemList = await itemServices.searchItem(
      search,
      limit,
      skip,
      sortBy,
      type == 1 || type == -1 ? type : 1,
    );

    if (itemList.length === 0) {
      return res.status(200).json({
        message: 'No Items to display',
        data: [],
        page: { previousPage: page === 0 ? undefined : page },
      });
    }

    // as frontend is 1 based page index
    const nextPage = page + 2;

    // previous page is returned as page because for 1 based indexing page is the previous page as page-1 is done
    const previousPage = page === 0 ? undefined : page;

    return res.status(200).json({
      message: 'Items fetched successfully',
      data: itemList,
      page: { nextPage, previousPage },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'something went wrong...' });
  }
};

export const createItem = async (req: Request, res: Response) => {
  const {
    name,
    description,
    working,
    notWorking,
    location,
    category,
    expiry,
    authTokenData,
  } = req.body;

  const userId = authTokenData.id;

  if (!name || !description || !working || !location || !category || !expiry) {
    return res.status(401).json({
      message: 'Please enter all fields',
    });
  }

  try {
    const itemData: IItemForm = {
      name,
      description,
      working,
      notWorking,
      location,
      category,
      expiry,
      updatedAt: new Date(),
    };

    const oldData: IItem = {
      name: '',
      description: '',
      working: 0,
      notWorking: 0,
      location: '',
      category: '',
      expiry: new Date(),
      updatedAt: new Date(),
      createdAt: new Date(),
    };

    await itemServices.createItem(itemData);
    await logServices.add(
      userId,
      oldData,
      { ...itemData, createdAt: new Date() },
      'created',
    );

    return res.status(200).json({ message: 'Item Created Successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'something went wrong...' });
  }
};

export const editItem = async (req: Request, res: Response) => {
  const { notWorking, authTokenData, itemId } = req.body;

  const userId = authTokenData.id;

  try {
    const oldData: IItem | null = await itemServices.getItem(itemId);
    if (!oldData) {
      return res.status(404).json({ message: 'No entry found' });
    }

    const newData = {
      notWorking,

      name: oldData.name,
      description: oldData.description,
      working: oldData.working,
      location: oldData.location,
      category: oldData.category,
      createdAt: oldData.createdAt,
      updatedAt: oldData.updatedAt,
      expiry: oldData.expiry,
    };

    await logServices.add(userId, oldData, newData, 'updated');

    await itemServices.editItem(itemId, newData);

    return res.status(200).json({ message: 'Item Edited Successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'something went wrong...' });
  }
};

export const deleteItem = async (req: Request, res: Response) => {
  const { itemId, authTokenData } = req.body;

  if (!itemId) {
    return res.status(404).json({
      message: 'No such item found',
    });
  }

  const userId = authTokenData.id;

  try {
    const oldData: IItem | null = await itemServices.getItem(itemId);
    if (!oldData) {
      return;
    }

    const newData: IItem = {
      name: '',
      description: '',
      working: 0,
      notWorking: 0,
      location: '',
      category: '',
      expiry: new Date(),
      updatedAt: new Date(),
      createdAt: new Date(),
    };

    await logServices.add(
      userId,
      oldData,
      {
        ...newData,
        createdAt: oldData?.createdAt,
      },
      'deleted',
    );

    await itemServices.deleteItem(itemId);
    return res.status(200).json({ message: 'Item Deleted Successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'something went wrong...' });
  }
};

export const getAllLog = async (req: Request, res: Response) => {
  let page = parseInt(req.query['page'] as string) - 1;
  let limit = parseInt(req.query['limit'] as string);

  if (!page || page < 0) page = 0;
  if (!limit || limit <= 0) limit = 10;

  if (limit > 100) {
    return res.status(500).json({ message: 'Limit cannot exceed 100' });
  }

  const skip = limit * page;
  try {
    const logList = await logServices.searchLogs(limit, skip);

    if (logList.length === 0) {
      return res.status(200).json({
        message: 'No Logs to display',
        data: [],
        page: { previousPage: page === 0 ? undefined : page },
      });
    }

    // as frontend is 1 based page index
    const nextPage = page + 2;

    // previous page is returned as page because for 1 based indexing page is the previous page as page-1 is done
    const previousPage = page === 0 ? undefined : page;

    return res.status(200).json({
      message: 'Logs fetched successfully',
      data: logList,
      page: { nextPage, previousPage },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'something went wrong...' });
  }
};

export const categoryCount = async (req: Request, res: Response) => {
  try {
    const list = await itemServices.getCategoryWiseCount();
    return res.status(200).json({
      message: 'Category wise Count',
      data: list,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'something went wrong...' });
  }
};
