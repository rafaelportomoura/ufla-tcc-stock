import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { Logger } from '../adapters/logger';
import { PrismaStatic } from '../adapters/prisma';
import { Validator } from '../adapters/validate';
import { aws_params } from '../aws/config';
import { CreateBatch } from '../business/createBatch';
import { CODE_MESSAGES } from '../constants/codeMessages';
import { CONFIGURATION } from '../constants/configuration';
import { URLS } from '../constants/urls';
import { BaseError } from '../exceptions/BaseError';
import { error_handler } from '../middlewares/error';
import { create_batch_schema } from '../schemas/addBatch';
import { CreateBatchResponse } from '../types/CreateBatch';
import { request_id } from '../utils/requestId';

export async function createBatch(
  req: FastifyRequest,
  res: FastifyReply
): Promise<CreateBatchResponse | ReturnType<BaseError['toJSON']>> {
  const logger = new Logger(CONFIGURATION.LOG_LEVEL, request_id(req));
  try {
    const body = await Validator.validate(req.body, create_batch_schema);

    const business = new CreateBatch({
      aws_params: aws_params(),
      prisma: PrismaStatic.create(),
      logger,
      product_base_url: URLS(CONFIGURATION).PRODUCTS,
      event_bus: CONFIGURATION.EVENT_BUS,
      request_id: request_id(req)
    });

    const {
      batch: { id }
    } = await business.add(body);

    res.status(StatusCodes.CREATED);
    return {
      ...CODE_MESSAGES.CREATED_BATCH,
      batch_id: id
    };
  } catch (error) {
    const response = error_handler(logger, error, 'createBatch');
    res.status(response.status);
    return response.toJSON();
  }
}
