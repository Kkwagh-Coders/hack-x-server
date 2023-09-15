import cors from 'cors';
import { Router } from 'express';
import corsOptionForCredentials from '../config/cors';
import * as userController from '../controller/user.controller';

const router = Router();

router.options('/status', cors(corsOptionForCredentials));
router.get(
  '/status',
  cors(corsOptionForCredentials),
  userController.getLoginStatus,
);

router.get('/all', cors(corsOptionForCredentials), userController.getAllUser);

router.options('/login', cors(corsOptionForCredentials));
router.post('/login', cors(corsOptionForCredentials), userController.login);

router.options('/register', cors(corsOptionForCredentials));
router.post(
  '/register',
  cors(corsOptionForCredentials),
  userController.register,
);

export default router;
