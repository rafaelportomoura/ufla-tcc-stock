import { Prisma, StockStatus } from '@prisma/client';
import { Balance } from '../types/Balance';
/* eslint-disable no-empty-function */
import { PrismaSubClient } from '../types/Prisma';
import { CreateStock, Stock } from '../types/Stock';

export class StockRepository {
  private stock_delegate: Prisma.StockDelegate;

  constructor(client: PrismaSubClient) {
    this.stock_delegate = client.stock;
  }

  async create(data: CreateStock): Promise<Stock> {
    return this.stock_delegate.create({ data });
  }

  async getBalance(where: Partial<Stock>): Promise<Balance> {
    const db_response = await this.stock_delegate.groupBy({
      by: ['status'],
      _count: true,
      where
    });

    return {
      available: db_response.find((group) => group.status === StockStatus.AVAILABLE)?._count || 0,
      reserved: db_response.find((group) => group.status === StockStatus.RESERVED)?._count || 0,
      sold: db_response.find((group) => group.status === StockStatus.SOLD)?._count || 0
    };
  }
}
