import NotificationModel from '../model/notification.model';

export const getAllNewNotifications = async () => {
  const notificationList = await NotificationModel.find();
  await NotificationModel.updateMany({}, { $set: { isViewed: true } });

  return notificationList;
};
