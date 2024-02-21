/* eslint-disable @typescript-eslint/no-unused-vars */
import { FastifyReply, FastifyRequest } from 'fastify';
import { PrismaStatic } from '../adapters/prisma';
import { Validator } from '../adapters/validate';
import { ListStock } from '../business/listStock';
import { list_stock_query } from '../schemas/listStock';
import { ListStockResponse } from '../types/ListStock';
import { decodeObject } from '../utils/uriDecodeComponent';

export async function listStock(req: FastifyRequest, res: FastifyReply): Promise<ListStockResponse> {
  const logger = req.log;

  const query = await Validator.validate(decodeObject(req.query), list_stock_query);

  const balance = new ListStock({
    prisma: PrismaStatic.get(),
    logger
  });

  return balance.list(query);
}
