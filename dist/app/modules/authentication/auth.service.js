"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.UserServices = void 0;
/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unsafe-optional-chaining */
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
// import { sendEmail } from '../../utils/sendEmail';
const order_model_1 = require("../orders/order.model");
const product_model_1 = require("../products/product.model");
const auth_model_1 = require("./auth.model");
//create user in DB
const registerUserInDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExistsWithEmail = yield auth_model_1.UserModel.isUserExistsWithEmail(user === null || user === void 0 ? void 0 : user.email);
    user = Object.assign(Object.assign({}, user), { address: {
            address: '',
            city: '',
            state: '',
            country: '',
            postalCode: '',
            mobile: '',
        } });
    if (isUserExistsWithEmail) {
        throw new Error('User with this email already exists, please try with different  email.');
    }
    else {
        const session = yield mongoose_1.default.startSession();
        try {
            session.startTransaction();
            // transaction - 1
            const newUser = yield auth_model_1.UserModel.create([user], {
                session,
            });
            yield session.commitTransaction();
            yield session.endSession();
            if (newUser.length < 1) {
                throw new Error('Registration failed !');
            }
            return newUser[0];
        }
        catch (err) {
            yield session.abortTransaction();
            yield session.endSession();
            throw new Error(err);
        }
    }
});
// login suser in DB
const loginUserInDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const userFromDB = yield auth_model_1.UserModel.isUserExistsWithEmail(user === null || user === void 0 ? void 0 : user.email);
    if (!userFromDB) {
        throw new Error('No user found with this email');
    }
    if (userFromDB.isBlocked) {
        throw new Error('User is blocked');
    }
    const isPasswordMatched = yield bcrypt_1.default.compare(user === null || user === void 0 ? void 0 : user.password, userFromDB.password);
    if (!isPasswordMatched) {
        throw new Error('Incorrect password');
    }
    //create token and send it to client side
    const payload = {
        _id: userFromDB === null || userFromDB === void 0 ? void 0 : userFromDB._id,
        name: userFromDB === null || userFromDB === void 0 ? void 0 : userFromDB.name,
        email: userFromDB === null || userFromDB === void 0 ? void 0 : userFromDB.email,
        role: userFromDB === null || userFromDB === void 0 ? void 0 : userFromDB.role,
        isBlocked: userFromDB === null || userFromDB === void 0 ? void 0 : userFromDB.isBlocked,
    };
    const accesstoken = jsonwebtoken_1.default.sign(payload, config_1.default.jwt_access_secret, {
        expiresIn: config_1.default.jwt_access_expires_in,
    });
    const refreshfToken = jsonwebtoken_1.default.sign(payload, config_1.default.jwt_refresh_secret, {
        expiresIn: config_1.default.jwt_refresh_expires_in,
    });
    return {
        accesstoken,
        refreshfToken,
        userFromDB,
    };
});
//verify token from client side
const verifyToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token) {
        return false;
    }
    // checking token is valid or not
    let decodedUser;
    try {
        decodedUser = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
    }
    catch (error) {
        return false;
    }
    const { email } = decodedUser;
    // checking if the user exists
    const user = yield auth_model_1.UserModel.isUserExistsWithEmail(email);
    if (!user) {
        return false;
    }
    return true;
});
//generate refresh token
const getAccessTokenByRefreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Refresh token is required');
    }
    // checking token is valid or not
    let decodedUser;
    try {
        decodedUser = jsonwebtoken_1.default.verify(token, config_1.default.jwt_refresh_secret);
    }
    catch (error) {
        throw new jsonwebtoken_1.JsonWebTokenError('Unauthorized Access!');
    }
    const { _id, name, role, email, isBlocked } = decodedUser;
    // checking if the user exists
    const user = yield auth_model_1.UserModel.isUserExistsWithEmail(email);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Unauthorized Access!');
    }
    const payload = {
        _id,
        name,
        role,
        email,
        isBlocked,
    };
    const accessToken = jsonwebtoken_1.default.sign(payload, config_1.default.jwt_access_secret, {
        expiresIn: config_1.default.jwt_access_expires_in,
    });
    return {
        accessToken,
    };
});
// change password
const changePasswordInDB = (passwordData, user) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const { currentPassword, newPassword } = passwordData;
    // check if the user exists in the database
    const userFromDB = yield auth_model_1.UserModel.findOne({
        email: user === null || user === void 0 ? void 0 : user.email,
    });
    if (!userFromDB) {
        throw new jsonwebtoken_1.JsonWebTokenError('Unauthorized Access!');
    }
    if ((userFromDB === null || userFromDB === void 0 ? void 0 : userFromDB.email) === "customer@gmail.com" ||
        (userFromDB === null || userFromDB === void 0 ? void 0 : userFromDB.email) === "tanvir.dev3@gmail.com" ||
        (userFromDB === null || userFromDB === void 0 ? void 0 : userFromDB.email) === "admin@gmail.com") {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Password change is not allowed for this demo account');
    }
    const currentAccesstokenIssuedAt = (user === null || user === void 0 ? void 0 : user.iat) * 1000;
    let lastPasswordChangedAt = ((_b = (_a = userFromDB === null || userFromDB === void 0 ? void 0 : userFromDB.lastTwoPasswords) === null || _a === void 0 ? void 0 : _a[1]) === null || _b === void 0 ? void 0 : _b.changedAt)
        ? (_d = (_c = userFromDB === null || userFromDB === void 0 ? void 0 : userFromDB.lastTwoPasswords) === null || _c === void 0 ? void 0 : _c[1]) === null || _d === void 0 ? void 0 : _d.changedAt
        : (_f = (_e = userFromDB === null || userFromDB === void 0 ? void 0 : userFromDB.lastTwoPasswords) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.changedAt;
    //convert lastPasswordChangedAt to miliseconds
    lastPasswordChangedAt = new Date(lastPasswordChangedAt).getTime();
    if (((_g = userFromDB === null || userFromDB === void 0 ? void 0 : userFromDB.lastTwoPasswords) === null || _g === void 0 ? void 0 : _g.length) === 0) {
        lastPasswordChangedAt = (userFromDB === null || userFromDB === void 0 ? void 0 : userFromDB.createdAt).getTime();
    }
    if (currentAccesstokenIssuedAt < lastPasswordChangedAt) {
        // throw new JsonWebTokenError('Unauthorized Access!');
        return {
            statusCode: 406,
            status: 'failed',
            message: 'Recent password change detected.',
        };
    }
    // check if the current password the user gave is correct
    const isPasswordMatched = yield bcrypt_1.default.compare(currentPassword, userFromDB.password);
    if (!isPasswordMatched) {
        throw new Error('Current password does not match');
    }
    // Check if new password is the same as the current one
    const isSameAsCurrent = currentPassword === newPassword;
    if (isSameAsCurrent) {
        throw new Error('New password must be different from the current password');
    }
    // Check if the new password is the same as the last two passwords
    const isSameAsLastTwoPasswords = (_h = userFromDB === null || userFromDB === void 0 ? void 0 : userFromDB.lastTwoPasswords) === null || _h === void 0 ? void 0 : _h.some((password) => {
        return bcrypt_1.default.compareSync(newPassword, password.oldPassword);
    });
    if (isSameAsLastTwoPasswords) {
        const lastUsedDate = (_k = (_j = userFromDB === null || userFromDB === void 0 ? void 0 : userFromDB.lastTwoPasswords) === null || _j === void 0 ? void 0 : _j[0]) === null || _k === void 0 ? void 0 : _k.changedAt;
        const formattedLastUsedDate = lastUsedDate
            ? new Date(lastUsedDate).toLocaleString()
            : 'unknown';
        throw new Error(`Password change failed. Ensure the new password is unique and not among the last 2 used (last used on ${formattedLastUsedDate}).`);
    }
    // Check if the new password meets the minimum requirements
    if (newPassword.length < 6 || !/\d/.test(newPassword)) {
        throw new Error('New password must be minimum 6 characters and include both letters and numbers');
    }
    // Update the password and keep track of the last two passwords
    const hashedNewPassword = yield bcrypt_1.default.hash(newPassword, 12);
    const newLastTwoPasswords = () => {
        var _a, _b, _c;
        if (((_a = userFromDB === null || userFromDB === void 0 ? void 0 : userFromDB.lastTwoPasswords) === null || _a === void 0 ? void 0 : _a.length) === 0) {
            return [{ oldPassword: userFromDB === null || userFromDB === void 0 ? void 0 : userFromDB.password, changedAt: new Date() }];
        }
        else if (((_b = userFromDB === null || userFromDB === void 0 ? void 0 : userFromDB.lastTwoPasswords) === null || _b === void 0 ? void 0 : _b.length) === 1) {
            return [
                ...userFromDB === null || userFromDB === void 0 ? void 0 : userFromDB.lastTwoPasswords,
                { oldPassword: userFromDB === null || userFromDB === void 0 ? void 0 : userFromDB.password, changedAt: new Date() },
            ];
        }
        else if (((_c = userFromDB === null || userFromDB === void 0 ? void 0 : userFromDB.lastTwoPasswords) === null || _c === void 0 ? void 0 : _c.length) === 2) {
            return [
                userFromDB === null || userFromDB === void 0 ? void 0 : userFromDB.lastTwoPasswords[1],
                { oldPassword: userFromDB === null || userFromDB === void 0 ? void 0 : userFromDB.password, changedAt: new Date() },
            ];
        }
    };
    const result = yield auth_model_1.UserModel.findOneAndUpdate({ email: userFromDB === null || userFromDB === void 0 ? void 0 : userFromDB.email }, {
        password: hashedNewPassword,
        lastTwoPasswords: newLastTwoPasswords(),
    }, {
        new: true,
    });
    if (!result) {
        throw new Error('Password change failed');
    }
    const modifiedResult = {
        _id: result === null || result === void 0 ? void 0 : result._id,
        name: result === null || result === void 0 ? void 0 : result.name,
        email: result === null || result === void 0 ? void 0 : result.email,
        role: result === null || result === void 0 ? void 0 : result.role,
    };
    return modifiedResult;
});
//forgot password
const forgetPasswordInDB = (userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userEmail) {
        throw new Error('Invalid email');
    }
    const emailRegex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(userEmail)) {
        throw new Error('Invalid email format');
    }
    if (userEmail === 'demoadmin@gmail.com' ||
        userEmail === 'democustomer@gmail.com' ||
        userEmail === 'demovendor@gmail.com') {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Password reset is not allowed for this demo account');
    }
    const userFromDB = yield auth_model_1.UserModel.findOne({
        email: userEmail,
    });
    if (!userFromDB) {
        throw new Error('No account found with that email');
    }
    const payload = {
        email: userFromDB === null || userFromDB === void 0 ? void 0 : userFromDB.email,
    };
    const resettoken = jsonwebtoken_1.default.sign(payload, config_1.default.jwt_access_secret, {
        expiresIn: '5m',
    });
    // const resetUrl = `${'https://url.vercel.app'}/forgot-password?email=${userEmail}&token=${resettoken}`;
    // const msg = sendEmail(userFromDB?.email, resetUI(resetUrl));
    return "Successfull!";
});
// reset forgotten password
const resetForgottenPasswordInDB = (userEmail, resetToken, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userEmail || !resetToken || !newPassword) {
        throw new Error('Invalid data');
    }
    else if (newPassword.length < 6 || !/\d/.test(newPassword)) {
        throw new Error('New password must be minimum 6 characters and include both letters and numbers');
    }
    else if (userEmail === 'demoadmin@gmail.com' ||
        userEmail === 'democustomer@gmail.com' ||
        userEmail === 'demovendor@gmail.com') {
        throw new Error('Password reset is not allowed for this demo account');
    }
    const userFromDB = yield auth_model_1.UserModel.findOne({
        email: userEmail,
    });
    if (!userFromDB) {
        throw new Error('No account found with that email');
    }
    else {
        // checking token is valid or not
        let decodedUser;
        try {
            decodedUser = jsonwebtoken_1.default.verify(resetToken, config_1.default.jwt_access_secret);
        }
        catch (error) {
            throw new Error('Invalid or expired token');
        }
        if (decodedUser.email !== userEmail) {
            throw new Error('Invalid token');
        }
        const userFromDB = yield auth_model_1.UserModel.findOne({
            email: userEmail,
        });
        if (!userFromDB) {
            throw new Error('No account found with that email while resetting password');
        }
        const hashedNewPassword = yield bcrypt_1.default.hash(newPassword, Number(config_1.default.bcrypt_salt_rounds));
        const result = yield auth_model_1.UserModel.findOneAndUpdate({ email: userFromDB === null || userFromDB === void 0 ? void 0 : userFromDB.email }, {
            password: hashedNewPassword,
        }, {
            new: true,
        });
        if (!result) {
            throw new Error('Password reset failed');
        }
        const modifiedResult = {
            _id: result === null || result === void 0 ? void 0 : result._id,
            name: result === null || result === void 0 ? void 0 : result.name,
            email: result === null || result === void 0 ? void 0 : result.email,
            role: result === null || result === void 0 ? void 0 : result.role,
        };
        return modifiedResult;
    }
});
//update user profile
const updateUserProfileInDB = (user, dataToBeUpdated) => __awaiter(void 0, void 0, void 0, function* () {
    var _l, _m, _o, _p, _q, _r;
    const userFromDB = yield auth_model_1.UserModel.findOne({
        email: user === null || user === void 0 ? void 0 : user.email,
    });
    if (!userFromDB) {
        throw new jsonwebtoken_1.JsonWebTokenError('Unauthorized Access!');
    }
    const { name, profileImage, isBlocked, address } = dataToBeUpdated;
    const result = yield auth_model_1.UserModel.findOneAndUpdate({ email: userFromDB === null || userFromDB === void 0 ? void 0 : userFromDB.email }, {
        name: name ? name : userFromDB === null || userFromDB === void 0 ? void 0 : userFromDB.name,
        profileImage: profileImage ? profileImage : userFromDB === null || userFromDB === void 0 ? void 0 : userFromDB.profileImage,
        isBlocked: isBlocked ? isBlocked : userFromDB === null || userFromDB === void 0 ? void 0 : userFromDB.isBlocked,
        address: address
            ? {
                address: address.address
                    ? address.address
                    : (_l = userFromDB === null || userFromDB === void 0 ? void 0 : userFromDB.address) === null || _l === void 0 ? void 0 : _l.address,
                city: address.city ? address.city : (_m = userFromDB === null || userFromDB === void 0 ? void 0 : userFromDB.address) === null || _m === void 0 ? void 0 : _m.city,
                state: address.state ? address.state : (_o = userFromDB === null || userFromDB === void 0 ? void 0 : userFromDB.address) === null || _o === void 0 ? void 0 : _o.state,
                postalCode: address.postalCode
                    ? address.postalCode
                    : (_p = userFromDB === null || userFromDB === void 0 ? void 0 : userFromDB.address) === null || _p === void 0 ? void 0 : _p.postalCode,
                country: address.country
                    ? address.country
                    : (_q = userFromDB === null || userFromDB === void 0 ? void 0 : userFromDB.address) === null || _q === void 0 ? void 0 : _q.country,
                mobile: address.mobile
                    ? address.mobile
                    : (_r = userFromDB === null || userFromDB === void 0 ? void 0 : userFromDB.address) === null || _r === void 0 ? void 0 : _r.mobile,
            }
            : userFromDB === null || userFromDB === void 0 ? void 0 : userFromDB.address,
    }, {
        new: true,
    });
    if (!result) {
        throw new Error('Update failed');
    }
    const modifiedResult = {
        _id: result === null || result === void 0 ? void 0 : result._id,
        name: result === null || result === void 0 ? void 0 : result.name,
        email: result === null || result === void 0 ? void 0 : result.email,
        role: result === null || result === void 0 ? void 0 : result.role,
        profileImage: result === null || result === void 0 ? void 0 : result.profileImage,
        isBlocked: result === null || result === void 0 ? void 0 : result.isBlocked,
        address: result === null || result === void 0 ? void 0 : result.address,
    };
    return modifiedResult;
});
// get user by email
const getuserFromDBByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    if (!email) {
        throw new Error('Email is required');
    }
    else {
        const userFromDB = yield auth_model_1.UserModel.findOne({
            email,
        });
        const modifiedUser = {
            _id: userFromDB === null || userFromDB === void 0 ? void 0 : userFromDB._id,
            name: userFromDB === null || userFromDB === void 0 ? void 0 : userFromDB.name,
            email: userFromDB === null || userFromDB === void 0 ? void 0 : userFromDB.email,
            role: userFromDB === null || userFromDB === void 0 ? void 0 : userFromDB.role,
            profileImage: userFromDB === null || userFromDB === void 0 ? void 0 : userFromDB.profileImage,
            isEmailVerified: userFromDB === null || userFromDB === void 0 ? void 0 : userFromDB.isEmailVerified,
            isBlocked: userFromDB === null || userFromDB === void 0 ? void 0 : userFromDB.isBlocked,
            address: userFromDB === null || userFromDB === void 0 ? void 0 : userFromDB.address,
        };
        return modifiedUser;
    }
});
//logout user from db
const logoutUserInDB = (token) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Token is required');
    }
    // checking token is valid or not
    let decodedUser;
    try {
        decodedUser = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
    }
    catch (error) {
        throw new jsonwebtoken_1.JsonWebTokenError('Unauthorized Access!');
    }
    const { email } = decodedUser;
    // checking if the user exists
    const user = yield auth_model_1.UserModel.findOne({ email });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Unauthorized Access!');
    }
    return true;
});
// get admin dashboard overview data
const getAdminDashboardOverviewDataFromDB = (decodedUser) => __awaiter(void 0, void 0, void 0, function* () {
    var _s, _t;
    const { role } = decodedUser;
    if (role !== 'admin') {
        throw new Error('Unauthorized Access');
    }
    const totalUsersOfGizmobuy = yield auth_model_1.UserModel.find();
    const totalAdminsOfGizmobuy = yield auth_model_1.UserModel.find({ role: 'admin' });
    const totalVendorsOfGizmobuy = yield auth_model_1.UserModel.find({ role: 'vendor' });
    const totalCustomersOfGizmobuy = yield auth_model_1.UserModel.find({ role: 'customer' });
    const totalProductsOfGizmobuy = yield product_model_1.ProductModel.find();
    const totalOrdersOfGizmobuy = yield order_model_1.OrderModel.find({
        isPaid: true,
    });
    // get total sell by all vendors of gizmobuy (only paid orders)
    const totalSellByAllVendors = yield order_model_1.OrderModel.aggregate([
        {
            $match: {
                isPaid: true,
            },
        },
        {
            $group: {
                _id: null,
                totalRevenue: {
                    $sum: '$totalBill',
                },
            },
        },
    ]);
    return {
        totalUsers: totalUsersOfGizmobuy.length,
        totalAdmin: totalAdminsOfGizmobuy.length,
        totalVendor: totalVendorsOfGizmobuy.length,
        totalCustomer: totalCustomersOfGizmobuy.length,
        totalProduct: totalProductsOfGizmobuy.length,
        totalOrders: totalOrdersOfGizmobuy.length,
        totalSellByAllVendors: (_s = totalSellByAllVendors[0]) === null || _s === void 0 ? void 0 : _s.totalRevenue,
        totalProfitOfGizmobuy: +((((_t = totalSellByAllVendors[0]) === null || _t === void 0 ? void 0 : _t.totalRevenue) * 5) /
            100).toFixed(2),
    };
});
// get vendor dashboard overview data
const getVendorDashboardOverviewDataFromDB = (decodedUser) => __awaiter(void 0, void 0, void 0, function* () {
    const { role, email } = decodedUser;
    if (role !== 'vendor') {
        throw new Error('Unauthorized Access');
    }
    const vendor = yield auth_model_1.UserModel.findOne({ email });
    if (!vendor) {
        throw new Error('Vendor not found');
    }
    // find how many products the vendor has
    const products = yield product_model_1.ProductModel.find();
    const totalProductsOfThisVendor = products.filter((product) => product.vendor === email);
    const joinDate = vendor === null || vendor === void 0 ? void 0 : vendor.createdAt.toDateString();
    return {
        joined: joinDate,
        totalProductsOfThisVendor: totalProductsOfThisVendor.length,
    };
});
// get customer dashboard overview data
const getCustomerDashboardOverviewDataFromDB = (decodedUser) => __awaiter(void 0, void 0, void 0, function* () {
    var _u;
    const { role, email } = decodedUser;
    if (role !== 'customer') {
        throw new Error('Unauthorized Access');
    }
    const customer = yield auth_model_1.UserModel.findOne({ email });
    if (!customer) {
        throw new Error('Customer not found');
    }
    const completedOrder = yield order_model_1.OrderModel.find({
        orderBy: email,
        orderStatus: 'delivered',
    });
    const pendingOrder = yield order_model_1.OrderModel.find({
        orderBy: email,
        orderStatus: 'processing',
    });
    const totalBillPaid = yield order_model_1.OrderModel.aggregate([
        {
            $match: {
                orderBy: email,
                isPaid: true,
            },
        },
        {
            $group: {
                _id: null,
                totalBillPaid: { $sum: '$totalBill' },
            },
        },
    ]);
    return {
        pendingOrder: pendingOrder.length,
        completedOrder: completedOrder.length,
        totalBillPaid: ((_u = totalBillPaid[0]) === null || _u === void 0 ? void 0 : _u.totalBillPaid) || 0,
    };
});
// get all vendors for admin to manage
const getAllVendorsFromDB = (decodedUser, req) => __awaiter(void 0, void 0, void 0, function* () {
    const { role } = decodedUser;
    if (role !== 'admin') {
        throw new Error('Unauthorized Access');
    }
    const { page, limit, search } = req === null || req === void 0 ? void 0 : req.query;
    const totalDocs = yield auth_model_1.UserModel.countDocuments({
        role: 'vendor',
    });
    const meta = {
        page: Number(page) || 1,
        limit: Number(limit) || 10,
        total: totalDocs,
    };
    //implement pagination
    const pageToBeFetched = Number(page) || 1;
    const limitToBeFetched = Number(limit) || 5;
    const skip = (pageToBeFetched - 1) * limitToBeFetched;
    // search by name or email
    const filter = {};
    filter.role = 'vendor';
    if (search) {
        filter.$or = [
            { name: new RegExp(String(search), 'i') },
            { email: new RegExp(String(search), 'i') },
        ];
    }
    const result = yield auth_model_1.UserModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitToBeFetched);
    return {
        meta,
        data: result === null || result === void 0 ? void 0 : result.map((vendor) => {
            return {
                _id: vendor._id,
                name: vendor.name,
                email: vendor.email,
                profileImage: vendor.profileImage,
                isEmailVerified: vendor.isEmailVerified,
                isBlocked: vendor.isBlocked,
                address: vendor.address,
                role: vendor.role,
            };
        }),
    };
});
// get all customers for admin to manage
const getAllCustomersFromDB = (decodedUser, req) => __awaiter(void 0, void 0, void 0, function* () {
    const { role } = decodedUser;
    if (role !== 'admin') {
        throw new Error('Unauthorized Access');
    }
    const { page, limit, search } = req === null || req === void 0 ? void 0 : req.query;
    const pageToBeFetched = Number(page) || 1;
    const limitToBeFetched = Number(limit) || 10;
    const skip = (pageToBeFetched - 1) * limitToBeFetched;
    const filter = { role: 'customer' };
    if (search) {
        filter.$or = [
            { name: new RegExp(String(search), 'i') },
            { email: new RegExp(String(search), 'i') },
        ];
    }
    const totalDocs = yield auth_model_1.UserModel.countDocuments(filter);
    const meta = {
        page: pageToBeFetched,
        limit: limitToBeFetched,
        total: totalDocs,
    };
    const result = yield auth_model_1.UserModel.aggregate([
        { $match: filter },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limitToBeFetched },
        {
            $lookup: {
                from: 'orders',
                let: { userEmail: '$email' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$orderBy', '$$userEmail'] },
                                    { $eq: ['$isPaid', true] },
                                ],
                            },
                        },
                    },
                ],
                as: 'ordersData',
            },
        },
        {
            $project: {
                _id: 1,
                name: 1,
                profileImage: 1,
                email: 1,
                isEmailVerified: 1,
                isBlocked: 1,
                address: 1,
                role: 1,
                totalOrders: { $size: '$ordersData' },
                totalPaid: { $sum: '$ordersData.totalBill' },
            },
        },
    ]);
    return {
        meta,
        data: result.map((customer) => {
            return {
                _id: customer._id,
                name: customer.name,
                profileImage: customer.profileImage,
                email: customer.email,
                isEmailVerified: customer.isEmailVerified,
                isBlocked: customer.isBlocked,
                address: customer.address,
                role: customer.role,
                totalOrders: customer.totalOrders,
                totalPaid: customer.totalPaid,
            };
        }),
    };
});
// block or unblock a vendor or customer by admin
const blockOrUnblockUserInDB = (decodedUser, userId, block) => __awaiter(void 0, void 0, void 0, function* () {
    const { role } = decodedUser;
    if (role !== 'admin') {
        throw new Error('Unauthorized Access');
    }
    const user = yield auth_model_1.UserModel.findById({
        _id: new mongoose_1.default.Types.ObjectId(userId),
    });
    if (!user) {
        throw new Error('User not found');
    }
    const result = yield auth_model_1.UserModel.findByIdAndUpdate({ _id: new mongoose_1.default.Types.ObjectId(userId) }, { isBlocked: block }, { new: true });
    if (!result) {
        throw new Error('Something went wrong !');
    }
    return {
        message: block
            ? `${user === null || user === void 0 ? void 0 : user.role} is blocked now !`
            : `${user === null || user === void 0 ? void 0 : user.role} is unblocked now !`,
    };
});
exports.UserServices = {
    registerUserInDB,
    loginUserInDB,
    verifyToken,
    getAccessTokenByRefreshToken,
    changePasswordInDB,
    forgetPasswordInDB,
    resetForgottenPasswordInDB,
    updateUserProfileInDB,
    getuserFromDBByEmail,
    logoutUserInDB,
    getAdminDashboardOverviewDataFromDB,
    getVendorDashboardOverviewDataFromDB,
    getCustomerDashboardOverviewDataFromDB,
    getAllVendorsFromDB,
    getAllCustomersFromDB,
    blockOrUnblockUserInDB,
};
