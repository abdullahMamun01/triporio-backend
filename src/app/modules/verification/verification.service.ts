//send to forgot password

import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import UserModel from '../user/user.model';
import { createToken } from '../auth/auth.utils';
import config from '../../config';
import VerficationModel from './verification.model';

import { jwtDecode } from 'jwt-decode';
import {
  TResetPasswordOtpPayload,
  TVerificationDecode,
} from './verification.interface';
import { hashedPassword } from '../user/user.utils';

const createVerificationModel = async (email: string, otp: string) => {
  const findBydEmail = await UserModel.findOne({ email });
  if (!findBydEmail) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This user Do not have any Account!',
    );
  }
  const userId = findBydEmail._id;

  const jwtPayload: TResetPasswordOtpPayload = {
    userId,
    otp,
    email,
  };

  const token = createToken(
    jwtPayload,
    config.verificationTokenSecret as string,
    config.otp_expires_in as string,
  );

  const verifyModel = await VerficationModel.create({
    userId,
    token,
    email,
    sentAt: new Date(),
    expiresAt : Date.now() + 10 * 60 * 1000
  });

  return verifyModel;
};

const verifyOtp = async (otp: string, email: string) => {
  const findBydEmail = await UserModel.findOne({ email });
  if (!findBydEmail) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This user Do not have any Account!',
    );
  }

  const verfyService = await VerficationModel.findOne({
    userId: findBydEmail._id,
  }).sort({ createdAt: -1 });
  if (!verfyService) {
    throw new AppError(httpStatus.FORBIDDEN, 'Invalid otp verify request');
  }

  const token = verfyService?.token;

  const decoded: TVerificationDecode = jwtDecode(token as string);
  console.log(decoded.otp , otp)
  if (decoded.otp !== otp) {
    throw new AppError(httpStatus.FORBIDDEN, 'Incorrect OTP.');
  }
  const currentTime = Math.floor(Date.now() / 1000);
  if (decoded.exp < currentTime) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Your password reset OTP has expired. Please request a new one',
    );
  }

  const verify = await VerficationModel.findOneAndUpdate(
    { email },
    { verified: true },
    { new: true, runValidators: true },
  );
  return {
    otpVerified: verify?.verified,
  };
};

const resetPassordToDB = async (email: string, newPassword: string) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This user Do not have any Account!',
    );
  }

  const isVerifiedOtp = await VerficationModel.findOne({ email });
  if (!isVerifiedOtp) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'No OTP found. Please request again.',
    );
  }
  if (!isVerifiedOtp?.verified) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Please verify your OTP before proceeding.',
    );
  }

  const password = await hashedPassword(newPassword);
  const updatePass = await UserModel.findOneAndUpdate(
    { email },
    { password },
    { runValidators: true, new: true },
  );

  // delete updatePass?.password
  await VerficationModel.findOneAndDelete({ email });
  return updatePass;
};

export const verificationService = {
  createVerificationModel,
  verifyOtp,
  resetPassordToDB,
};
