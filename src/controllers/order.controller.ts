import { NextFunction, Request, Response } from "express";

import ErrorHandler from "../utils/ErrorHandler";
import httpStatus from "http-status";
import orderModel, { IOrder } from "../models/order.model";
import sendResponse from "../utils/sendResponse";
import productModel from "../models/product.model";
import Stripe from "stripe";
import config from "../config";
import catchAsync from "../middleware/asyncError.middleware";
import addOrder from "../services/order.service";
const stripe = new Stripe(config.payment_secret || "", {
  apiVersion: "2023-10-16",
});

const createOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderData = req.body;

      if (orderData.order_type === "subscription" && orderData?.transaction_id) {

        const paymentIntentId = orderData?.transaction_id;
        const paymentIntent = await stripe.paymentIntents.retrieve(
          paymentIntentId
        );
        if (paymentIntent.status !== "succeeded") {
          return next(
            new ErrorHandler(
              "payment not authorized!",
              httpStatus.BAD_GATEWAY
            )
          );
        }

      }

      addOrder(orderData, res, next)


    } catch (error: any) {
      return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST));
    }
  }
);

// only admin
const updateOrderStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderId = req.body.order_id;
      const status = req.body?.order_status;
      if (!orderId || !status) return next(new ErrorHandler("order id and status is required", httpStatus.BAD_REQUEST))

      if (!status) {
        return next(
          new ErrorHandler("status is required", httpStatus.BAD_REQUEST)
        );
      }



      const statusOptions = [
        "pending",
        "completed",
        "returned",
        "canceled",
      ];
      if (!statusOptions.includes(status)) {
        return next(new ErrorHandler("invalid status", httpStatus.BAD_REQUEST));
      }

      await orderModel.findByIdAndUpdate(
        orderId,
        {
          $set: {
            order_status: status,
          },
        },
        { new: true }
      );

      sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "order status updated successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST));
    }
  }
);
// only admin
const deleteOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderId = req.params?.id;
      await orderModel.findByIdAndDelete(orderId);
      sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "order deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST));
    }
  }
);
const getOrders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let skip: number = parseInt((req?.query?.skip || "0") as string)
      let limit: number = parseInt((req?.query?.limit || "20") as string)
      const orders = await orderModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
      sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        data: orders,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST));
    }
  }
);
const searchOrders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req?.params?.query
      if (!query) return next(new ErrorHandler("search query is required", httpStatus.BAD_REQUEST))
      let skip: number = parseInt((req?.query?.skip || "0") as string)
      let limit: number = parseInt((req?.query?.limit || "20") as string)
      const orders = await orderModel.find(
        {
          $or: [
            { transaction_id: { $regex: query, $options: "i" } },
            { subscription_id: { $regex: query, $options: "i" } }
          ]
        }
      ).sort({ createdAt: -1 }).skip(skip).limit(limit)
      // const orders = await orderModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
      sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        data: orders,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST));
    }
  }
);

const getOrdersByEmail = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const email = req?.query?.email

      if (!email) return next(new ErrorHandler("email is required", httpStatus.BAD_REQUEST))
      const orders = await orderModel.find({ email }).select("name transaction_id order_status email delivery_info.address createdAt user_review").sort({ createdAt: -1 });
      sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        data: orders,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST));
    }
  }
);



// payments

const newPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const amount = req.body?.amount;
      console.log(amount);
      if (!amount)
        return next(
          new ErrorHandler("amount is required", httpStatus.BAD_REQUEST)
        );
      const paymentIntent = await stripe.paymentIntents.create({
        currency: "usd",
        amount: amount,
        payment_method_types: ["card"],
      });
      sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        data: {
          client_secret: paymentIntent.client_secret,
        },
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST));
    }
  }
);


const newSubscribe = catchAsync(async (req, res, next) => {
  const { name, email, paymentMethod, amount } = req.body;

  try {
    // Create a customer
    const customer = await stripe.customers.create({
      email,
      name,
      payment_method: paymentMethod,
      invoice_settings: { default_payment_method: paymentMethod },
    });

    // Create a product
    const product = await stripe.products.create({
      name: "Your Product Name",
    });

    // Create a subscription
    const subscription: any = await stripe.subscriptions.create({
      customer: customer.id,
      items: [
        {
          price_data: {
            currency: "USD",
            product: product.id,
            unit_amount: amount,
            recurring: {
              interval: "year",
            },
          },
        },
      ],
      payment_settings: {
        payment_method_types: ["card"],
        save_default_payment_method: "on_subscription",
      },
      expand: ["latest_invoice.payment_intent"],
    });

    const clientSecret =
      subscription?.latest_invoice?.payment_intent?.client_secret;

    if (!clientSecret) {
      throw new Error("Client secret not found in the subscription");
    }
    const subscriptionId = subscription.id;
    res.json({
      message: "Subscription successfully initiated ssss",
      clientSecret,
      customer: customer.id,
      subscriptionId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
const unsubscribe = catchAsync(async (req, res, next) => {
  const { subscriptionId } = req.body;
  console.log(subscriptionId);

  try {
    const canceledSubscription = await stripe.subscriptions.cancel(
      subscriptionId,

    );

    if (canceledSubscription.status === 'canceled') {
      res.json({ message: "Unsubscription successful", canceledSubscription });
    } else {
      res.status(400).json({ error: "Subscription cancellation failed" });
    }
  } catch (error) {
    console.error("Error unsubscribing:", error);
    res.status(500).json({ error: "Server error" });
  }
});


const getInvoiceById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderId = req?.params?.id

    if (!orderId) return next(new ErrorHandler("order id required", httpStatus.BAD_REQUEST))
    const order = await orderModel.findById(orderId).select("name packages delivery_info.address delivery_info.phone contact_email createdAt products order_type")
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: order
    })
  } catch (error: any) {
    return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
  }
})

// only admin 
const getSingleOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderId = req?.params?.id

    if (!orderId) return next(new ErrorHandler("order id required", httpStatus.BAD_REQUEST))
    const order = await orderModel.findById(orderId)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: order
    })
  } catch (error: any) {
    return next(new ErrorHandler(error.message, httpStatus.BAD_REQUEST))
  }
})

const orderController = {
  createOrder,
  updateOrderStatus,
  deleteOrder,
  getOrders,
  searchOrders,
  getOrdersByEmail,
  newPayment,
  newSubscribe,
  unsubscribe,
  getInvoiceById,
  getSingleOrder
};

export default orderController;