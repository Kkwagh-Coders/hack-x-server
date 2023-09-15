import { Request, Response } from 'express';
import * as notificationServices from '../services/notification.services';

export const getAllNotifications = (re: Request, res: Response) => {
  try {
    const notificationList = notificationServices.getAllNewNotifications();

    return res
      .status(200)
      .json({ message: 'Notification List', data: notificationList });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'something went wrong...' });
  }
};
