import { FastifyReply, FastifyRequest } from 'fastify';
import { PrismaStatic } from '../adapters/prisma';
import { aws_params } from '../aws/config';
import { AddStock } from '../business/add';
import { AddStockResponse } from '../types/AddStock';
import { CreateBatch } from '../types/Batch';

export async function addStock(req: FastifyRequest, res: FastifyReply): Promise<AddStockResponse> {
  const logger = req.log;

  const business = new AddStock({
    aws_params: aws_params(),
    prisma: PrismaStatic.create()
  });

  const {
    batch: { id }
  } = await business.add(req.body as CreateBatch);

  res.status(201);
  return {
    batch_id: id
  };
}
