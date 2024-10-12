import express from 'express';
import { validateRequest } from '../../middleware/validateRequest';

import { PaymentController } from './payment.controller';
import { authoRization } from '../../middleware/authoRization';
import {
  stripePaymentServiceSchema,
  stripeSessionSchema,
} from './payment.validation';
import { USER_ROLE } from '../user/user.constants';

const router = express.Router();

router.get(
  '/',
  authoRization(USER_ROLE.admin),
  PaymentController.getAllPeymentList,
);
router.get(
  '/user-payment',
  authoRization(USER_ROLE.user),
  PaymentController.getSinglePaymentList,
);

router.post(
  '/stripe-checkout',
  authoRization('user'),
  validateRequest(stripePaymentServiceSchema),
  PaymentController.createStripeCheckoutSession,
);
router.post(
  '/confirm-payment',
  authoRization('user'),
  validateRequest(stripeSessionSchema),
  PaymentController.confirmPaymentAndVerifiedProfile,
);

export const paymentRoutes = router;
