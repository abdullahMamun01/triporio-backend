import { z } from 'zod';

export const stripePaymentServiceSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'), // Name must be a non-empty string
    description: z.string().min(1, 'Description is required'), // Description must be a non-empty string
    price: z.number().int().positive('Price must be a positive integer'), // Price must be a positive integer
    serviceId: z.string({ required_error: 'Service ID is required!' }), // Service ID must be a string
    slotId: z.string({ required_error: 'Slot ID is required!' }), // Slot ID must be a string
    vehicleType: z.string().min(1, 'Vehicle type is required'), // Vehicle type must be a non-empty string
    vehicleBrand: z.string().min(1, 'Vehicle brand is required'), // Vehicle brand must be a non-empty string
    manufacturingYear: z
      .number()
      .int()
      .min(1886, 'Manufacturing year must be after the invention of the car')
      .max(
        new Date().getFullYear(),
        'Manufacturing year cannot be in the future',
      ), // Validating car manufacturing year
    vehicleModel: z.string().min(1, 'Vehicle model is required'), // Vehicle model must be a non-empty string
    registrationPlate: z.string().min(1, 'Registration plate is required'), // Registration plate must be a non-empty string
  }),
});

export const stripeSessionSchema = z.object({
  body: z.object({
    session_id: z.string().min(1, 'Session ID is required'), // Ensures the session_id is a non-empty string
  }),
});
