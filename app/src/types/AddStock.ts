import { Batch, PrismaClient } from '@prisma/client';
import { AwsParams } from './Aws';

export type AddStockArgs = {
  aws_params: AwsParams;
  prisma: PrismaClient;
};

export type AddStockResponse = {
  batch_id: Batch['id'];
};
