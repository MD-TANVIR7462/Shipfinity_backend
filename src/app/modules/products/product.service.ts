/* eslint-disable no-unused-vars */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TDecodedUser } from '../authentication/auth.interface';
import { UserModel } from '../authentication/auth.model';
import { TProduct } from './product.interface';
import { ProductModel } from './product.model';

//create product in DB
const createProductInDB = async (product: TProduct) => {
  if (product?.stock < 1) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Stock should be equal or greater than 1',
    );
  } else if (product?.price < 1) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Price should be equal or greater than 1',
    );
  }

  const result = await ProductModel.create(product);

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create course');
  } else {
    return result;
  }
};

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

  const totalDocs = await ProductModel.countDocuments();

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

  if (category !== 'all') {
    filter.category = new RegExp(category, 'i');
  } else if (category === 'all') {
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
  const result = await ProductModel.find(filter)
    .sort(sortCheck)
    .skip(skip)
    .limit(limitToBeFetched);

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
  const result = await ProductModel.findById(id).populate('vendor');
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

// get all products for vendor dashboard from DB
const getAllProductsForVendorFromDB = async (
  query: any,
  decodedUser: TDecodedUser,
) => {
  const { role, email } = decodedUser;
  const { page, limit, search } = query;

  if (role !== 'vendor') {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You are not authorized to access this route',
    );
  }

  const totalDocs = await ProductModel.countDocuments({
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
  const filter: Record<string, any> = {};
  filter.vendor = email;

  if (search) {
    filter.$or = [{ title: new RegExp(String(search), 'i') }];
  }

  const result = await ProductModel.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitToBeFetched);

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to get products');
  }

  return {
    meta,
    data: result,
  };
};

// delete a single product from DB
const deleteProductFromDB = async (id: string, decodedUser: TDecodedUser) => {
  const { role, email } = decodedUser;

  const product = await ProductModel.findById(id);

  if (!product) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to get the product with this id',
    );
  }

  if (
    email === 'demovendor@gmail.com' &&
    product?.releaseDate === '2023-01-01'
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Admin has set restrictions to delete this product to maintain integrity of the system. Please create your own product to test this feature.',
    );
  }

  if (role !== 'vendor') {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You are not authorized to access this. Please login as a vendor',
    );
  }

  if (product.vendor !== email) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You are not authorized to delete this product',
    );
  }

  const result = await ProductModel.findByIdAndDelete(id);

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete product');
  }

  return result;
};

// update a single product in DB
const updateProductInDB = async (
  decodedUser: TDecodedUser,
  id: string,
  product: TProduct,
) => {
  const { role, email } = decodedUser;

  const vendor = await UserModel.findOne({ email });

  if (!vendor) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to get vendor details and update product',
    );
  }

  if (role !== 'vendor') {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You are not authorized to access this. Please login as a vendor',
    );
  }

  const productToUpdate = await ProductModel.findById(id);

  if (!productToUpdate) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to get the product with this id',
    );
  }

  if (
    email === 'demovendor@gmail.com' &&
    productToUpdate?.releaseDate === '2023-01-01'
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Admin has set restrictions to update this product to maintain integrity of the system. Please create your own product to test this feature.',
    );
  }

  if (productToUpdate.vendor !== email) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You are not authorized to update this product',
    );
  }

  if (product?.stock < 1) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Stock should be equal or greater than 1',
    );
  } else if (product?.price < 1) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Price should be equal or greater than 1',
    );
  }
  const { title, price, stock, brand, category, displayImage, description } =
    product;

  const result = await ProductModel.findByIdAndUpdate(
    id,
    {
      title: title ? title : productToUpdate.title,
      price: price ? Number(price) : productToUpdate.price,
      stock: stock ? Number(stock) : productToUpdate.stock,
      brand: brand ? brand : productToUpdate.brand,
      category: category ? category : productToUpdate.category,
      displayImage: displayImage ? displayImage : productToUpdate.displayImage,
      description: description ? description : productToUpdate.description,
    },
    {
      new: true,
    },
  );

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update product');
  }

  return result;
};

export const ProductServices = {
  createProductInDB,
  getAllProductsFromDB,
  getSingleProductFromDB,
  getAllProductsForVendorFromDB,
  deleteProductFromDB,
  updateProductInDB,
};
