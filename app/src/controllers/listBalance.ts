/* eslint-disable @typescript-eslint/no-unused-vars */
import { FastifyReply, FastifyRequest } from 'fastify';
import { Logger } from '../adapters/logger';
import { PrismaStatic } from '../adapters/prisma';
import { Validator } from '../adapters/validate';
import { ListBalance } from '../business/listBalance';
import { CONFIGURATION } from '../constants/configuration';
import { BaseError } from '../exceptions/BaseError';
import { error_handler } from '../middlewares/error';
import { list_balance_schema } from '../schemas/listBalance';
import { ListBalanceResponse } from '../types/ListBalance';
import { request_id } from '../utils/requestId';
import { decodeObject } from '../utils/uriDecodeComponent';

export async function listBalance(req: FastifyRequest, res: FastifyReply): Promise<ListBalanceResponse | BaseError> {
  const logger = new Logger(CONFIGURATION.LOG_LEVEL, request_id(req));
  try {
    const query = await Validator.validate(decodeObject(req.query), list_balance_schema);

    const balance = new ListBalance({
      prisma: PrismaStatic.get(),
      logger
    });

    return balance.list(query);
  } catch (error) {
    const response = error_handler(logger, error, 'listBalance');
    res.status(response.status);
    return response;
  }
}
