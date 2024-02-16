import { FastifyReply, FastifyRequest } from 'fastify';
import { PrismaStatic } from '../adapters/prisma';
import { Validator } from '../adapters/validate';
import { aws_params } from '../aws/config';
import { ReserveStock } from '../business/reserve';
import { CODE_MESSAGES } from '../constants/codeMessages';
import { CONFIGURATION } from '../constants/configuration';
import { reserve_schema } from '../schemas/reserve';
import { ReserveResponse } from '../types/Reserve';

export async function reserve(req: FastifyRequest, res: FastifyReply): Promise<ReserveResponse> {
  const logger = req.log;

  const body = await Validator.validate(req.body, reserve_schema);

  const business = new ReserveStock({
    aws_params: aws_params(),
    prisma: PrismaStatic.get(),
    logger,
    event_bus: CONFIGURATION.EVENT_BUS
  });

  const stock_ids = await business.reserve(body);

  res.status(201);
  return {
    ...CODE_MESSAGES.RESERVED,
    stock_ids
  };
}
