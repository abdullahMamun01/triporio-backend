import { Types } from 'mongoose';

export type Payment = {
  user: Types.ObjectId;
  paymentIntentId: string;
  paymentMethod: string;
  paymentStatus: 'pending' | 'complete' | 'failed' | 'refunded';
  paymentDate: Date;
  amount: number;
  subscription:Types.ObjectId ,
  isProcessed: boolean;
};

export type TStripePaymentService = {
  firstName: string;
  lastName: string;
  price: number;
};


// type SubscriptionType = 'monthly' | 'yearly';

// type PaymentBody = {
//   profileName: string;
//   subscriptionType: SubscriptionType;
//   price: number;
// }
