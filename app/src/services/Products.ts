import { FastifyBaseLogger } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { Api } from '../adapters/api';
import { CODE_MESSAGES } from '../constants/codeMessages';

import { PRODUCT_EXIST_STATUS } from '../constants/productStatus';
import { InternalServerError } from '../exceptions/InternalServerError';
import { NotFoundError } from '../exceptions/NotFoundError';
import { Product, ProductsArgs, ProjectProduct } from '../types/Products';

export class Products {
  private api: Api;

  private logger: FastifyBaseLogger;

  constructor({ base_url, logger }: ProductsArgs) {
    this.logger = logger;
    this.api = new Api({ baseURL: base_url });
  }

  async get(product_id: Product['_id'], project?: ProjectProduct): Promise<Product> {
    try {
      const product = await this.api.get<Product>(product_id, project ? { project } : {});
      return product;
    } catch (error) {
      this.logger.error(error, 'Products.get');
      if (error.response.status === StatusCodes.NOT_FOUND) throw new NotFoundError(CODE_MESSAGES.PRODUCT_NOT_FOUND);

      throw new InternalServerError(CODE_MESSAGES.ERROR_CALLING_PRODUCT_API);
    }
  }

  async productExist(product_id: Product['_id']): Promise<boolean> {
    try {
      const product = await this.get(product_id, { status: 1 });
      return PRODUCT_EXIST_STATUS.includes(product.status as (typeof PRODUCT_EXIST_STATUS)[number]);
    } catch (error) {
      if (error instanceof NotFoundError) return false;
      throw error;
    }
  }
}
