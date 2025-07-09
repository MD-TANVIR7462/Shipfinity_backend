"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderUpdateValidationSchema = exports.orderValidationSchema = void 0;
const zod_1 = require("zod");
exports.orderValidationSchema = zod_1.z.object({
    orderId: zod_1.z.string({
        invalid_type_error: ' must be string',
        required_error: ' is required',
    }),
    products: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string({
            invalid_type_error: ' must be string',
            required_error: ' is required',
        }),
        title: zod_1.z
            .string({
            invalid_type_error: ' must be string',
            required_error: ' is required',
        })
            .min(3, ' must be at least 3 characters')
            .max(255, ' must be at most 255 characters'),
        price: zod_1.z
            .number({
            invalid_type_error: ' must be number',
            required_error: ' is required',
        })
            .min(0, ' must be at least 0'),
        quantity: zod_1.z
            .number({
            invalid_type_error: ' must be number',
            required_error: ' is required',
        })
            .min(1, ' must be at least 0'),
        billForThisProduct: zod_1.z
            .number({
            invalid_type_error: ' must be number',
            required_error: ' is required',
        })
            .min(1, ' must be at least 0'),
    })),
    customerName: zod_1.z.string({
        invalid_type_error: ' must be string',
        required_error: ' is required',
    }),
    orderBy: zod_1.z.string({
        invalid_type_error: ' must be string',
        required_error: ' is required',
    }),
    shippingInfo: zod_1.z.object({
        address: zod_1.z.string({
            invalid_type_error: ' must be string',
            required_error: ' is required',
        }),
        city: zod_1.z.string({
            invalid_type_error: ' must be string',
            required_error: ' is required',
        }),
        state: zod_1.z.string({
            invalid_type_error: ' must be string',
            required_error: ' is required',
        }),
        country: zod_1.z.string({
            invalid_type_error: ' must be string',
            required_error: ' is required',
        }),
        postalCode: zod_1.z.string({
            invalid_type_error: ' must be string',
            required_error: ' is required',
        }),
        mobile: zod_1.z.string({
            invalid_type_error: ' must be string',
            required_error: ' is required',
        }),
    }),
    paymentInfo: zod_1.z.object({
        method: zod_1.z.string({
            invalid_type_error: ' must be string',
            required_error: ' is required',
        }),
        amount: zod_1.z
            .number({
            invalid_type_error: ' must be number',
            required_error: ' is required',
        })
            .min(1, ' must be at least 1'),
    }),
    isPaid: zod_1.z.boolean({
        invalid_type_error: ' must be boolean',
        required_error: ' is required',
    }),
    orderStatus: zod_1.z.enum(['processing', 'delivered', 'cancelled'], {
        invalid_type_error: ' must be one of processing, delivered or cancelled',
        required_error: ' is required',
    }),
    billForThisOrder: zod_1.z.number({
        invalid_type_error: ' must be number',
        required_error: ' is required',
    }),
    appliedCoupon: zod_1.z.string({
        invalid_type_error: ' must be string',
        required_error: ' is required',
    }),
    discountGiven: zod_1.z.number({
        invalid_type_error: ' must be number',
        required_error: ' is required',
    }),
    totalBill: zod_1.z.number({
        invalid_type_error: ' must be number',
        required_error: ' is required',
    }),
});
exports.orderUpdateValidationSchema = zod_1.z.object({
    orderStatus: zod_1.z.enum(['processing', 'delivered', 'cancelled'], {
        invalid_type_error: ' must be one of processing, delivered or cancelled',
        required_error: ' is required',
    }),
});
