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
exports.ProductServices = void 0;
/* eslint-disable no-unused-vars */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const auth_model_1 = require("../authentication/auth.model");
const product2_model_1 = require("./product2.model");
//get all products from DB
const getAllProductsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, search, sortBy, sortOrder, minPrice, maxPrice, brand, category, } = query;
    const totalDocs = yield product2_model_1.ProductModel2.countDocuments();
    const meta = {
        page: Number(page) || 1,
        limit: Number(limit) || 10,
        total: totalDocs,
    };
    //implement pagination
    const pageToBeFetched = Number(page);
    const limitToBeFetched = Number(limit);
    const skip = (pageToBeFetched - 1) * limitToBeFetched;
    //sort
    const sortCheck = {};
    if (sortBy && ['price'].includes(sortBy)) {
        sortCheck[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }
    // filter
    const filter = {};
    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) {
            filter.price.$gte = Number(minPrice);
        }
        if (maxPrice) {
            filter.price.$lte = Number(maxPrice);
        }
    }
    if (category && category !== 'all') {
        filter.category = new RegExp(category, 'i');
    }
    if (brand) {
        filter.brand = new RegExp(brand, 'i');
    }
    if (search) {
        filter.$or = [
            { name: new RegExp(search, 'i') },
            { brand: new RegExp(search, 'i') },
            { category: new RegExp(search, 'i') },
            { type: new RegExp(search, 'i') },
        ];
    }
    filter.quantity = { $gte: 1 };
    // fetch products
    const result = yield product2_model_1.ProductModel2.find(filter)
        .sort(sortCheck)
        .skip(skip)
        .limit(limitToBeFetched).select('type brand name category thumbImage');
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to get courses');
    }
    else {
        return {
            meta,
            data: result,
        };
    }
});
// get single product from DB
const getSingleProductFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product2_model_1.ProductModel2.findById(id).populate('vendor');
    const vendor = result === null || result === void 0 ? void 0 : result.vendor;
    const vendorDetails = yield auth_model_1.UserModel.findOne({ email: vendor });
    const resultToBeReturned = Object.assign(Object.assign({}, result === null || result === void 0 ? void 0 : result.toObject()), { vendor: {
            name: vendorDetails === null || vendorDetails === void 0 ? void 0 : vendorDetails.name,
        } });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to get the product with this id');
    }
    else {
        return resultToBeReturned;
    }
});
;
exports.ProductServices = {
    getAllProductsFromDB,
    getSingleProductFromDB,
};
