



import express from 'express';
import { validateRequest } from '../../middleware/validateRequest';

import { verificationController } from './verification.controller';
import { verifiationEamilSchema, verificationOtpSchema,resetPasswordSchema } from './verification.validation';


const verifyRoutes = express.Router();



verifyRoutes.post(
  '/forgot-password',
  validateRequest(verifiationEamilSchema),

  verificationController.forgotPassword,
);
verifyRoutes.post(
  '/verify-otp',
  validateRequest(verificationOtpSchema),

  verificationController.verifyOtp,
);
verifyRoutes.post(
  '/reset-password',
  validateRequest(resetPasswordSchema),

  verificationController.resetPassword,
);

export default verifyRoutes
