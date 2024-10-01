import  { Types } from 'mongoose';

export type Payment = {
  user: Types.ObjectId;
  paymentIntentId: string;
  paymentMethod: string ;
  paymentStatus: 'pending' | 'complete' | 'failed' | 'refunded';
  paymentDate: Date;
  amount: number ,
  isProcessed: boolean;
};


export type TStripePaymentService = {
  firstName: string;
  lastName: string
  price: number; 

};





