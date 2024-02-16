import { Batch, PrismaClient } from '@prisma/client';
import { AwsParams } from './Aws';
import { Logger } from './Logger';

export type CreateBatchArgs = {
  aws_params: AwsParams;
  prisma: PrismaClient;
  logger: Logger;
  product_base_url: string;
  event_bus: string;
};

export type CreateBatchResponse = {
  batch_id: Batch['id'];
};
