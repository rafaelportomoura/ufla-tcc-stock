import { Logger } from '../adapters/logger';

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
  images: Array<string>;
};

export type ProjectProduct = {
  [key in keyof Product]?: 0 | 1;
};
