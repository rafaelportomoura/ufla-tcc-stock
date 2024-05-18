import { Batch, PrismaClient } from '@prisma/client';
import { Logger } from '../adapters/logger';
import { AwsParams } from './Aws';
import { CodeMessage } from './CodeMessage';

export type CreateBatchArgs = {
  aws_params: AwsParams;
  prisma: PrismaClient;
  logger: Logger;
  product_base_url: string;
  event_bus: string;
  request_id: string;
};

export type CreateBatchResponse = CodeMessage & {
  batch_id: Batch['id'];
};
