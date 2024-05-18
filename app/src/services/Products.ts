import { StatusCodes } from 'http-status-codes';
import { isEmpty } from 'lodash';
import { Api } from '../adapters/api';
import { CODE_MESSAGES } from '../constants/codeMessages';

import { Logger } from '../adapters/logger';
import { InternalServerError } from '../exceptions/InternalServerError';
import { NotFoundError } from '../exceptions/NotFoundError';
import { Product, ProductsArgs, ProjectProduct } from '../types/Products';

export class Products {
  private api: Api;

  private logger: Logger;

  constructor({ base_url, logger, request_id }: ProductsArgs) {
    this.logger = logger;
    this.api = new Api(request_id, { baseURL: base_url });
  }

  async get(product_id: Product['_id'], project?: ProjectProduct): Promise<Product> {
    try {
      const product = await this.api.get<Product>(product_id, project ? { project } : {});
      return product;
    } catch (error) {
      this.logger.error('Products.get', error.message, error);
      if (error.response.status === StatusCodes.NOT_FOUND) throw new NotFoundError(CODE_MESSAGES.PRODUCT_NOT_FOUND);

      throw new InternalServerError(CODE_MESSAGES.ERROR_CALLING_PRODUCT_API);
    }
  }

  async productExist(product_id: Product['_id']): Promise<boolean> {
    try {
      const product = await this.get(product_id, { _id: 1 });
      this.logger.debug('Products.productExist', { product_id, product });
      return !isEmpty(product);
    } catch (error) {
      if (error instanceof NotFoundError) return false;
      throw error;
    }
  }
}
