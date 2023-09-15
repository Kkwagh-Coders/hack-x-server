import { Request, Response } from 'express';
import * as itemServices from '../services/item.services';
import { IItemForm } from '../types';

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
  const { name, description, working, notWorking, location, category, expiry } =
    req.body;

  if (
    !name ||
    !description ||
    !working ||
    !notWorking ||
    !location ||
    !category ||
    !expiry
  ) {
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

    await itemServices.createItem(itemData);

    return res.status(200).json({ message: 'Item Created Successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'something went wrong...' });
  }
};

export const editItem = async (req: Request, res: Response) => {
  const {
    name,
    description,
    working,
    notWorking,
    location,
    category,
    expiry,
    itemId,
  } = req.body;

  if (
    !name ||
    !description ||
    !working ||
    !notWorking ||
    !location ||
    !category ||
    !expiry ||
    !itemId
  ) {
    return res.status(401).json({
      message: 'Please enter all fields',
    });
  }
  try {
    // TODO : add data into log table
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
    await itemServices.editItem(itemId, itemData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'something went wrong...' });
  }
};
