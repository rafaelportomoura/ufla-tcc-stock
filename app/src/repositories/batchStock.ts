/* eslint-disable no-empty-function */
import { PrismaClient } from '@prisma/client';
import { Batch, CreateBatchSchema } from '../types/Batch';
import { BatchWithStocks } from '../types/BatchStock';
import { CreateStock } from '../types/Stock';

export class BatchStockRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateBatchSchema): Promise<BatchWithStocks> {
    return this.prisma.$transaction(async (tx) => {
      const batch = await tx.batch.create({ data });

      const stocks = await Promise.all(this.generateStocks(batch).map((stk) => tx.stock.create({ data: stk })));

      return { batch, stocks };
    });
  }

  generateStocks({ id, product_id, quantity }: Batch): Array<CreateStock> {
    const stocks: Array<CreateStock> = [];
    for (let i = 0; i < quantity; i++) stocks.push({ batch_id: id, product_id });
    return stocks;
  }
}
