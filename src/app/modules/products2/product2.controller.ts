import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { ProductServices } from './product2.service';





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





export const ProductControllers = {

  getAllProducts,
  getSingleProduct,
 


};
