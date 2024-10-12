import mongoose, { Schema } from 'mongoose';
import { Payment } from './payment.type';

const PaymentSchema = new Schema<Payment>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: { type: Number, required: true },
    paymentIntentId: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['Card', 'card'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'complete', 'failed', 'refunded'],
      required: true,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    isProcessed: {
      type: Boolean,
      default: false,
    },
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
      required: false, // Not every payment is linked to a subscription
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
export const PaymentModel = mongoose.model<Payment>('Payment', PaymentSchema);
