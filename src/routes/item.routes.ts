import cors from 'cors';
import { Router } from 'express';
import corsOptionForCredentials from '../config/cors';
import * as itemController from '../controller/item.controller';

const router = Router();

router.options('', cors(corsOptionForCredentials));
router.get('', cors(corsOptionForCredentials), itemController.itemSearch);
router.post('', cors(corsOptionForCredentials), itemController.createItem);
router.put('', cors(corsOptionForCredentials), itemController.editItem);
router.delete('', cors(corsOptionForCredentials), itemController.deleteItem);

export default router;
