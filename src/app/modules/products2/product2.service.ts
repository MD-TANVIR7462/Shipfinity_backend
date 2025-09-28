/* eslint-disable no-unused-vars */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { UserModel } from '../authentication/auth.model';
import { ProductModel2 } from './product2.model';




//get all products from DB
const getAllProductsFromDB = async (query: any) => {
  const {
    page,
    limit,
    search,
    sortBy,
    sortOrder,
    minPrice,
    maxPrice,
    brand,
    category,
  } = query;

  const totalDocs = await ProductModel2.countDocuments();

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
  const sortCheck: Record<string, 1 | -1> = {};

  if (sortBy && ['price'].includes(sortBy)) {
    sortCheck[sortBy] = sortOrder === 'desc' ? -1 : 1;
  }

  // filter
  const filter: Record<string, any> = {};

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

  filter.quantity  = { $gte: 1 };

  // fetch products
  const result = await ProductModel2.find(filter)
    .sort(sortCheck)
    .skip(skip)
    .limit(limitToBeFetched).select('type brand name category thumbImage');


  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to get courses');
  } else {
    return {
      meta,
      data: result,
    };
  }
};

// get single product from DB
const getSingleProductFromDB = async (id: string) => {
  const result = await ProductModel2.findById(id).populate('vendor');
  const vendor = result?.vendor;
  const vendorDetails = await UserModel.findOne({ email: vendor });

  const resultToBeReturned = {
    ...result?.toObject(),
    vendor: {
      name: vendorDetails?.name,
    },
  };

  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to get the product with this id',
    );
  } else {
    return resultToBeReturned;
  }
};


;

export const ProductServices = {

  getAllProductsFromDB,
  getSingleProductFromDB,
};
