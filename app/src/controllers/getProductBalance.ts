/* eslint-disable @typescript-eslint/no-unused-vars */
import { FastifyReply, FastifyRequest } from 'fastify';
import { PrismaStatic } from '../adapters/prisma';
import { Validator } from '../adapters/validate';
import { GetBalance } from '../business/getBalance';
import { product_id_schema } from '../schemas/productId';
import { Balance } from '../types/Balance';

export async function getProductBalance(req: FastifyRequest, res: FastifyReply): Promise<Balance> {
  const logger = req.log;

  const { product_id } = await Validator.validate(req.params, product_id_schema);

  const business = new GetBalance({
    prisma: PrismaStatic.create(),
    logger
  });

  return business.getBalance({ product_id });
}
