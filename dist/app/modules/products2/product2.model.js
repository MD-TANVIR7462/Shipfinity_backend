"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel2 = void 0;
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 255,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
    },
    reviews: {
        type: [String],
        default: [],
    },
    brand: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: {
            values: [
                'desktop',
                'laptop',
                'smartphone',
                'watch',
                'headphone',
                'fashion',
                'accessories',
            ],
            message: '{VALUE} is not a valid category. Choose either desktop, laptop, smartphone, watch, headphone, fashion, or accessories',
        },
        required: true,
    },
    photos: {
        type: [String],
        required: true,
    },
    displayImage: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
        minlength: 200,
        maxlength: 800,
    },
    vendor: {
        type: String,
        required: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Vendor email is not valid',
        ],
    },
    runningDiscount: {
        type: Number,
        default: 0,
    },
    releaseDate: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
//checking if the product really exists or not with the same name
productSchema.statics.isProductExistsWithSameTitle = function (title) {
    return __awaiter(this, void 0, void 0, function* () {
        const product = yield this.findOne({ title: title });
        return !!product;
    });
};
exports.ProductModel2 = (0, mongoose_1.model)('products2', productSchema);
