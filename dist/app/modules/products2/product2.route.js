"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRoutes2 = void 0;
const express_1 = __importDefault(require("express"));
const product2_controller_1 = require("./product2.controller");
const router = express_1.default.Router();
// get single product
router.get('/:id', product2_controller_1.ProductControllers.getSingleProduct);
// get all products
router.get('/', product2_controller_1.ProductControllers.getAllProducts);
exports.ProductRoutes2 = router;
