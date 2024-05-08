import { PrismaClient } from '@prisma/client';
import { Logger } from '../adapters/logger';
import { AwsParams } from './Aws';

export type ReturnToStockArgs = {
  aws_params: AwsParams;
  prisma: PrismaClient;
  logger: Logger;
  event_bus: string;
};
