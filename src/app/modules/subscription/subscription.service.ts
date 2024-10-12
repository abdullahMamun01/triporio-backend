import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import UserModel from '../user/user.model';
import { TSubscription } from './subscription.type';
import { SubscriptionModel } from './subscription.model';

const saveSubscriptionAfterPayment = async (payload: TSubscription) => {
  const user = await UserModel.findById(payload.user);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'user not found!');
  }
  const alreadySubscribe = await SubscriptionModel.findOne({
    user: payload.user,
  }).lean();
  if (alreadySubscribe?.subscriptionType === payload.subscriptionType) {
    throw new AppError(
      httpStatus.CONFLICT,
      'You already take this subscription!',
    );
  }
  const subscription = await SubscriptionModel.create(payload);
  return subscription;
};



export const subscriptionService = {
  saveSubscriptionAfterPayment,

};
