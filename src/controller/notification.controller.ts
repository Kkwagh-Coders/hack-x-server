import { Request, Response } from 'express';
import * as notificationServices from '../services/notification.services';

export const getAllNotifications = async (req: Request, res: Response) => {
  try {
    const notificationList =
      await notificationServices.getAllNewNotifications();

    return res
      .status(200)
      .json({ message: 'Notification List', data: notificationList });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'something went wrong...' });
  }
};

export const createNotificationHelper = async (req: Request, res: Response) => {
  try {
    await createNotification('Dell Monitor new Expiry', 'Expiry');

    return res.status(200).json({ message: 'Notification added' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'something went wrong...' });
  }
};

export const getNewNotificationCount = async (req: Request, res: Response) => {
  try {
    const notificationCount =
      await notificationServices.getNewNotificationCount();
    return res
      .status(200)
      .json({ message: 'Notification Count', data: notificationCount });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'something went wrong...' });
  }
};
export const createNotification = (text: string, type: string) => {
  // add into db
  return notificationServices.addNotification(text, type);

  // TODO send the notification
};
