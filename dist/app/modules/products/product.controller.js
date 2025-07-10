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
exports.ProductControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const product_service_1 = require("./product.service");
//create product
const createProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.ProductServices.createProductInDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Product has been created succesfully',
        data: result,
    });
}));
//get all products
const getAllProducts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.ProductServices.getAllProductsFromDB(req.query);
    res.status(200).json({
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'All products fetched successfully',
        data: result,
    });
}));
// get single product
const getSingleProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield product_service_1.ProductServices.getSingleProductFromDB((_a = req.params) === null || _a === void 0 ? void 0 : _a.id);
    res.status(200).json({
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Product fetched successfully',
        data: result,
    });
}));
// get all products for vendor dashboard
const getAllProductsOfAVendorToManage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const token = (_b = req === null || req === void 0 ? void 0 : req.headers) === null || _b === void 0 ? void 0 : _b.authorization;
    const splittedToken = token === null || token === void 0 ? void 0 : token.split(' ')[1];
    const decodedUser = jsonwebtoken_1.default.verify(splittedToken, config_1.default.jwt_access_secret);
    const result = yield product_service_1.ProductServices.getAllProductsForVendorFromDB(req === null || req === void 0 ? void 0 : req.query, decodedUser);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'All products fetched successfully for vendor dashboard',
        data: result,
    });
}));
// delete a single product
const deleteProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    const token = (_c = req === null || req === void 0 ? void 0 : req.headers) === null || _c === void 0 ? void 0 : _c.authorization;
    const splittedToken = token === null || token === void 0 ? void 0 : token.split(' ')[1];
    const decodedUser = jsonwebtoken_1.default.verify(splittedToken, config_1.default.jwt_access_secret);
    const result = yield product_service_1.ProductServices.deleteProductFromDB((_d = req.params) === null || _d === void 0 ? void 0 : _d.id, decodedUser);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Product has been deleted successfully',
        data: result,
    });
}));
// update a single product
const updateProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f;
    const token = (_e = req === null || req === void 0 ? void 0 : req.headers) === null || _e === void 0 ? void 0 : _e.authorization;
    const splittedToken = token === null || token === void 0 ? void 0 : token.split(' ')[1];
    const decodedUser = jsonwebtoken_1.default.verify(splittedToken, config_1.default.jwt_access_secret);
    const result = yield product_service_1.ProductServices.updateProductInDB(decodedUser, (_f = req.params) === null || _f === void 0 ? void 0 : _f.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Product has been updated successfully',
        data: result,
    });
}));
exports.ProductControllers = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    getAllProductsOfAVendorToManage,
    deleteProduct,
    updateProduct,
};
