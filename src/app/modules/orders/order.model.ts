import { Schema, model } from 'mongoose';
import { TOrder } from './order.interface';

const orderSchema = new Schema<TOrder>(
  {
    orderId: {
      type: String,
      required: true,
    },
    products: [
      {
        id: {
          type: String,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        billForThisProduct: {
          type: Number,
          required: true,
        },
      },
    ],
    orderBy: {
      type: String,
      required: true,
    },
    shippingInfo: {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
      mobile: {
        type: String,
        required: true,
      },
    },
    paymentInfo: {
      method: {
        type: String,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
    },
    isPaid: {
      type: Boolean,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: {
        values: ['processing', 'delivered', 'cancelled'],
        message:
          '{VALUE} is not supported. Supported values are processing, delivered, cancelled.',
      },
      required: true,
    },
    billForThisOrder: {
      type: Number,
      required: true,
    },
    appliedCoupon: {
      type: String,
    },
    discountGiven: {
      type: Number,
    },
    totalBill: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const OrderModel = model<TOrder>('orders', orderSchema);
