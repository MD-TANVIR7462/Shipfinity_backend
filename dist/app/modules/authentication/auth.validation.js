"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileSchema = exports.resetForgottenPasswordSchema = exports.forgotPasswordSchema = exports.changePasswordSchema = exports.loginSchema = exports.signupSchema = exports.userSchema = void 0;
const zod_1 = require("zod");
exports.userSchema = zod_1.z.object({
    name: zod_1.z.string({
        invalid_type_error: ' must be string',
        required_error: ' is required',
    }),
    email: zod_1.z.string({
        invalid_type_error: ' must be string',
        required_error: ' is required',
    }),
    isEmailVerified: zod_1.z.string({
        invalid_type_error: ' must be boolean',
        required_error: ' is required',
    }),
    password: zod_1.z.string({
        invalid_type_error: ' must be string',
        required_error: ' is required',
    }),
    role: zod_1.z.enum(['admin', 'vendor', 'customer'], {
        invalid_type_error: 'User must be either admin, vendor or customer',
        required_error: ' is required',
    }),
    lastTwoPasswords: zod_1.z
        .array(zod_1.z
        .object({
        oldPassword: zod_1.z
            .string({
            invalid_type_error: ' must be string',
            required_error: ' is required',
        })
            .optional(),
        changedAt: zod_1.z
            .date({
            invalid_type_error: ' must be a valid date',
            required_error: ' is required',
        })
            .optional(),
    })
        .optional())
        .optional(),
    profileImage: zod_1.z
        .string({
        invalid_type_error: ' must be string',
        required_error: ' is required',
    })
        .optional(),
    isBlocked: zod_1.z.boolean({
        invalid_type_error: ' must be boolean',
        required_error: ' is required',
    }),
    address: zod_1.z
        .object({
        address: zod_1.z.string({
            invalid_type_error: ' must be string',
        }),
        city: zod_1.z.string({
            invalid_type_error: ' must be string',
        }),
        state: zod_1.z.string({
            invalid_type_error: ' must be string',
        }),
        country: zod_1.z.string({
            invalid_type_error: ' must be string',
        }),
        postalCode: zod_1.z.string({
            invalid_type_error: ' must be string',
        }),
        mobile: zod_1.z.string({
            invalid_type_error: ' must be string',
        }),
    })
        .optional(),
});
exports.signupSchema = zod_1.z.object({
    name: zod_1.z.string({
        invalid_type_error: ' must be string',
        required_error: ' is required',
    }),
    email: zod_1.z.string({
        invalid_type_error: ' must be string',
        required_error: ' is required',
    }),
    password: zod_1.z.string({
        invalid_type_error: ' must be string',
        required_error: ' is required',
    }),
    role: zod_1.z.enum(['admin', 'vendor', 'customer'], {
        invalid_type_error: 'User must be either admin, vendor or customer',
        required_error: ' is required',
    }),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string({
        invalid_type_error: ' must be string',
        required_error: ' is required',
    }),
    password: zod_1.z.string({
        invalid_type_error: ' must be string',
        required_error: ' is required',
    }),
});
exports.changePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string({
        invalid_type_error: ' must be string',
        required_error: ' is required',
    }),
    newPassword: zod_1.z.string({
        invalid_type_error: ' must be string',
        required_error: ' is required',
    }),
});
exports.forgotPasswordSchema = zod_1.z.object({
    userEmail: zod_1.z.string({
        invalid_type_error: ' must be string',
        required_error: ' is required',
    }),
});
exports.resetForgottenPasswordSchema = zod_1.z.object({
    userEmail: zod_1.z.string({
        invalid_type_error: ' must be string',
        required_error: ' is required',
    }),
    newPassword: zod_1.z.string({
        invalid_type_error: ' must be string',
        required_error: ' is required',
    }),
});
exports.updateProfileSchema = zod_1.z.object({
    name: zod_1.z
        .string({
        invalid_type_error: ' must be string',
        required_error: ' is required',
    })
        .optional(),
    profileImage: zod_1.z
        .string({
        invalid_type_error: ' must be string',
        required_error: ' is required',
    })
        .optional(),
    isBlocked: zod_1.z
        .boolean({
        invalid_type_error: ' must be boolean',
        required_error: ' is required',
    })
        .optional(),
    address: zod_1.z
        .object({
        address: zod_1.z
            .string({
            invalid_type_error: ' must be string',
        })
            .optional(),
        city: zod_1.z
            .string({
            invalid_type_error: ' must be string',
        })
            .optional(),
        state: zod_1.z
            .string({
            invalid_type_error: ' must be string',
        })
            .optional(),
        country: zod_1.z
            .string({
            invalid_type_error: ' must be string',
        })
            .optional(),
        postalCode: zod_1.z
            .string({
            invalid_type_error: ' must be string',
        })
            .optional(),
        mobile: zod_1.z
            .string({
            invalid_type_error: ' must be string',
        })
            .optional(),
    })
        .optional(),
});
