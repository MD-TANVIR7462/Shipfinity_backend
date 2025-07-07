import axios from 'axios';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import config from '../../config';
import AppError from '../../errors/AppError';
import { getFormattedDate, getTodaysDate } from '../../utils/dateFormater';
import { TDecodedUser } from '../authentication/auth.interface';
import { UserModel } from '../authentication/auth.model';
import { ProductModel } from '../products/product.model';
import { TOrder } from './order.interface';
import { OrderModel } from './order.model';

//initiate payment
const initiatePayment = async (order: TOrder) => {
  if (order?.products?.length < 1) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'No products found in order, please try again',
    );
  } else if (order?.products?.length > 0) {
    for (const product of order.products) {
      const productInDB = await ProductModel.findOne({ _id: product.id });
      if (!productInDB) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Product not found in database, please try again',
        );
      }
    }
  }

  // trnasaction to create order
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // transaction - 1
    await OrderModel.create([order], { session });

    await session.commitTransaction();
    await session.endSession();
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }

  const data = {
    store_id: config.store_id,
    store_passwd: config.store_passwd,
    total_amount: order?.totalBill,
    currency: 'USD',
    tran_id: `${Math.floor(Math.random() * 999)}${order?.orderBy.slice(
      0,
      10,
    )}${Date.now().toString().slice(7, 11)}`,
    success_url: `https://gizmobuy-backend.vercel.app/api/orders/success?orderId=${order?.orderId}`,
    fail_url: `https://gizmobuy-backend.vercel.app/api/orders/fail?orderId=${order?.orderId}`,
    cancel_url: `https://gizmobuy-backend.vercel.app/api/orders/cancel?orderId=${order?.orderId}`,
    ipn_url: '',
    shipping_method: 'Courier',
    product_name: 'shopfinity',
    product_category: 'shopfinity',
    product_profile: 'shopfinity',
    cus_name: order.customerName,
    cus_email: order.orderBy,
    cus_add1: order?.shippingInfo?.address,
    cus_add2: order?.shippingInfo?.address,
    cus_city: order?.shippingInfo?.city,
    cus_state: order?.shippingInfo?.state,
    cus_postcode: order?.shippingInfo?.postalCode,
    cus_country: order?.shippingInfo?.country,
    cus_phone: order?.shippingInfo?.mobile,
    cus_fax: 'shopfinity',
    ship_name: 'shopfinity',
    ship_add1: order?.shippingInfo?.address,
    ship_add2: order?.shippingInfo?.address,
    ship_city: order?.shippingInfo?.city,
    ship_state: order?.shippingInfo?.state,
    ship_postcode: order?.shippingInfo?.postalCode,
    ship_country: order?.shippingInfo?.country,
  };

  const response = await axios({
    method: 'post',
    url: 'https://sandbox.sslcommerz.com/gwprocess/v3/api.php',
    data: data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  if (response.status !== 200) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to initiate payment, please try again',
    );
  } else {
    return response.data?.GatewayPageURL;
  }
};

//create order in DB
const createOrderInDB = async (req: any) => {
  const params = req.query;
  const orderId = params?.orderId;

  // update order status
  const order = await OrderModel.findOneAndUpdate(
    { orderId: orderId },
    {
      isPaid: true,
    },
    { new: true },
  );

  return { redirectUrl: 'https://gizmobuy.vercel.app/order-success' };
};

// delete order from DB for failed payment
const deleteOrderForFailedPayment = async (req: any) => {
  const params = req.query;
  const orderId = params?.orderId;

  // delete order
  await OrderModel.findOneAndDelete({ orderId });

  return { redirectUrl: 'https://gizmobuy.vercel.app/order-fail' };
};

// delete order from DB for cancelled payment
const deleteOrderForCancelledPayment = async (req: any) => {
  const params = req.query;
  const orderId = params?.orderId;

  // delete order
  await OrderModel.findOneAndDelete({ orderId });

  return { redirectUrl: 'https://gizmobuy.vercel.app/order-cancel' };
};

