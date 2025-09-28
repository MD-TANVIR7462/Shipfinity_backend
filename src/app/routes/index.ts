import { Router } from 'express';
import { AuthRoutes } from '../modules/authentication/auth.route';
import { OrderRoutes } from '../modules/orders/order.route';
import { ProductRoutes } from '../modules/products/product.route';
import { ProductRoutes2 } from '../modules/products2/product2.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/products',
    route: ProductRoutes,
  },
  {
    path: '/products2',
    route: ProductRoutes2,
  },
  {
    path: '/orders',
    route: OrderRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
