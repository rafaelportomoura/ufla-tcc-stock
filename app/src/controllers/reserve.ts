import { FastifyReply, FastifyRequest } from 'fastify';
import { Logger } from '../adapters/logger';
import { PrismaStatic } from '../adapters/prisma';
import { Validator } from '../adapters/validate';
import { aws_params } from '../aws/config';
import { ReserveStock } from '../business/reserve';
import { CODE_MESSAGES } from '../constants/codeMessages';
import { CONFIGURATION } from '../constants/configuration';
import { BaseError } from '../exceptions/BaseError';
import { error_handler } from '../middlewares/error';
import { reserve_schema } from '../schemas/reserve';
import { ReserveResponse } from '../types/Reserve';
import { request_id } from '../utils/requestId';

export async function reserve(req: FastifyRequest, res: FastifyReply): Promise<ReserveResponse | BaseError> {
  const logger = new Logger(CONFIGURATION.LOG_LEVEL, request_id(req));
  try {
    const body = await Validator.validate(req.body, reserve_schema);

    const business = new ReserveStock({
      aws_params: aws_params(),
      prisma: PrismaStatic.get(),
      logger,
      event_bus: CONFIGURATION.EVENT_BUS
    });

    const reserves = await business.reserve(body);

    res.status(201);
    return {
      ...CODE_MESSAGES.RESERVED,
      reserves
    };
  } catch (error) {
    const response = error_handler(logger, error, 'reserve');
    res.status(response.status);
    return response;
  }
}
