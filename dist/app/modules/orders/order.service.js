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
exports.OrderServices = void 0;
const axios_1 = __importDefault(require("axios"));
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const dateFormater_1 = require("../../utils/dateFormater");
const auth_model_1 = require("../authentication/auth.model");
const product_model_1 = require("../products/product.model");
const order_model_1 = require("./order.model");
//initiate payment
const initiatePayment = (order) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    if (((_a = order === null || order === void 0 ? void 0 : order.products) === null || _a === void 0 ? void 0 : _a.length) < 1) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'No products found in order, please try again');
    }
    else if (((_b = order === null || order === void 0 ? void 0 : order.products) === null || _b === void 0 ? void 0 : _b.length) > 0) {
        for (const product of order.products) {
            const productInDB = yield product_model_1.ProductModel.findOne({ _id: product.id });
            if (!productInDB) {
                throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Product not found in database, please try again');
            }
        }
    }
    // trnasaction to create order
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // transaction - 1
        yield order_model_1.OrderModel.create([order], { session });
        yield session.commitTransaction();
        yield session.endSession();
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(err);
    }
    const data = {
        store_id: config_1.default.store_id,
        store_passwd: config_1.default.store_passwd,
        total_amount: order === null || order === void 0 ? void 0 : order.totalBill,
        currency: 'USD',
        tran_id: `${Math.floor(Math.random() * 999)}${order === null || order === void 0 ? void 0 : order.orderBy.slice(0, 10)}${Date.now().toString().slice(7, 11)}`,
        success_url: `https://shipfinity-backend.vercel.app/api/orders/success?orderId=${order === null || order === void 0 ? void 0 : order.orderId}`,
        fail_url: `https://shipfinity-backend.vercel.app/api/orders/fail?orderId=${order === null || order === void 0 ? void 0 : order.orderId}`,
        cancel_url: `https://shipfinity-backend.vercel.app/api/orders/cancel?orderId=${order === null || order === void 0 ? void 0 : order.orderId}`,
        ipn_url: '',
        shipping_method: 'Courier',
        product_name: 'shopfinity',
        product_category: 'shopfinity',
        product_profile: 'shopfinity',
        cus_name: order.customerName,
        cus_email: order.orderBy,
        cus_add1: (_c = order === null || order === void 0 ? void 0 : order.shippingInfo) === null || _c === void 0 ? void 0 : _c.address,
        cus_add2: (_d = order === null || order === void 0 ? void 0 : order.shippingInfo) === null || _d === void 0 ? void 0 : _d.address,
        cus_city: (_e = order === null || order === void 0 ? void 0 : order.shippingInfo) === null || _e === void 0 ? void 0 : _e.city,
        cus_state: (_f = order === null || order === void 0 ? void 0 : order.shippingInfo) === null || _f === void 0 ? void 0 : _f.state,
        cus_postcode: (_g = order === null || order === void 0 ? void 0 : order.shippingInfo) === null || _g === void 0 ? void 0 : _g.postalCode,
        cus_country: (_h = order === null || order === void 0 ? void 0 : order.shippingInfo) === null || _h === void 0 ? void 0 : _h.country,
        cus_phone: (_j = order === null || order === void 0 ? void 0 : order.shippingInfo) === null || _j === void 0 ? void 0 : _j.mobile,
        cus_fax: 'shopfinity',
        ship_name: 'shopfinity',
        ship_add1: (_k = order === null || order === void 0 ? void 0 : order.shippingInfo) === null || _k === void 0 ? void 0 : _k.address,
        ship_add2: (_l = order === null || order === void 0 ? void 0 : order.shippingInfo) === null || _l === void 0 ? void 0 : _l.address,
        ship_city: (_m = order === null || order === void 0 ? void 0 : order.shippingInfo) === null || _m === void 0 ? void 0 : _m.city,
        ship_state: (_o = order === null || order === void 0 ? void 0 : order.shippingInfo) === null || _o === void 0 ? void 0 : _o.state,
        ship_postcode: (_p = order === null || order === void 0 ? void 0 : order.shippingInfo) === null || _p === void 0 ? void 0 : _p.postalCode,
        ship_country: (_q = order === null || order === void 0 ? void 0 : order.shippingInfo) === null || _q === void 0 ? void 0 : _q.country,
    };
    const response = yield (0, axios_1.default)({
        method: 'post',
        url: 'https://sandbox.sslcommerz.com/gwprocess/v3/api.php',
        data: data,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
    if (response.status !== 200) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to initiate payment, please try again');
    }
    else {
        return (_r = response.data) === null || _r === void 0 ? void 0 : _r.GatewayPageURL;
    }
});
//create order in DB
const createOrderInDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const params = req.query;
    const orderId = params === null || params === void 0 ? void 0 : params.orderId;
    // update order status
    yield order_model_1.OrderModel.findOneAndUpdate({ orderId: orderId }, {
        isPaid: true,
    }, { new: true });
    return { redirectUrl: 'https://myshopfinity.vercel.app/order-success' };
});
// delete order from DB for failed payment
const deleteOrderForFailedPayment = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const params = req.query;
    const orderId = params === null || params === void 0 ? void 0 : params.orderId;
    // delete order
    yield order_model_1.OrderModel.findOneAndDelete({ orderId });
    return { redirectUrl: 'https://myshopfinity.vercel.app/order-fail' };
});
// delete order from DB for cancelled payment
const deleteOrderForCancelledPayment = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const params = req.query;
    const orderId = params === null || params === void 0 ? void 0 : params.orderId;
    // delete order
    yield order_model_1.OrderModel.findOneAndDelete({ orderId });
    return { redirectUrl: 'https://myshopfinity.vercel.app/order-cancel' };
});
// get sells history for admin
const getAllOrdersDataFromDB = (req, query) => __awaiter(void 0, void 0, void 0, function* () {
    var _s;
    const { page, limit, timeframe, customersEmail } = query;
    let startDate;
    //implement pagination
    const pageToBeFetched = Number(page) || 1;
    const limitToBeFetched = Number(limit) || 10;
    const skip = (pageToBeFetched - 1) * limitToBeFetched;
    const totalDocs = yield order_model_1.OrderModel.countDocuments();
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
            startDate = (0, dateFormater_1.getTodaysDate)();
            break;
        case 'weekly':
            weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            startDate = (0, dateFormater_1.getFormattedDate)(weekAgo);
            break;
        case 'monthly':
            monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            startDate = (0, dateFormater_1.getFormattedDate)(monthAgo);
            break;
        case 'yearly':
            yearAgo = new Date();
            yearAgo.setFullYear(yearAgo.getFullYear() - 1);
            startDate = (0, dateFormater_1.getFormattedDate)(yearAgo);
            break;
        default:
            startDate = '1970-01-01';
    }
    // filter
    const filter = {};
    if (timeframe) {
        filter.createdAt = {
            $gte: startDate,
        };
    }
    if (customersEmail) {
        filter.orderBy = customersEmail;
    }
    // Query the database with the specified timeframe
    const orderHistory = yield order_model_1.OrderModel.find(filter)
        .sort({
        createdAt: -1,
    })
        .skip(skip)
        .limit(limitToBeFetched);
    const gizmoBuyProfit = Number((orderHistory
        .filter((order) => order.isPaid)
        .reduce((acc, order) => acc + order.totalBill, 0) *
        5) /
        100).toFixed(2);
    const reultToBereturned = {
        completedSells: (_s = orderHistory.filter((order) => order.isPaid)) === null || _s === void 0 ? void 0 : _s.length,
        totalSells: Number(orderHistory
            .filter((order) => order.isPaid)
            .reduce((acc, order) => acc + order.totalBill, 0)
            .toFixed(2)),
        gizmobuyProfit: +gizmoBuyProfit,
        orders: orderHistory,
    };
    return {
        meta,
        data: reultToBereturned,
    };
});
// get my orders for customer
const getMyOrdersDataFromDB = (query, decodedUser) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = decodedUser;
    // delete my unpaid orders
    yield order_model_1.OrderModel.deleteMany({
        orderBy: email,
        isPaid: false,
    });
    const { page, limit } = query;
    //implement pagination
    const pageToBeFetched = Number(page) || 1;
    const limitToBeFetched = Number(limit) || 10;
    const skip = (pageToBeFetched - 1) * limitToBeFetched;
    const totalDocs = yield order_model_1.OrderModel.countDocuments({
        orderBy: email,
    });
    const meta = {
        page: pageToBeFetched,
        limit: limitToBeFetched,
        total: totalDocs,
    };
    const myOrders = yield order_model_1.OrderModel.find({ orderBy: email })
        .sort({
        createdAt: -1,
    })
        .skip(skip)
        .limit(limitToBeFetched);
    return {
        meta,
        data: myOrders,
    };
});
// update order status by admin
const updateOrderStatus = (decodedUser, id, status) => __awaiter(void 0, void 0, void 0, function* () {
    const { role, email } = decodedUser;
    if (role !== 'admin') {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Unauthorized access');
    }
    const admin = yield auth_model_1.UserModel.findOne({ email });
    if (!admin) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Unauthorized access');
    }
    const orderToBeUpdated = yield order_model_1.OrderModel.findOneAndUpdate({ _id: id }, {
        orderStatus: status,
    }, { new: true });
    if (!orderToBeUpdated) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Order not found');
    }
    return orderToBeUpdated;
});
exports.OrderServices = {
    initiatePayment,
    createOrderInDB,
    deleteOrderForFailedPayment,
    deleteOrderForCancelledPayment,
    getAllOrdersDataFromDB,
    getMyOrdersDataFromDB,
    updateOrderStatus,
};
