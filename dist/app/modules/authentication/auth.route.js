"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_controller_1 = require("./auth.controller");
const auth_validation_1 = require("./auth.validation");
const router = express_1.default.Router();
router.get('/get-profile', auth_controller_1.UserControllers.getUserProfile);
router.post('/logout', auth_controller_1.UserControllers.logoutUser);
router.post('/register', (0, validateRequest_1.default)(auth_validation_1.signupSchema), auth_controller_1.UserControllers.registerUser);
router.post('/login', (0, validateRequest_1.default)(auth_validation_1.loginSchema), auth_controller_1.UserControllers.loginUser);
router.post('/change-password', (0, validateRequest_1.default)(auth_validation_1.changePasswordSchema), auth_controller_1.UserControllers.changePassword);
// router.post(
//   '/forgot-password',
//   validateRequest(forgotPasswordSchema),
//   UserControllers.forgotPassword,
// );
router.post('/reset-forgotten-password', (0, validateRequest_1.default)(auth_validation_1.resetForgottenPasswordSchema), auth_controller_1.UserControllers.resetForgottenPassword);
router.put('/update-profile', (0, validateRequest_1.default)(auth_validation_1.updateProfileSchema), auth_controller_1.UserControllers.updateUserProfile);
router.post('/verify-token', auth_controller_1.UserControllers.verifyToken);
router.post('/refresh-token', auth_controller_1.UserControllers.getAccessTokenUsingRefreshToken);
//get admin, customer and vendor overview data
router.get('/getadminoverviewdata', (0, auth_1.default)('admin'), auth_controller_1.UserControllers.getAdminDashboardOverviewData);
router.get('/getvendoroverviewdata', (0, auth_1.default)('vendor'), auth_controller_1.UserControllers.getVendorDashboardOverviewData);
router.get('/getcustomeroverviewdata', (0, auth_1.default)('customer'), auth_controller_1.UserControllers.getCustomerDashboardOverviewData);
// get all vendors for admin
router.get('/getallvendors', (0, auth_1.default)('admin'), auth_controller_1.UserControllers.getAllVendorsForAdmin);
// get all customers for admin
router.get('/getallcustomers', (0, auth_1.default)('admin'), auth_controller_1.UserControllers.getAllCustomersForAdmin);
// block or unblock user by admin
router.put('/blockorunblockuser', (0, auth_1.default)('admin'), auth_controller_1.UserControllers.blockOrUnblockUserByAdmin);
exports.AuthRoutes = router;
