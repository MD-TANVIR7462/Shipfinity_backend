import { z } from 'zod';

export const productValidationSchema = z.object({
  title: z
    .string({
      invalid_type_error: ' must be string',
      required_error: ' is required',
    })
    .min(3, ' must be at least 3 characters')
    .max(255, ' must be at most 255 characters'),

  price: z
    .number({
      invalid_type_error: ' must be number',
      required_error: ' is required',
    })
    .min(0, ' must be at least 0'),

  stock: z
    .number({
      invalid_type_error: ' must be number',
      required_error: ' is required',
    })
    .min(0, ' must be at least 0'),

  reviews: z.array(
    z.string({
      invalid_type_error: ' must be string',
      required_error: ' is required',
    }),
  ),

  brand: z.string({
    invalid_type_error: ' must be string',
    required_error: ' is required',
  }),

  category: z.string({
    invalid_type_error: ' must be string',
    required_error: ' is required',
  }),

  photos: z.array(
    z.string({
      invalid_type_error: ' must be string',
      required_error: ' is required',
    }),
  ),

  displayImage: z.string({
    invalid_type_error: ' must be string',
    required_error: ' is required',
  }),

  description: z
    .string({
      invalid_type_error: ' must be string',
      required_error: ' is required',
    })
    .min(400, ' must be at least 400 characters')
    .max(800, ' must be at most 800 characters'),

  vendor: z.string({
    invalid_type_error: ' must be string',
    required_error: ' is required',
  }),

  runningDiscount: z
    .number({
      invalid_type_error: ' must be number',
      required_error: ' is required',
    })
    .min(0, ' must be at least 0'),

  releaseDate: z.string({
    invalid_type_error: ' must be string',
    required_error: ' is required',
  }),
});

export const productUpdateValidationSchema = z.object({
  title: z
    .string({
      invalid_type_error: ' must be string',
      required_error: ' is required',
    })
    .min(3, ' must be at least 3 characters')
    .max(255, ' must be at most 255 characters')
    .optional(),

  price: z
    .number({
      invalid_type_error: ' must be number',
      required_error: ' is required',
    })
    .min(0, ' must be at least 0')
    .optional(),

  stock: z
    .number({
      invalid_type_error: ' must be number',
      required_error: ' is required',
    })
    .min(0, ' must be at least 0')
    .optional(),

  reviews: z
    .array(
      z.string({
        invalid_type_error: ' must be string',
        required_error: ' is required',
      }),
    )
    .optional(),

  brand: z
    .string({
      invalid_type_error: ' must be string',
      required_error: ' is required',
    })
    .optional(),

  category: z
    .string({
      invalid_type_error: ' must be string',
      required_error: ' is required',
    })
    .optional(),

  photos: z
    .array(
      z.string({
        invalid_type_error: ' must be string',
        required_error: ' is required',
      }),
    )
    .optional(),

  displayImage: z
    .string({
      invalid_type_error: ' must be string',
      required_error: ' is required',
    })
    .optional(),

  description: z
    .string({
      invalid_type_error: ' must be string',
      required_error: ' is required',
    })
    .min(400, ' must be at least 400 characters')
    .max(800, ' must be at most 800 characters')
    .optional(),

  vendor: z
    .string({
      invalid_type_error: ' must be string',
      required_error: ' is required',
    })
    .optional(),

  runningDiscount: z
    .number({
      invalid_type_error: ' must be number',
      required_error: ' is required',
    })
    .min(0, ' must be at least 0')
    .optional(),

  releaseDate: z
    .string({
      invalid_type_error: ' must be string',
      required_error: ' is required',
    })
    .optional(),
});
