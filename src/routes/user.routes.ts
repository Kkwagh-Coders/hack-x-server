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

router.options('/login', cors(corsOptionForCredentials));
router.post('/login', cors(corsOptionForCredentials), userController.login);
