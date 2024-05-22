/* eslint-disable @typescript-eslint/no-unused-vars */
import { FastifyReply, FastifyRequest } from 'fastify';
import { Logger } from '../adapters/logger';
import { PrismaStatic } from '../adapters/prisma';
import { Validator } from '../adapters/validate';
import { GetBalance } from '../business/getBalance';
import { CONFIGURATION } from '../constants/configuration';
import { BaseError } from '../exceptions/BaseError';
import { error_handler } from '../middlewares/error';
import { batch_id_schema } from '../schemas/batchId';
import { Balance } from '../types/Balance';
import { request_id } from '../utils/requestId';

export async function getBatchBalance(
  req: FastifyRequest,
  res: FastifyReply
): Promise<Balance | ReturnType<BaseError['toJSON']>> {
  const logger = new Logger(CONFIGURATION.LOG_LEVEL, request_id(req));
  try {
    const { batch_id } = await Validator.validate(req.params, batch_id_schema);

    const business = new GetBalance({
      prisma: PrismaStatic.create(),
      logger
    });

    const response = await business.getBalance({ batch_id });
    return response;
  } catch (error) {
    const response = error_handler(logger, error, 'getBatchBalance');
    res.status(response.status);
    return response.toJSON();
  }
}
