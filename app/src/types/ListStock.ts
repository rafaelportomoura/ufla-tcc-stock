import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { Logger } from '../adapters/logger';
import { list_stock_query } from '../schemas/listStock';
import { Stock } from './Stock';

export type ListStockArgs = {
  prisma: PrismaClient;
  logger: Logger;
};

export type ListStockParams = z.infer<typeof list_stock_query>;

export type ListStockPagination = {
  skip: number;
  take: number;
};

export type ListStockResponse = {
  page: number;
  pages: number;
  count: number;
  stocks: Stock[];
};
