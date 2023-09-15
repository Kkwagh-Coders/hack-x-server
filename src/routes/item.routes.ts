import cors from 'cors';
import { Router } from 'express';
import corsOptionForCredentials from '../config/cors';
import * as itemController from '../controller/item.controller';
import isUserAuth from '../middleware/middleware';

const router = Router();

router.options('', cors(corsOptionForCredentials));

router.get('', cors(corsOptionForCredentials), itemController.itemSearch);

router.get(
  '/count',
  cors(corsOptionForCredentials),
  itemController.categoryCount,
);

router.post(
  '',
  cors(corsOptionForCredentials),
  isUserAuth,
  itemController.createItem,
);

router.put(
  '',
  cors(corsOptionForCredentials),
  isUserAuth,
  itemController.editItem,
);
router.delete(
  '',
  cors(corsOptionForCredentials),
  isUserAuth,
  itemController.deleteItem,
);

router.get('/logs', cors(corsOptionForCredentials), itemController.getAllLog);

export default router;
