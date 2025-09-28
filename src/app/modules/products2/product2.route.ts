import express from 'express';
import auth from '../../middlewares/auth';
import { ProductControllers } from './product2.controller';

const router = express.Router();





// get single product
router.get('/:id', ProductControllers.getSingleProduct);

// get all products
router.get('/', ProductControllers.getAllProducts);

export const ProductRoutes2 = router;
