import mongoose, { Schema } from 'mongoose';
import { TSubscription } from './subscription.type';

const SubscriptionSchema = new Schema<TSubscription>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subscriptionType: {
      type: String,
      enum: ['monthly', 'yearly'],
      required: true,
    },
    price : {
      type:Number ,
      required:true
    } ,
    subscriptionStartDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    subscriptionEndDate: {
      type: Date,
      required: true,
    },
    subscriptionStatus: {
      type: String,
      enum: ['active', 'canceled', 'expired'],
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const SubscriptionModel = mongoose.model<TSubscription>(
  'Subscription',
  SubscriptionSchema,
);