// get sells history for admin
const getAllOrdersDataFromDB = async (req: any, query: any) => {
  const { page, limit, timeframe, customersEmail } = query;
  let startDate;

  //implement pagination
  const pageToBeFetched = Number(page) || 1;
  const limitToBeFetched = Number(limit) || 10;
  const skip = (pageToBeFetched - 1) * limitToBeFetched;

  const totalDocs = await OrderModel.countDocuments();

  const meta = {
    page: pageToBeFetched,
    limit: limitToBeFetched,
    total: totalDocs,
  };

  // Calculate the start date based on the specified timeframe
  let weekAgo;
  let monthAgo;
  let yearAgo;
  switch (timeframe) {
    case 'daily':
      startDate = getTodaysDate();
      break;
    case 'weekly':
      weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      startDate = getFormattedDate(weekAgo);
      break;
    case 'monthly':
      monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      startDate = getFormattedDate(monthAgo);
      break;
    case 'yearly':
      yearAgo = new Date();
      yearAgo.setFullYear(yearAgo.getFullYear() - 1);
      startDate = getFormattedDate(yearAgo);
      break;
    default:
      startDate = '1970-01-01';
  }

  // filter
  const filter: Record<string, any> = {};

  if (timeframe) {
    filter.createdAt = {
      $gte: startDate,
    };
  }

  if (customersEmail) {
    filter.orderBy = customersEmail;
  }

  // Query the database with the specified timeframe
  const orderHistory = await OrderModel.find(filter)
    .sort({
      createdAt: -1,
    })
    .skip(skip)
    .limit(limitToBeFetched);

  const gizmoBuyProfit = Number(
    (orderHistory
      .filter((order: any) => order.isPaid)
      .reduce((acc: any, order: any) => acc + order.totalBill, 0) *
      5) /
      100,
  ).toFixed(2);

  const reultToBereturned = {
    completedSells: orderHistory.filter((order: any) => order.isPaid)?.length,
    totalSells: Number(
      orderHistory
        .filter((order: any) => order.isPaid)
        .reduce((acc: any, order: any) => acc + order.totalBill, 0)
        .toFixed(2),
    ),
    gizmobuyProfit: +gizmoBuyProfit,
    orders: orderHistory,
  };

  return {
    meta,
    data: reultToBereturned,
  };
};

// get my orders for customer
const getMyOrdersDataFromDB = async (query: any, decodedUser: TDecodedUser) => {
  const { email } = decodedUser;

  // delete my unpaid orders
  await OrderModel.deleteMany({
    orderBy: email,
    isPaid: false,
  });

  const { page, limit } = query;

  //implement pagination
  const pageToBeFetched = Number(page) || 1;
  const limitToBeFetched = Number(limit) || 10;
  const skip = (pageToBeFetched - 1) * limitToBeFetched;

  const totalDocs = await OrderModel.countDocuments({
    orderBy: email,
  });

  const meta = {
    page: pageToBeFetched,
    limit: limitToBeFetched,
    total: totalDocs,
  };

  const myOrders = await OrderModel.find({ orderBy: email })
    .sort({
      createdAt: -1,
    })
    .skip(skip)
    .limit(limitToBeFetched);

  return {
    meta,
    data: myOrders,
  };
};

// update order status by admin
const updateOrderStatus = async (
  decodedUser: TDecodedUser,
  id: string,
  status: string,
) => {
  const { role, email } = decodedUser;

  if (role !== 'admin') {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized access');
  }
  const admin = await UserModel.findOne({ email });

  if (!admin) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized access');
  }

  const orderToBeUpdated = await OrderModel.findOneAndUpdate(
    { _id: id },
    {
      orderStatus: status,
    },
    { new: true },
  );

  if (!orderToBeUpdated) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
  }

  return orderToBeUpdated;
};

export const OrderServices = {
  initiatePayment,
  createOrderInDB,
  deleteOrderForFailedPayment,
  deleteOrderForCancelledPayment,
  getAllOrdersDataFromDB,
  getMyOrdersDataFromDB,
  updateOrderStatus,
};
