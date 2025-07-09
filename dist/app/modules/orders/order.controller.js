"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const order_service_1 = require("./order.service");
// init payment
const initPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield order_service_1.OrderServices.initiatePayment(req.body);
    console.log(response);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Payment initiated successfully',
        data: response,
    });
}));
//create order
const createOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_service_1.OrderServices.createOrderInDB(req);
    res.redirect(result.redirectUrl);
}));
//delete order for failed payment
const deleteOrderForFailedPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_service_1.OrderServices.deleteOrderForFailedPayment(req);
    res.redirect(result.redirectUrl);
}));
//delete order for cancelled payment
const deleteOrderForCancelledPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_service_1.OrderServices.deleteOrderForCancelledPayment(req);
    res.redirect(result.redirectUrl);
}));
// get all orders data
const getAllOrdersData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_service_1.OrderServices.getAllOrdersDataFromDB(req, req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Orders data fetched successfully',
        data: result,
    });
}));
// get my orders data for customer
const getMyOrdersData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.authorization;
    const splittedToken = token === null || token === void 0 ? void 0 : token.split(' ')[1];
    const decodedUser = jsonwebtoken_1.default.verify(splittedToken, config_1.default.jwt_access_secret);
    const result = yield order_service_1.OrderServices.getMyOrdersDataFromDB(req === null || req === void 0 ? void 0 : req.query, decodedUser);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'My orders data fetched successfully',
        data: result,
    });
}));
// update order status
const updateOrderStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d;
    const token = (_b = req === null || req === void 0 ? void 0 : req.headers) === null || _b === void 0 ? void 0 : _b.authorization;
    const splittedToken = token === null || token === void 0 ? void 0 : token.split(' ')[1];
    const decodedUser = jsonwebtoken_1.default.verify(splittedToken, config_1.default.jwt_access_secret);
    const result = yield order_service_1.OrderServices.updateOrderStatus(decodedUser, (_c = req === null || req === void 0 ? void 0 : req.params) === null || _c === void 0 ? void 0 : _c.id, (_d = req === null || req === void 0 ? void 0 : req.body) === null || _d === void 0 ? void 0 : _d.orderStatus);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Order status updated successfully',
        data: result,
    });
}));
exports.OrderControllers = {
    initPayment,
    createOrder,
    deleteOrderForFailedPayment,
    deleteOrderForCancelledPayment,
    getAllOrdersData,
    getMyOrdersData,
    updateOrderStatus,
};
