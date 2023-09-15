import cors from 'cors';
import { Router } from 'express';
import corsOptionForCredentials from '../config/cors';
import * as notificationController from '../controller/notification.controller';

const router = Router();
router.options('', cors(corsOptionForCredentials));

router.get(
  '/all',
  cors(corsOptionForCredentials),
  notificationController.getAllNotifications,
);
// router.get('/count', getNotViewedCount);

export default router;
