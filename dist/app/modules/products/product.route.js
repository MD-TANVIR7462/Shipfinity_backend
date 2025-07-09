"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const product_controller_1 = require("./product.controller");
const product_validation_1 = require("./product.validation");
const router = express_1.default.Router();
// get all products for vendor dashboard
router.get('/manage-products', (0, auth_1.default)('vendor'), product_controller_1.ProductControllers.getAllProductsOfAVendorToManage);
//create product
router.post('/', (0, auth_1.default)('vendor'), (0, validateRequest_1.default)(product_validation_1.productValidationSchema), product_controller_1.ProductControllers.createProduct);
// update a single product
router.put('/:id', (0, auth_1.default)('vendor'), (0, validateRequest_1.default)(product_validation_1.productUpdateValidationSchema), product_controller_1.ProductControllers.updateProduct);
// delete a single product
router.delete('/:id', (0, auth_1.default)('vendor'), product_controller_1.ProductControllers.deleteProduct);
// get single product
router.get('/:id', product_controller_1.ProductControllers.getSingleProduct);
// get all products
router.get('/', product_controller_1.ProductControllers.getAllProducts);
exports.ProductRoutes = router;
