import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ProductControllers } from './product.controller';
import {
  productUpdateValidationSchema,
  productValidationSchema,
} from './product.validation';

const router = express.Router();

// get all products for vendor dashboard
router.get(
  '/manage-products',
  auth('vendor'),
  ProductControllers.getAllProductsOfAVendorToManage,
);

//create product
router.post(
  '/',
  auth('vendor'),
  validateRequest(productValidationSchema),
  ProductControllers.createProduct,
);

// update a single product
router.put(
  '/:id',
  auth('vendor'),
  validateRequest(productUpdateValidationSchema),
  ProductControllers.updateProduct,
);

// delete a single product
router.delete('/:id', auth('vendor'), ProductControllers.deleteProduct);

// get single product
router.get('/:id', ProductControllers.getSingleProduct);

// get all products
router.get('/', ProductControllers.getAllProducts);

export const ProductRoutes = router;
