import httpStatus from 'http-status';
import config from '../../config';
import { catchAsync } from '../../utils/catchAsync';
import stripe from '../../utils/stripe';

import { Request, Response } from 'express';
import AppError from '../../error/AppError';
import Stripe from 'stripe';
import sendResponse from '../../utils/sendResponse';
import { parseStripeMetaData } from './payment.utils';

import { paymentService } from './payment.service';
import { userService } from '../user/user.service';
import { Types } from 'mongoose';



const createStripeCheckoutSession = catchAsync(
  async (req: Request, res: Response) => {
    
    const profileName  = req.body.profileName
    const thumnail = `https://thumbs.dreamstime.com/b/approved-icon-profile-verification-accept-badge-quality-check-mark-sticker-tick-vector-illustration-128840911.jpg`
    const stripeMetadata = JSON.stringify({userId: req.user.userId});
    const priceInCents = 20 * 100;
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
              name: `Premium Profile Verification - ${profileName}`,
              images : [thumnail]
      
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

const confirmPaymentAndVerifiedProfile = catchAsync(
  async (req: Request, res: Response) => {

    const { session_id } = req.body;
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

    const payment = await paymentService.paymentSaveToDB({
      amount: 20 ,
      paymentIntentId: payment_intent.id ,
      paymentDate: new Date() ,
      isProcessed : true,
      paymentMethod : payment_intent.payment_method_types[0] ,
      user:  parseMetaData.userId,
      paymentStatus : 'complete'
    })
    const user = await userService.updateVerifyProfile(parseMetaData.userId)
  
  

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      data: {
        payment ,
        user
      },
      message: 'Ueser Verfiy profile successfully',
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
  confirmPaymentAndVerifiedProfile,
  getAllPeymentList,
  getSinglePaymentList,
};
