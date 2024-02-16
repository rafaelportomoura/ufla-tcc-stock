import { FastifyReply, FastifyRequest } from 'fastify';
import { PrismaStatic } from '../adapters/prisma';
import { Validator } from '../adapters/validate';
import { aws_params } from '../aws/config';
import { CreateBatch } from '../business/createBatch';
import { CONFIGURATION } from '../constants/configuration';
import { create_batch_schema } from '../schemas/addBatch';
import { CreateBatchResponse } from '../types/CreateBatch';

export async function createBatch(req: FastifyRequest, res: FastifyReply): Promise<CreateBatchResponse> {
  const logger = req.log;

  const body = await Validator.validate(req.body, create_batch_schema);

  const business = new CreateBatch({
    aws_params: aws_params(),
    prisma: PrismaStatic.create(),
    logger,
    product_base_url: CONFIGURATION.PRODUCT_BASE_URL,
    event_bus: CONFIGURATION.EVENT_BUS
  });

  const {
    batch: { id }
  } = await business.add(body);

  res.status(201);
  return {
    batch_id: id
  };
}
