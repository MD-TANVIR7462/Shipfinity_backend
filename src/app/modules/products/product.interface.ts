/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type TProduct = {
  _id: string;
  title: string;
  price: number;
  stock: number;
  reviews: string[];
  brand: string;
  category: string;
  photos: string[];
  displayImage: string;
  description: string;
  vendor: string;
  runningDiscount: number;
  releaseDate: string;
};

//for creating statics
export interface TProductModel extends Model<TProduct> {
  isProductExistsWithSameTitle(title: string): Promise<TProduct | null>;
}
