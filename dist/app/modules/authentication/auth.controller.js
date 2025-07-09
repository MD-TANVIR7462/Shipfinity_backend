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
exports.UserControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const auth_service_1 = require("./auth.service");
//create user
const registerUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.UserServices.registerUserInDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'User has been registered succesfully',
        data: result,
    });
}));
//login user
const loginUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.UserServices.loginUserInDB(req.body);
    const { accesstoken, refreshfToken, userFromDB } = result;
    res.cookie('refreshfToken', refreshfToken, {
        secure: config_1.default.NODE_ENV === 'production',
        httpOnly: true,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User has been logged in succesfully',
        data: {
            user: {
                _id: userFromDB === null || userFromDB === void 0 ? void 0 : userFromDB._id,
                name: userFromDB === null || userFromDB === void 0 ? void 0 : userFromDB.name,
                email: userFromDB === null || userFromDB === void 0 ? void 0 : userFromDB.email,
                role: userFromDB === null || userFromDB === void 0 ? void 0 : userFromDB.role,
                isBlocked: userFromDB === null || userFromDB === void 0 ? void 0 : userFromDB.isBlocked,
            },
            token: accesstoken,
        },
    });
}));
// verify token from client side
const verifyToken = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.UserServices.verifyToken(req.body.token);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Token verification completed!',
        data: result,
    });
}));
//get access token using refresh token
const getAccessTokenUsingRefreshToken = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield auth_service_1.UserServices.getAccessTokenByRefreshToken((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshfToken);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Access token retrieved succesfully!',
        data: result,
    });
}));
//change password
const changePassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const passwordData = req.body;
    const token = (_b = req === null || req === void 0 ? void 0 : req.headers) === null || _b === void 0 ? void 0 : _b.authorization;
    const splittedToken = token === null || token === void 0 ? void 0 : token.split(' ')[1];
    const decodedUser = jsonwebtoken_1.default.verify(splittedToken, config_1.default.jwt_access_secret);
    const result = yield auth_service_1.UserServices.changePasswordInDB(passwordData, decodedUser);
    const { statusCode, message } = result;
    if (statusCode === 406 && message === 'Recent password change detected.') {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.NOT_ACCEPTABLE,
            success: false,
            message: 'Recent password change detected.',
            data: null,
        });
    }
    else {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Password has been changed succesfully',
            data: result,
        });
    }
}));
//forgot password
const forgotPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userEmail } = req.body;
    yield auth_service_1.UserServices.forgetPasswordInDB(userEmail);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Password reset link has been sent to your email',
        data: null,
    });
}));
// reset forgotten password
const resetForgottenPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const { newPassword, userEmail } = req.body;
    let token = (_c = req === null || req === void 0 ? void 0 : req.headers) === null || _c === void 0 ? void 0 : _c.authorization;
    token = token === null || token === void 0 ? void 0 : token.split(' ')[1];
    const result = yield auth_service_1.UserServices.resetForgottenPasswordInDB(userEmail, token, newPassword);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Password has been reset succesfully',
        data: result,
    });
}));
// update user profile
const updateUserProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const dataToBeUpdated = req.body;
    const token = (_d = req === null || req === void 0 ? void 0 : req.headers) === null || _d === void 0 ? void 0 : _d.authorization;
    const splittedToken = token === null || token === void 0 ? void 0 : token.split(' ')[1];
    const decodedUser = jsonwebtoken_1.default.verify(splittedToken, config_1.default.jwt_access_secret);
    const result = yield auth_service_1.UserServices.updateUserProfileInDB(decodedUser, dataToBeUpdated);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Profile has been updated succesfully',
        data: result,
    });
}));
// get user profile
const getUserProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    const token = (_e = req === null || req === void 0 ? void 0 : req.headers) === null || _e === void 0 ? void 0 : _e.authorization;
    const splittedToken = token === null || token === void 0 ? void 0 : token.split(' ')[1];
    const decodedUser = jsonwebtoken_1.default.verify(splittedToken, config_1.default.jwt_access_secret);
    const { email } = decodedUser;
    const result = yield auth_service_1.UserServices.getuserFromDBByEmail(email);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Profile has been retrieved succesfully',
        data: result,
    });
}));
// logout user
const logoutUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie('refreshfToken', {
        secure: config_1.default.NODE_ENV === 'production',
        httpOnly: true,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Logged out successfully!',
        data: null,
    });
}));
// get admin dashboard overview data
const getAdminDashboardOverviewData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    const token = (_f = req === null || req === void 0 ? void 0 : req.headers) === null || _f === void 0 ? void 0 : _f.authorization;
    const splittedToken = token === null || token === void 0 ? void 0 : token.split(' ')[1];
    const decodedUser = jsonwebtoken_1.default.verify(splittedToken, config_1.default.jwt_access_secret);
    const result = yield auth_service_1.UserServices.getAdminDashboardOverviewDataFromDB(decodedUser);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Admin overview data has been retrieved succesfully',
        data: result,
    });
}));
// get vendor dashboard overview data
const getVendorDashboardOverviewData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _g;
    const token = (_g = req === null || req === void 0 ? void 0 : req.headers) === null || _g === void 0 ? void 0 : _g.authorization;
    const splittedToken = token === null || token === void 0 ? void 0 : token.split(' ')[1];
    const decodedUser = jsonwebtoken_1.default.verify(splittedToken, config_1.default.jwt_access_secret);
    const result = yield auth_service_1.UserServices.getVendorDashboardOverviewDataFromDB(decodedUser);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Vendor overview data has been retrieved succesfully',
        data: result,
    });
}));
// get customer dashboard overview data
const getCustomerDashboardOverviewData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _h;
    const token = (_h = req === null || req === void 0 ? void 0 : req.headers) === null || _h === void 0 ? void 0 : _h.authorization;
    const splittedToken = token === null || token === void 0 ? void 0 : token.split(' ')[1];
    const decodedUser = jsonwebtoken_1.default.verify(splittedToken, config_1.default.jwt_access_secret);
    const result = yield auth_service_1.UserServices.getCustomerDashboardOverviewDataFromDB(decodedUser);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Customer overview data has been retrieved succesfully',
        data: result,
    });
}));
// get all vendors for admin
const getAllVendorsForAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _j;
    const token = (_j = req === null || req === void 0 ? void 0 : req.headers) === null || _j === void 0 ? void 0 : _j.authorization;
    const splittedToken = token === null || token === void 0 ? void 0 : token.split(' ')[1];
    const decodedUser = jsonwebtoken_1.default.verify(splittedToken, config_1.default.jwt_access_secret);
    const result = yield auth_service_1.UserServices.getAllVendorsFromDB(decodedUser, req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'All vendors have been retrieved succesfully',
        data: result,
    });
}));
// get all customers for admin
const getAllCustomersForAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _k;
    const token = (_k = req === null || req === void 0 ? void 0 : req.headers) === null || _k === void 0 ? void 0 : _k.authorization;
    const splittedToken = token === null || token === void 0 ? void 0 : token.split(' ')[1];
    const decodedUser = jsonwebtoken_1.default.verify(splittedToken, config_1.default.jwt_access_secret);
    const result = yield auth_service_1.UserServices.getAllCustomersFromDB(decodedUser, req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'All customers have been retrieved succesfully',
        data: result,
    });
}));
// block or unblock user by admin
const blockOrUnblockUserByAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _l;
    const token = (_l = req === null || req === void 0 ? void 0 : req.headers) === null || _l === void 0 ? void 0 : _l.authorization;
    const splittedToken = token === null || token === void 0 ? void 0 : token.split(' ')[1];
    const decodedUser = jsonwebtoken_1.default.verify(splittedToken, config_1.default.jwt_access_secret);
    const { id, block } = req.body;
    const result = yield auth_service_1.UserServices.blockOrUnblockUserInDB(decodedUser, id, block);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User has been blocked/unblocked succesfully',
        data: result,
    });
}));
exports.UserControllers = {
    registerUser,
    loginUser,
    verifyToken,
    getAccessTokenUsingRefreshToken,
    changePassword,
    forgotPassword,
    resetForgottenPassword,
    updateUserProfile,
    getUserProfile,
    logoutUser,
    getAdminDashboardOverviewData,
    getVendorDashboardOverviewData,
    getCustomerDashboardOverviewData,
    getAllVendorsForAdmin,
    getAllCustomersForAdmin,
    blockOrUnblockUserByAdmin,
};
