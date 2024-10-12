import { Types } from 'mongoose';

export type TSubscription = {
  user: Types.ObjectId;
  subscriptionType: 'monthly' | 'yearly';
  subscriptionStartDate: Date;
  subscriptionEndDate: Date;
  price: number;

  subscriptionStatus: 'active' | 'canceled' | 'expired';
};
