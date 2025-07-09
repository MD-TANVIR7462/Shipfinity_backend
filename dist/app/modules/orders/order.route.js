"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const order_controller_1 = require("./order.controller");
const order_validation_1 = require("./order.validation");
const router = express_1.default.Router();
//create order
router.post('/init-payment', (0, auth_1.default)('customer'), (0, validateRequest_1.default)(order_validation_1.orderValidationSchema), order_controller_1.OrderControllers.initPayment);
router.post('/success', order_controller_1.OrderControllers.createOrder);
router.post('/fail', order_controller_1.OrderControllers.deleteOrderForFailedPayment);
router.post('/cancel', order_controller_1.OrderControllers.deleteOrderForCancelledPayment);
// sells history
router.get('/sells-history', (0, auth_1.default)('admin'), order_controller_1.OrderControllers.getAllOrdersData);
// get my orders
router.get('/my-orders', (0, auth_1.default)('customer'), order_controller_1.OrderControllers.getMyOrdersData);
// update order status
router.put('/update-order-status/:id', (0, auth_1.default)('admin'), (0, validateRequest_1.default)(order_validation_1.orderUpdateValidationSchema), order_controller_1.OrderControllers.updateOrderStatus);
exports.OrderRoutes = router;
