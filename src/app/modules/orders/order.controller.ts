import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TDecodedUser } from '../authentication/auth.interface';
import { OrderServices } from './order.service';

// init payment
const initPayment = catchAsync(async (req, res) => {
  const response = await OrderServices.initiatePayment(req.body);
console.log(response)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment initiated successfully',
    data: response,
  });
});

//create order
const createOrder = catchAsync(async (req, res) => {
  const result = await OrderServices.createOrderInDB(req);

  res.redirect(result.redirectUrl);
});

//delete order for failed payment
const deleteOrderForFailedPayment = catchAsync(async (req, res) => {
  const result = await OrderServices.deleteOrderForFailedPayment(req);

  res.redirect(result.redirectUrl);
});

//delete order for cancelled payment
const deleteOrderForCancelledPayment = catchAsync(async (req, res) => {
  const result = await OrderServices.deleteOrderForCancelledPayment(req);

  res.redirect(result.redirectUrl);
});

// get all orders data
const getAllOrdersData = catchAsync(async (req, res) => {
  const result = await OrderServices.getAllOrdersDataFromDB(req, req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Orders data fetched successfully',
    data: result,
  });
});

// get my orders data for customer
const getMyOrdersData = catchAsync(async (req, res) => {
  const token = req?.headers?.authorization;
  const splittedToken = token?.split(' ')[1] as string;

  const decodedUser = jwt.verify(
    splittedToken,
    config.jwt_access_secret as string,
  );

  const result = await OrderServices.getMyOrdersDataFromDB(
    req?.query,
    decodedUser as TDecodedUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My orders data fetched successfully',
    data: result,
  });
});

// update order status
const updateOrderStatus = catchAsync(async (req, res) => {
  const token = req?.headers?.authorization;
  const splittedToken = token?.split(' ')[1] as string;

  const decodedUser = jwt.verify(
    splittedToken,
    config.jwt_access_secret as string,
  );

  const result = await OrderServices.updateOrderStatus(
    decodedUser as TDecodedUser,
    req?.params?.id,
    req?.body?.orderStatus,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order status updated successfully',
    data: result,
  });
});

export const OrderControllers = {
  initPayment,
  createOrder,
  deleteOrderForFailedPayment,
  deleteOrderForCancelledPayment,
  getAllOrdersData,
  getMyOrdersData,
  updateOrderStatus,
};
