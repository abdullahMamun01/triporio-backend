import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import UserModel from '../user/user.model';
import { Payment } from './payment.type';
import { PaymentModel } from './payment.mode';

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

// const confirmPaymentToDB = async (
//   bookingPayload: TBooking,
//   paymentPayload: Payment,
// ) => {
//   // Start a session
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const booking = await BookingService.bookSlotIntoDB(bookingPayload);
//     const payment = await paymentSaveToDB(paymentPayload) ;
//     // Commit the transaction if both operations succeed
//     await session.commitTransaction();
//     session.endSession();

//     // return { success: true, booking: booking[0], payment: payment[0] };
//   } catch (error) {
//     // Abort the transaction in case of error
//     await session.abortTransaction();
//     session.endSession();

//     // Handle or log the error

//     return { success: false, error: error.message };
//   }
// };

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
