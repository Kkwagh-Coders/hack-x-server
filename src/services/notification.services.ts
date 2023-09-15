import NotificationModel from '../model/notification.model';

export const getAllNewNotifications = async () => {
  const notificationList = await NotificationModel.find();
  await NotificationModel.updateMany({}, { $set: { isViewed: true } });

  return notificationList;
};

export const addNotification = (text: string, type: string) => {
  return NotificationModel.create({ text, type, isViewed: false });
};

export const getNewNotificationCount = () => {
  return NotificationModel.countDocuments({ isViewed: false });
};
