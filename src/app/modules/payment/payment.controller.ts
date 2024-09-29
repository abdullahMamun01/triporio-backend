import httpStatus from 'http-status';
import config from '../../config';
import { catchAsync } from '../../utils/catchAsync';
import stripe from '../../utils/stripe';
import { Payment, TStripePaymentService } from './payment.type';
import { Request, Response } from 'express';
import AppError from '../../error/AppError';
import Stripe from 'stripe';
import sendResponse from '../../utils/sendResponse';
import { parseStripeMetaData } from './payment.utils';
import { BookingService } from '../booking/booking.service';
import { convertToTBooking } from '../booking/booking.utils';
import { paymentService } from './payment.service';
import { SlotModel } from '../slot/slot.model';

const Logo = `https://img.freepik.com/free-vector/flat-car-wash-logo-template_52683-102704.jpg?t=st=1725300504~exp=1725301104~hmac=a9efe7c60cf3dd1ac4da7acb3c8400df6a638431cb94067561c16fb5246ae41a`;
const createStripeCheckoutSession = catchAsync(
  async (req: Request, res: Response) => {
    const {
      name,
      price,
      slotId,
      serviceId,
      vehicleType,
      vehicleBrand,
      manufacturingYear,
      vehicleModel,
      registrationPlate,
    }: TStripePaymentService = req.body;

    const slot = await SlotModel.findById(slotId);
    if (slot?.isBooked === 'booked') {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'the slot you request that already booked!',
      );
    }

    const stripeMetadata = JSON.stringify({
      slotId,
      serviceId,
      vehicleType,
      vehicleBrand,
      manufacturingYear,
      vehicleModel,
      registrationPlate,
    });
    const priceInCents = price * 100;
    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      submit_type: 'auto',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: name,
              images: [Logo],
            },
            unit_amount: priceInCents, // Use rounded integer value
          },
          quantity: 1,
        },
      ],
      success_url: `${config.client_public_domain}/payment/success?payment_status=succeeded&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.client_public_domain}/payment/failed?payment_status=false`,
      metadata: {
        details: stripeMetadata,
      },
    });

    // Send the response with the session details
    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      message: 'Stripe payment session created successfully',
      data: {
        sessionId: session.id,
        sessionUrl: session.url, // Use session.url instead of session.success_url
      },
    });
  },
);

const confirmPaymentAndBooked = catchAsync(
  async (req: Request, res: Response) => {
    const { session_id } = req.body;
    const userId = req.user.userId;
    const checkoutSession = await stripe.checkout.sessions.retrieve(
      session_id,
      {
        expand: ['line_items', 'payment_intent'],
      },
    );
    if (!checkoutSession) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'session id not found or expired',
      );
    }
    if (checkoutSession.status !== 'complete') {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Please confirm the payment first!',
      );
    }

    const payment_intent =
      checkoutSession.payment_intent as Stripe.PaymentIntent;
    const line_items = checkoutSession.line_items;

    if (!payment_intent || !line_items) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid session_id');
    }
    const parseMetaData = await parseStripeMetaData(checkoutSession.metadata);
    const bookingPayload = convertToTBooking(parseMetaData, userId);
    const booking = await BookingService.bookSlotIntoDB(bookingPayload);

    const paymentPayload: Payment = {
      user: userId,
      booking: booking?._id,
      service: booking?.service,
      paymentIntentId: payment_intent.id,
      paymentMethod: checkoutSession.payment_method_types[0] as 'card',
      paymentStatus: checkoutSession.status,
      paymentDate: new Date(Date.now()),
      isProcessed: checkoutSession.status === 'complete',
    };
    const payment = await paymentService.paymentSaveToDB(paymentPayload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      data: {
        paymentInfo: payment,
        bookingInfo: booking,
      },
      message: 'Slot Booking  successfully',
    });
  },
);

const getAllPeymentList = catchAsync(async (req: Request, res: Response) => {
  const paymentList = await paymentService.getAllPaymentList(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: paymentList,
    message: 'Slot Booking  successfully',
  });
});

const getSinglePaymentList = catchAsync(async (req: Request, res: Response) => {
  const paymentList = await paymentService.getUserPaymentList(
    req.user.userId,
    req.query,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: paymentList,
    message: 'Slot Booking  successfully',
  });
});

export const PaymentController = {
  createStripeCheckoutSession,
  confirmPaymentAndBooked,
  getAllPeymentList,
  getSinglePaymentList,
};
