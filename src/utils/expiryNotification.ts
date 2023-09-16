import cron from 'node-cron';
import { createNotification } from '../controller/notification.controller';
import * as itemServices from '../services/item.services';
import SendAlertMail from '../services/mail/SendAlertMail';
import * as userServices from '../services/user.services';

export const expiryNotification = () => {
  cron.schedule('0 0 * * *', () => {
    console.log(' Starting Expiry Notification Script');
    sendExpiryNotification();
  });
};

export const sendExpiryNotification = async () => {
  try {
    console.log('fetching items....');
    let itemList = await itemServices.getAllItems();
    const today = new Date();

    const dateAfter = new Date();
    dateAfter.setDate(today.getDate() + 7);

    const todayInTime = today.getTime();
    const dateAfterInTime = dateAfter.getTime();

    console.log('filtering expiry....');
    itemList = itemList.filter(
      (item) =>
        new Date(item.expiry).getTime() >= todayInTime &&
        new Date(item.expiry).getTime() <= dateAfterInTime,
    );

    let itemMessage = `Items ${itemList.join(', ')} is near to expiry`;
    await createNotification(`Item ${itemMessage} is near to expiry`, 'expiry');

    const list = await userServices.getAllAdmin();
    const adminList: string[] = list.map((item) => item.email);
    SendAlertMail(adminList, `Item ${itemMessage} is near to expiry`, 'Admin');

    console.log('Script completed successfully');
  } catch (error) {
    console.log(error);
    throw new Error('something went wrong...');
  }
};
