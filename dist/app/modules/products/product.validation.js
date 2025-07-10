"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productUpdateValidationSchema = exports.productValidationSchema = void 0;
const zod_1 = require("zod");
exports.productValidationSchema = zod_1.z.object({
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
    stock: zod_1.z
        .number({
        invalid_type_error: ' must be number',
        required_error: ' is required',
    })
        .min(0, ' must be at least 0'),
    reviews: zod_1.z.array(zod_1.z.string({
        invalid_type_error: ' must be string',
        required_error: ' is required',
    })),
    brand: zod_1.z.string({
        invalid_type_error: ' must be string',
        required_error: ' is required',
    }),
    category: zod_1.z.string({
        invalid_type_error: ' must be string',
        required_error: ' is required',
    }),
    photos: zod_1.z.array(zod_1.z.string({
        invalid_type_error: ' must be string',
        required_error: ' is required',
    })),
    displayImage: zod_1.z.string({
        invalid_type_error: ' must be string',
        required_error: ' is required',
    }),
    description: zod_1.z
        .string({
        invalid_type_error: ' must be string',
        required_error: ' is required',
    })
        .min(400, ' must be at least 400 characters')
        .max(800, ' must be at most 800 characters'),
    vendor: zod_1.z.string({
        invalid_type_error: ' must be string',
        required_error: ' is required',
    }),
    runningDiscount: zod_1.z
        .number({
        invalid_type_error: ' must be number',
        required_error: ' is required',
    })
        .min(0, ' must be at least 0'),
    releaseDate: zod_1.z.string({
        invalid_type_error: ' must be string',
        required_error: ' is required',
    }),
});
exports.productUpdateValidationSchema = zod_1.z.object({
    title: zod_1.z
        .string({
        invalid_type_error: ' must be string',
        required_error: ' is required',
    })
        .min(3, ' must be at least 3 characters')
        .max(255, ' must be at most 255 characters')
        .optional(),
    price: zod_1.z
        .number({
        invalid_type_error: ' must be number',
        required_error: ' is required',
    })
        .min(0, ' must be at least 0')
        .optional(),
    stock: zod_1.z
        .number({
        invalid_type_error: ' must be number',
        required_error: ' is required',
    })
        .min(0, ' must be at least 0')
        .optional(),
    reviews: zod_1.z
        .array(zod_1.z.string({
        invalid_type_error: ' must be string',
        required_error: ' is required',
    }))
        .optional(),
    brand: zod_1.z
        .string({
        invalid_type_error: ' must be string',
        required_error: ' is required',
    })
        .optional(),
    category: zod_1.z
        .string({
        invalid_type_error: ' must be string',
        required_error: ' is required',
    })
        .optional(),
    photos: zod_1.z
        .array(zod_1.z.string({
        invalid_type_error: ' must be string',
        required_error: ' is required',
    }))
        .optional(),
    displayImage: zod_1.z
        .string({
        invalid_type_error: ' must be string',
        required_error: ' is required',
    })
        .optional(),
    description: zod_1.z
        .string({
        invalid_type_error: ' must be string',
        required_error: ' is required',
    })
        .min(400, ' must be at least 400 characters')
        .max(800, ' must be at most 800 characters')
        .optional(),
    vendor: zod_1.z
        .string({
        invalid_type_error: ' must be string',
        required_error: ' is required',
    })
        .optional(),
    runningDiscount: zod_1.z
        .number({
        invalid_type_error: ' must be number',
        required_error: ' is required',
    })
        .min(0, ' must be at least 0')
        .optional(),
    releaseDate: zod_1.z
        .string({
        invalid_type_error: ' must be string',
        required_error: ' is required',
    })
        .optional(),
});
