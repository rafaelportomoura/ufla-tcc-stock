/* eslint-disable @typescript-eslint/no-unused-vars */
import { FastifyReply, FastifyRequest } from 'fastify';
import { Logger } from '../adapters/logger';
import { PrismaStatic } from '../adapters/prisma';
import { Validator } from '../adapters/validate';
import { ListStock } from '../business/listStock';
import { CONFIGURATION } from '../constants/configuration';
import { BaseError } from '../exceptions/BaseError';
import { error_handler } from '../middlewares/error';
import { list_stock_query } from '../schemas/listStock';
import { ListStockResponse } from '../types/ListStock';
import { request_id } from '../utils/requestId';
import { decodeObject } from '../utils/uriDecodeComponent';

export async function listStock(req: FastifyRequest, res: FastifyReply): Promise<ListStockResponse | BaseError> {
  const logger = new Logger(CONFIGURATION.LOG_LEVEL, request_id(req));
  try {
    const query = await Validator.validate(decodeObject(req.query), list_stock_query);

    const balance = new ListStock({
      prisma: PrismaStatic.create(),
      logger
    });

    return balance.list(query);
  } catch (error) {
    const response = error_handler(logger, error, 'createBatch');
    res.status(response.status);
    return response;
  }
}
