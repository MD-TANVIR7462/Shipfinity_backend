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
const product_model_1 = require("./product.model");
//create product in DB
const createProductInDB = (product) => __awaiter(void 0, void 0, void 0, function* () {
    if ((product === null || product === void 0 ? void 0 : product.stock) < 1) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Stock should be equal or greater than 1');
    }
    else if ((product === null || product === void 0 ? void 0 : product.price) < 1) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Price should be equal or greater than 1');
    }
    const result = yield product_model_1.ProductModel.create(product);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create course');
    }
    else {
        return result;
    }
});
//get all products from DB
const getAllProductsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, search, sortBy, sortOrder, minPrice, maxPrice, brand, category, } = query;
    const totalDocs = yield product_model_1.ProductModel.countDocuments();
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
    if (category !== 'all') {
        filter.category = new RegExp(category, 'i');
    }
    else if (category === 'all') {
        filter.category = new RegExp('', 'i');
    }
    if (brand) {
        filter.brand = new RegExp(brand, 'i');
    }
    if (search) {
        filter.$or = [
            { title: new RegExp(search, 'i') },
            { brand: new RegExp(search, 'i') },
        ];
    }
    filter.stock = { $gte: 1 };
    // fetch products
    const result = yield product_model_1.ProductModel.find(filter)
        .sort(sortCheck)
        .skip(skip)
        .limit(limitToBeFetched);
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
    const result = yield product_model_1.ProductModel.findById(id).populate('vendor');
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
// get all products for vendor dashboard from DB
const getAllProductsForVendorFromDB = (query, decodedUser) => __awaiter(void 0, void 0, void 0, function* () {
    const { role, email } = decodedUser;
    const { page, limit, search } = query;
    if (role !== 'vendor') {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized to access this route');
    }
    const totalDocs = yield product_model_1.ProductModel.countDocuments({
        vendor: email,
    });
    const meta = {
        page: Number(page) || 1,
        limit: Number(limit) || 10,
        total: totalDocs,
    };
    //implement pagination
    const pageToBeFetched = Number(page);
    const limitToBeFetched = Number(limit);
    const skip = (pageToBeFetched - 1) * limitToBeFetched;
    // search by name or email
    const filter = {};
    filter.vendor = email;
    if (search) {
        filter.$or = [{ title: new RegExp(String(search), 'i') }];
    }
    const result = yield product_model_1.ProductModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitToBeFetched);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to get products');
    }
    return {
        meta,
        data: result,
    };
});
// delete a single product from DB
const deleteProductFromDB = (id, decodedUser) => __awaiter(void 0, void 0, void 0, function* () {
    const { role, email } = decodedUser;
    const product = yield product_model_1.ProductModel.findById(id);
    if (!product) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to get the product with this id');
    }
    if (email === 'demovendor@gmail.com' &&
        (product === null || product === void 0 ? void 0 : product.releaseDate) === '2023-01-01') {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Admin has set restrictions to delete this product to maintain integrity of the system. Please create your own product to test this feature.');
    }
    if (role !== 'vendor') {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized to access this. Please login as a vendor');
    }
    if (product.vendor !== email) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized to delete this product');
    }
    const result = yield product_model_1.ProductModel.findByIdAndDelete(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to delete product');
    }
    return result;
});
// update a single product in DB
const updateProductInDB = (decodedUser, id, product) => __awaiter(void 0, void 0, void 0, function* () {
    const { role, email } = decodedUser;
    const vendor = yield auth_model_1.UserModel.findOne({ email });
    if (!vendor) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to get vendor details and update product');
    }
    if (role !== 'vendor') {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized to access this. Please login as a vendor');
    }
    const productToUpdate = yield product_model_1.ProductModel.findById(id);
    if (!productToUpdate) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to get the product with this id');
    }
    if (email === 'demovendor@gmail.com' &&
        (productToUpdate === null || productToUpdate === void 0 ? void 0 : productToUpdate.releaseDate) === '2023-01-01') {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Admin has set restrictions to update this product to maintain integrity of the system. Please create your own product to test this feature.');
    }
    if (productToUpdate.vendor !== email) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized to update this product');
    }
    if ((product === null || product === void 0 ? void 0 : product.stock) < 1) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Stock should be equal or greater than 1');
    }
    else if ((product === null || product === void 0 ? void 0 : product.price) < 1) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Price should be equal or greater than 1');
    }
    const { title, price, stock, brand, category, displayImage, description } = product;
    const result = yield product_model_1.ProductModel.findByIdAndUpdate(id, {
        title: title ? title : productToUpdate.title,
        price: price ? Number(price) : productToUpdate.price,
        stock: stock ? Number(stock) : productToUpdate.stock,
        brand: brand ? brand : productToUpdate.brand,
        category: category ? category : productToUpdate.category,
        displayImage: displayImage ? displayImage : productToUpdate.displayImage,
        description: description ? description : productToUpdate.description,
    }, {
        new: true,
    });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to update product');
    }
    return result;
});
exports.ProductServices = {
    createProductInDB,
    getAllProductsFromDB,
    getSingleProductFromDB,
    getAllProductsForVendorFromDB,
    deleteProductFromDB,
    updateProductInDB,
};
