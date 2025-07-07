import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TDecodedUser } from '../authentication/auth.interface';
import { ProductServices } from './product.service';

//create product
const createProduct = catchAsync(async (req, res) => {
  const result = await ProductServices.createProductInDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Product has been created succesfully',
    data: result,
  });
});

//get all products
const getAllProducts = catchAsync(async (req, res) => {
  const result = await ProductServices.getAllProductsFromDB(req.query);

  res.status(200).json({
    statusCode: httpStatus.OK,
    success: true,
    message: 'All products fetched successfully',
    data: result,
  });
});

// get single product
const getSingleProduct = catchAsync(async (req, res) => {
  const result = await ProductServices.getSingleProductFromDB(req.params?.id);

  res.status(200).json({
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product fetched successfully',
    data: result,
  });
});

// get all products for vendor dashboard
const getAllProductsOfAVendorToManage = catchAsync(async (req, res) => {
  const token = req?.headers?.authorization;
  const splittedToken = token?.split(' ')[1] as string;

  const decodedUser = jwt.verify(
    splittedToken,
    config.jwt_access_secret as string,
  );

  const result = await ProductServices.getAllProductsForVendorFromDB(
    req?.query,
    decodedUser as TDecodedUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All products fetched successfully for vendor dashboard',
    data: result,
  });
});

// delete a single product
const deleteProduct = catchAsync(async (req, res) => {
  const token = req?.headers?.authorization;
  const splittedToken = token?.split(' ')[1] as string;

  const decodedUser = jwt.verify(
    splittedToken,
    config.jwt_access_secret as string,
  );

  const result = await ProductServices.deleteProductFromDB(
    req.params?.id,
    decodedUser as TDecodedUser,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product has been deleted successfully',
    data: result,
  });
});

// update a single product
const updateProduct = catchAsync(async (req, res) => {
  const token = req?.headers?.authorization;
  const splittedToken = token?.split(' ')[1] as string;

  const decodedUser = jwt.verify(
    splittedToken,
    config.jwt_access_secret as string,
  );

  const result = await ProductServices.updateProductInDB(
    decodedUser as TDecodedUser,
    req.params?.id,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product has been updated successfully',
    data: result,
  });
});

export const ProductControllers = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  getAllProductsOfAVendorToManage,
  deleteProduct,
  updateProduct,
};
