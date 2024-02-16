import { PRODUCT_STATUS_MAP } from '../constants/productStatus';
import { Logger } from './Logger';

export type ProductsArgs = {
  base_url: string;
  logger: Logger;
};
export type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  created_at: Date;
  updated_at: Date;
  status: (typeof PRODUCT_STATUS_MAP)[keyof typeof PRODUCT_STATUS_MAP];
  images: Array<string>;
};

export type ProjectProduct = {
  [key in keyof Product]?: 0 | 1;
};
