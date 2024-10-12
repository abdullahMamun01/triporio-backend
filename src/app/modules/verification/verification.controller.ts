import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

import { verificationService } from './verification.service';
import { generateOtp, sendEmail } from './verification.util';

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const email = req.body.email;

  const otp = generateOtp();
  await verificationService.createVerificationModel(email, otp);
  const emailOtpSent = await sendEmail(email, otp);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: {
      otpSent: true,  
      email,          
    },
    success: true,
    message: emailOtpSent,
  });
});

const verifyOtp = catchAsync(async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  const verifyOtp = await verificationService.verifyOtp(otp, email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: verifyOtp,
    success: true,
    message: 'otp verified',
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { email, newPassword } = req.body;
  const verifyOtp = await verificationService.resetPassordToDB(
    email,
    newPassword,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: verifyOtp,
    success: true,
    message: 'otp verified',
  });
});

export const verificationController = {
  forgotPassword,
  verifyOtp,
  resetPassword,
};
