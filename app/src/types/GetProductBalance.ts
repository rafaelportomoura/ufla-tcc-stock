import { PrismaClient } from '@prisma/client';
import { Logger } from './Logger';

export type GetProductBalanceArgs = {
  prisma: PrismaClient;
  logger: Logger;
};
