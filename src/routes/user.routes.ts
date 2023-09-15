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

router.options('/all', cors(corsOptionForCredentials));
router.get('/all', cors(corsOptionForCredentials), userController.getAllUser);

router.options('/count', cors(corsOptionForCredentials));
router.get(
  '/count',
  cors(corsOptionForCredentials),
  userController.getDashboardCounts,
);

router.options('/login', cors(corsOptionForCredentials));
router.post('/login', cors(corsOptionForCredentials), userController.login);

router.options('/logout', cors(corsOptionForCredentials));
router.post(
  '/logout',
  cors(corsOptionForCredentials),
  userController.logoutUser,
);

router.options('/register', cors(corsOptionForCredentials));
router.post(
  '/register',
  cors(corsOptionForCredentials),
  userController.register,
);

router.options('/:id', cors(corsOptionForCredentials));
router.delete(
  '/:id',
  cors(corsOptionForCredentials),
  userController.deleteUser,
);

//user password routes
router.options('/forgot-password', cors(corsOptionForCredentials));
router.post(
  '/forgot-password',
  cors(corsOptionForCredentials),
  userController.forgotPassword,
);

router.options('/reset-password/:token', cors());
router.post('/reset-password/:token', cors(), userController.resetPassword);

export default router;
