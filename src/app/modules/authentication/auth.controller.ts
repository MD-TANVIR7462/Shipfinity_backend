import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import config from '../../config';
import { TCustomErrorForRecentPasswordChange } from '../../interface/error';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TDecodedUser } from './auth.interface';
import { UserServices } from './auth.service';

//create user
const registerUser = catchAsync(async (req, res) => {
  const result = await UserServices.registerUserInDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User has been registered succesfully',
    data: result,
  });
});

//login user
const loginUser = catchAsync(async (req, res) => {
  const result = await UserServices.loginUserInDB(req.body);
  const { accesstoken, refreshfToken, userFromDB } = result;

  res.cookie('refreshfToken', refreshfToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User has been logged in succesfully',
    data: {
      user: {
        _id: userFromDB?._id,
        name: userFromDB?.name,
        email: userFromDB?.email,
        role: userFromDB?.role,
        isBlocked: userFromDB?.isBlocked,
      },
      token: accesstoken,
    },
  });
});

// verify token from client side
const verifyToken = catchAsync(async (req, res) => {
  const result = await UserServices.verifyToken(req.body.token);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Token verification completed!',
    data: result,
  });
});

//get access token using refresh token
const getAccessTokenUsingRefreshToken = catchAsync(async (req, res) => {
  const result = await UserServices.getAccessTokenByRefreshToken(
    req.cookies?.refreshfToken,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token retrieved succesfully!',
    data: result,
  });
});

//change password
const changePassword = catchAsync(async (req, res) => {
  const passwordData = req.body;
  const token = req?.headers?.authorization;
  const splittedToken = token?.split(' ')[1] as string;

  const decodedUser = jwt.verify(
    splittedToken,
    config.jwt_access_secret as string,
  );

  const result = await UserServices.changePasswordInDB(
    passwordData,
    decodedUser as TDecodedUser,
  );

  const { statusCode, message } = result as TCustomErrorForRecentPasswordChange;

  if (statusCode === 406 && message === 'Recent password change detected.') {
    sendResponse(res, {
      statusCode: httpStatus.NOT_ACCEPTABLE,
      success: false,
      message: 'Recent password change detected.',
      data: null,
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Password has been changed succesfully',
      data: result,
    });
  }
});

//forgot password
const forgotPassword = catchAsync(async (req, res) => {
  const { userEmail } = req.body;
  await UserServices.forgetPasswordInDB(userEmail);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password reset link has been sent to your email',
    data: null,
  });
});

// reset forgotten password
const resetForgottenPassword = catchAsync(async (req, res) => {
  const { newPassword, userEmail } = req.body;
  let token = req?.headers?.authorization;
  token = token?.split(' ')[1] as string;
  const result = await UserServices.resetForgottenPasswordInDB(
    userEmail,
    token,
    newPassword,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password has been reset succesfully',
    data: result,
  });
});

// update user profile
const updateUserProfile = catchAsync(async (req, res) => {
  const dataToBeUpdated = req.body;
  const token = req?.headers?.authorization;
  const splittedToken = token?.split(' ')[1] as string;

  const decodedUser = jwt.verify(
    splittedToken,
    config.jwt_access_secret as string,
  );

  const result = await UserServices.updateUserProfileInDB(
    decodedUser as TDecodedUser,
    dataToBeUpdated,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile has been updated succesfully',
    data: result,
  });
});

// get user profile
const getUserProfile = catchAsync(async (req, res) => {
  const token = req?.headers?.authorization;
  const splittedToken = token?.split(' ')[1] as string;

  const decodedUser = jwt.verify(
    splittedToken,
    config.jwt_access_secret as string,
  );

  const { email } = decodedUser as TDecodedUser;

  const result = await UserServices.getuserFromDBByEmail(email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile has been retrieved succesfully',
    data: result,
  });
});

// logout user
const logoutUser = catchAsync(async (req, res) => {
  res.clearCookie('refreshfToken', {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Logged out successfully!',
    data: null,
  });
});

// get admin dashboard overview data
const getAdminDashboardOverviewData = catchAsync(async (req, res) => {
  const token = req?.headers?.authorization;
  const splittedToken = token?.split(' ')[1] as string;

  const decodedUser = jwt.verify(
    splittedToken,
    config.jwt_access_secret as string,
  );

  const result = await UserServices.getAdminDashboardOverviewDataFromDB(
    decodedUser as TDecodedUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin overview data has been retrieved succesfully',
    data: result,
  });
});

// get vendor dashboard overview data
const getVendorDashboardOverviewData = catchAsync(async (req, res) => {
  const token = req?.headers?.authorization;
  const splittedToken = token?.split(' ')[1] as string;

  const decodedUser = jwt.verify(
    splittedToken,
    config.jwt_access_secret as string,
  );

  const result = await UserServices.getVendorDashboardOverviewDataFromDB(
    decodedUser as TDecodedUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Vendor overview data has been retrieved succesfully',
    data: result,
  });
});

// get customer dashboard overview data
const getCustomerDashboardOverviewData = catchAsync(async (req, res) => {
  const token = req?.headers?.authorization;
  const splittedToken = token?.split(' ')[1] as string;

  const decodedUser = jwt.verify(
    splittedToken,
    config.jwt_access_secret as string,
  );

  const result = await UserServices.getCustomerDashboardOverviewDataFromDB(
    decodedUser as TDecodedUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Customer overview data has been retrieved succesfully',
    data: result,
  });
});

// get all vendors for admin
const getAllVendorsForAdmin = catchAsync(async (req, res) => {
  const token = req?.headers?.authorization;
  const splittedToken = token?.split(' ')[1] as string;

  const decodedUser = jwt.verify(
    splittedToken,
    config.jwt_access_secret as string,
  );

  const result = await UserServices.getAllVendorsFromDB(
    decodedUser as TDecodedUser,
    req,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All vendors have been retrieved succesfully',
    data: result,
  });
});

// get all customers for admin
const getAllCustomersForAdmin = catchAsync(async (req, res) => {
  const token = req?.headers?.authorization;
  const splittedToken = token?.split(' ')[1] as string;

  const decodedUser = jwt.verify(
    splittedToken,
    config.jwt_access_secret as string,
  );

  const result = await UserServices.getAllCustomersFromDB(
    decodedUser as TDecodedUser,
    req,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All customers have been retrieved succesfully',
    data: result,
  });
});

// block or unblock user by admin
const blockOrUnblockUserByAdmin = catchAsync(async (req, res) => {
  const token = req?.headers?.authorization;
  const splittedToken = token?.split(' ')[1] as string;

  const decodedUser = jwt.verify(
    splittedToken,
    config.jwt_access_secret as string,
  );

  const { id, block } = req.body;

  const result = await UserServices.blockOrUnblockUserInDB(
    decodedUser as TDecodedUser,
    id,
    block,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User has been blocked/unblocked succesfully',
    data: result,
  });
});

export const UserControllers = {
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
