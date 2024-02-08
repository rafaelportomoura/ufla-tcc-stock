import { Stock as StockPrisma } from '@prisma/client';

export type Stock = StockPrisma;

export type CreateStock = Pick<Stock, 'batch_id' | 'product_id'>;
