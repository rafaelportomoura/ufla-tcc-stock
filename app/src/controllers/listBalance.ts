/* eslint-disable @typescript-eslint/no-unused-vars */
import { FastifyReply, FastifyRequest } from 'fastify';
import { PrismaStatic } from '../adapters/prisma';
import { Validator } from '../adapters/validate';
import { ListBalance } from '../business/listBalance';
import { list_balance_schema } from '../schemas/listBalance';
import { ListBalanceResponse } from '../types/ListBalance';
import { decodeObject } from '../utils/uriDecodeComponent';

export async function listBalance(req: FastifyRequest, res: FastifyReply): Promise<ListBalanceResponse> {
  const logger = req.log;

  const query = await Validator.validate(decodeObject(req.query), list_balance_schema);

  const balance = new ListBalance({
    prisma: PrismaStatic.get(),
    logger
  });

  return balance.list(query);
}
