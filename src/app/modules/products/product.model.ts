import { Schema, model } from 'mongoose';
import { TProduct, TProductModel } from './product.interface';

const productSchema = new Schema<TProduct, TProductModel>(
  {
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
        message:
          '{VALUE} is not a valid category. Choose either desktop, laptop, smartphone, watch, headphone, fashion, or accessories',
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
  },
  {
    timestamps: true,
  },
);

//checking if the product really exists or not with the same name
productSchema.statics.isProductExistsWithSameTitle = async function (
  title: string,
) {
  const product = await this.findOne({ title: title });
  return !!product;
};

export const ProductModel = model<TProduct, TProductModel>(
  'products',
  productSchema,
);
