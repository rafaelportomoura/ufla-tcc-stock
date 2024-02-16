import { PrismaClient, StockStatus } from '@prisma/client';
import { Logger } from './Logger';

export type Balance = {
  [key in Lowercase<StockStatus>]: number;
};

export type BalanceKeys = keyof Balance;

export type GetBalanceArgs = {
  prisma: PrismaClient;
  logger: Logger;
};
