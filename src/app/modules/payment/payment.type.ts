import mongoose from 'mongoose';

export type Payment = {
  user: mongoose.Types.ObjectId;
  booking?: mongoose.Types.ObjectId;
  service?: mongoose.Types.ObjectId,
  paymentIntentId: string;
  paymentMethod: 'card'  ;
  paymentStatus: 'pending' | 'complete' | 'failed' | 'refunded';
  paymentDate: Date;
  isProcessed: boolean;
};


export type TStripePaymentService = {
  name: string; // Name of the service, e.g., "Car Wash Service"
  description: string; // Description of the service, e.g., "Full exterior and interior car wash"
  price: number; // Price of the service in the smallest currency unit, e.g., 1500 for $15.00
  serviceId: mongoose.Types.ObjectId; // Unique identifier for the service
  slotId: mongoose.Types.ObjectId; // Unique identifier for the slot
  vehicleType: string; // Type of the vehicle
  vehicleBrand: string; // Brand of the vehicle
  manufacturingYear: number; 
  vehicleModel: string; 
  registrationPlate: string; 
};
