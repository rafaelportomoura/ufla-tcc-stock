/* eslint-disable @typescript-eslint/no-unused-vars */
import { FastifyReply, FastifyRequest } from 'fastify';
import { PrismaStatic } from '../adapters/prisma';
import { Validator } from '../adapters/validate';
import { GetBalance } from '../business/getBalance';
import { batch_id_schema } from '../schemas/batchId';
import { Balance } from '../types/Balance';

export async function getBatchBalance(req: FastifyRequest, res: FastifyReply): Promise<Balance> {
  const logger = req.log;

  const { batch_id } = await Validator.validate(req.params, batch_id_schema);

  const business = new GetBalance({
    prisma: PrismaStatic.create(),
    logger
  });

  return business.getBalance({ batch_id });
}
