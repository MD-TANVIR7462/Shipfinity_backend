import { z } from 'zod';

export const orderValidationSchema = z.object({
  orderId: z.string({
    invalid_type_error: ' must be string',
    required_error: ' is required',
  }),
  products: z.array(
    z.object({
      id: z.string({
        invalid_type_error: ' must be string',
        required_error: ' is required',
      }),
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
      quantity: z
        .number({
          invalid_type_error: ' must be number',
          required_error: ' is required',
        })
        .min(1, ' must be at least 0'),
      billForThisProduct: z
        .number({
          invalid_type_error: ' must be number',
          required_error: ' is required',
        })
        .min(1, ' must be at least 0'),
    }),
  ),
  customerName: z.string({
    invalid_type_error: ' must be string',
    required_error: ' is required',
  }),
  orderBy: z.string({
    invalid_type_error: ' must be string',
    required_error: ' is required',
  }),
  shippingInfo: z.object({
    address: z.string({
      invalid_type_error: ' must be string',
      required_error: ' is required',
    }),
    city: z.string({
      invalid_type_error: ' must be string',
      required_error: ' is required',
    }),
    state: z.string({
      invalid_type_error: ' must be string',
      required_error: ' is required',
    }),
    country: z.string({
      invalid_type_error: ' must be string',
      required_error: ' is required',
    }),
    postalCode: z.string({
      invalid_type_error: ' must be string',
      required_error: ' is required',
    }),
    mobile: z.string({
      invalid_type_error: ' must be string',
      required_error: ' is required',
    }),
  }),
  paymentInfo: z.object({
    method: z.string({
      invalid_type_error: ' must be string',
      required_error: ' is required',
    }),
    amount: z
      .number({
        invalid_type_error: ' must be number',
        required_error: ' is required',
      })
      .min(1, ' must be at least 1'),
  }),
  isPaid: z.boolean({
    invalid_type_error: ' must be boolean',
    required_error: ' is required',
  }),
  orderStatus: z.enum(['processing', 'delivered', 'cancelled'], {
    invalid_type_error: ' must be one of processing, delivered or cancelled',
    required_error: ' is required',
  }),
  billForThisOrder: z.number({
    invalid_type_error: ' must be number',
    required_error: ' is required',
  }),
  appliedCoupon: z.string({
    invalid_type_error: ' must be string',
    required_error: ' is required',
  }),
  discountGiven: z.number({
    invalid_type_error: ' must be number',
    required_error: ' is required',
  }),
  totalBill: z.number({
    invalid_type_error: ' must be number',
    required_error: ' is required',
  }),
});

export const orderUpdateValidationSchema = z.object({
  orderStatus: z.enum(['processing', 'delivered', 'cancelled'], {
    invalid_type_error: ' must be one of processing, delivered or cancelled',
    required_error: ' is required',
  }),
});
