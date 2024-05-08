import { PrismaClient, StockStatus } from '@prisma/client';
import { Logger } from '../adapters/logger';

export type Balance = {
  [key in Lowercase<StockStatus>]: number;
};

export type ProductBalance = Balance & {
  product_id: string;
};

export type BalanceKeys = keyof Balance;

export type GetBalanceArgs = {
  prisma: PrismaClient;
  logger: Logger;
};
