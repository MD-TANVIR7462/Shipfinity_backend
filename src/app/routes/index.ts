import { Router } from 'express';
import { AuthRoutes } from '../modules/authentication/auth.route';
import { OrderRoutes } from '../modules/orders/order.route';
import { ProductRoutes } from '../modules/products/product.route';

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
    path: '/orders',
    route: OrderRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
