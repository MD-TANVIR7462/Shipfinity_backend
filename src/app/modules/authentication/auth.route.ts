import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserControllers } from './auth.controller';
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  resetForgottenPasswordSchema,
  signupSchema,
  updateProfileSchema,
} from './auth.validation';

const router = express.Router();

router.get('/get-profile', UserControllers.getUserProfile);
router.post('/logout', UserControllers.logoutUser);

router.post(
  '/register',
  validateRequest(signupSchema),
  UserControllers.registerUser,
);

router.post('/login', validateRequest(loginSchema), UserControllers.loginUser);

router.post(
  '/change-password',
  validateRequest(changePasswordSchema),
  UserControllers.changePassword,
);

// router.post(
//   '/forgot-password',
//   validateRequest(forgotPasswordSchema),
//   UserControllers.forgotPassword,
// );

router.post(
  '/reset-forgotten-password',
  validateRequest(resetForgottenPasswordSchema),
  UserControllers.resetForgottenPassword,
);

router.put(
  '/update-profile',
  validateRequest(updateProfileSchema),
  UserControllers.updateUserProfile,
);

router.post('/verify-token', UserControllers.verifyToken);

router.post('/refresh-token', UserControllers.getAccessTokenUsingRefreshToken);

//get admin, customer and vendor overview data
router.get(
  '/getadminoverviewdata',
  auth('admin'),
  UserControllers.getAdminDashboardOverviewData,
);
router.get(
  '/getvendoroverviewdata',
  auth('vendor'),
  UserControllers.getVendorDashboardOverviewData,
);
router.get(
  '/getcustomeroverviewdata',
  auth('customer'),
  UserControllers.getCustomerDashboardOverviewData,
);

// get all vendors for admin
router.get(
  '/getallvendors',
  auth('admin'),
  UserControllers.getAllVendorsForAdmin,
);

// get all customers for admin
router.get(
  '/getallcustomers',
  auth('admin'),
  UserControllers.getAllCustomersForAdmin,
);

// block or unblock user by admin
router.put(
  '/blockorunblockuser',
  auth('admin'),
  UserControllers.blockOrUnblockUserByAdmin,
);

export const AuthRoutes = router;
