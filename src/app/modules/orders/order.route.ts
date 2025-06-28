import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { OrderControllers } from './order.controller';
import {
  orderUpdateValidationSchema,
  orderValidationSchema,
} from './order.validation';

const router = express.Router();

//create order
router.post(
  '/init-payment',
  auth('customer'),
  validateRequest(orderValidationSchema),
  OrderControllers.initPayment,
);
router.post('/success', OrderControllers.createOrder);
router.post('/fail', OrderControllers.deleteOrderForFailedPayment);
router.post('/cancel', OrderControllers.deleteOrderForCancelledPayment);

// sells history
router.get('/sells-history', auth('admin'), OrderControllers.getAllOrdersData);

// get my orders
router.get('/my-orders', auth('customer'), OrderControllers.getMyOrdersData);

// update order status
router.put(
  '/update-order-status/:id',
  auth('admin'),
  validateRequest(orderUpdateValidationSchema),
  OrderControllers.updateOrderStatus,
);

export const OrderRoutes = router;
