import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { Logger } from '../adapters/logger';
import { list_balance_schema } from '../schemas/listBalance';
import { ProductBalance } from './Balance';

export type ListBalanceArgs = {
  prisma: PrismaClient;
  logger: Logger;
};

export type ListBalanceResponse = {
  page: number;
  pages: number;
  count: number;
  products_balance: ProductBalance[];
};

export type ListBalanceParams = z.infer<typeof list_balance_schema>;
