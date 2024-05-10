/* eslint-disable @typescript-eslint/no-unused-vars */
import { FastifyReply, FastifyRequest } from 'fastify';
import { Logger } from '../adapters/logger';
import { PrismaStatic } from '../adapters/prisma';
import { Validator } from '../adapters/validate';
import { GetBalance } from '../business/getBalance';
import { CONFIGURATION } from '../constants/configuration';
import { BaseError } from '../exceptions/BaseError';
import { error_handler } from '../middlewares/error';
import { product_id_schema } from '../schemas/productId';
import { Balance } from '../types/Balance';
import { request_id } from '../utils/requestId';

export async function getProductBalance(req: FastifyRequest, res: FastifyReply): Promise<Balance | BaseError> {
  const logger = new Logger(CONFIGURATION.LOG_LEVEL, request_id(req));
  try {
    const { product_id } = await Validator.validate(req.params, product_id_schema);

    const business = new GetBalance({
      prisma: PrismaStatic.create(),
      logger
    });

    return business.getBalance({ product_id });
  } catch (error) {
    const response = error_handler(logger, error, 'getProductBalance');
    res.status(response.status);
    return response;
  }
}
