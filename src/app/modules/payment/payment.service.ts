import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import UserModel from '../user/user.model';
import { Payment } from './payment.type';
import { PaymentModel } from './payment.model';

const paymentSaveToDB = async (payload: Payment) => {
  const existingPayment = await PaymentModel.findOne({
    paymentIntentId: payload.paymentIntentId,
  });
  if (existingPayment?.paymentStatus === 'complete') {
    throw new AppError(httpStatus.BAD_REQUEST, 'Payment already processed');
  }
  

  const user = await UserModel.findById(payload.user);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const payment = await PaymentModel.create(payload);
  return payment;
};

const getAllPaymentList = async (query: Record<string, unknown>) => {
  const page = query?.page ? Number(query.page) : 1;
  const limit = query?.limit ? Number(query.limit) : 10;
  const skip = page - 1;
  const paymentList = await PaymentModel.find()
    .skip(skip)
    .limit(limit)
    .populate([
      { path: 'service', select: 'name price' },
      { path: 'user', select: 'name' },
    ])
    .select('-__v ');

  return paymentList;
};

const getUserPaymentList = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  const page = query?.page ? Number(query.page) : 1;
  const limit = query?.limit ? Number(query.limit) : 10;
  const skip = page - 1;
  const singlePayment = await PaymentModel.find({ userId })
    .skip(skip)
    .limit(limit)
    .select('-__v');
  return singlePayment;
};

export const paymentService = {
  paymentSaveToDB,
  getAllPaymentList,
  getUserPaymentList,
};
