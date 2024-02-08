/* eslint-disable no-empty-function */
import { PrismaClient } from '@prisma/client';
import { Batch, CreateBatch } from '../types/Batch';
import { CreateBatchStockResponse } from '../types/BatchStock';
import { CreateStock, Stock } from '../types/Stock';
import { BatchRepository } from './batch';
import { StockRepository } from './stock';

export class BatchStockRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateBatch): Promise<CreateBatchStockResponse> {
    return this.prisma.$transaction(async (tx) => {
      const batch_repository = new BatchRepository(tx.batch);
      const stock_repository = new StockRepository(tx.stock);

      const batch = await batch_repository.create(data);

      const stocks = await Promise.all<Stock[]>(
        this.generateStocks(batch).map(stock_repository.create.bind(stock_repository))
      );

      return { batch, stocks };
    });
  }

  generateStocks({ id, product_id, quantity }: Batch): Array<CreateStock> {
    const stocks: Array<CreateStock> = [];
    for (let i = 0; i < quantity; i++) stocks.push({ batch_id: id, product_id });
    return stocks;
  }
}
