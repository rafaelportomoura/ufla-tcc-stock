import { PrismaClient } from '@prisma/client';
import { AwsParams } from './Aws';
import { Logger } from './Logger';

export type SellArgs = {
  aws_params: AwsParams;
  prisma: PrismaClient;
  logger: Logger;
  event_bus: string;
};
