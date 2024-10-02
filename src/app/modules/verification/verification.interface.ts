import { Types } from 'mongoose';

type TVerification = {
  userId: Types.ObjectId;
  email: string;
  token: string;
  sentAt: Date;
  verified?: boolean;
};

export type TResetPasswordOtpPayload = {
  userId: Types.ObjectId;
  otp: string;
  email: string;
};

export interface TVerificationDecode extends TResetPasswordOtpPayload {
  iat: number;
  exp: number;
}

export default TVerification;
