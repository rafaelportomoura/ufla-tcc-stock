/* eslint-disable no-empty-function */
import { Prisma } from '@prisma/client';
import { CreateStock, Stock } from '../types/Stock';

export class StockRepository {
  constructor(private client: Prisma.StockDelegate) {}

  async create(data: CreateStock): Promise<Stock> {
    return this.client.create({ data });
  }
}
