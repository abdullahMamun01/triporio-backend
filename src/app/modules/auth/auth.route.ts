import express from 'express';

import { authController } from './auth.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { loginValidationSchema } from './auth.validation';
import verifyRoutes from '../verification/verification.route';

const router = express.Router();

router.post(
  '/login',
  validateRequest(loginValidationSchema),
  authController.login,
);

router.use('/', verifyRoutes);
export const authRoutes = router;
