/* eslint-disable no-empty-function */
import { Prisma, PrismaClient, StockStatus } from '@prisma/client';
import { CODE_MESSAGES } from '../constants/codeMessages';
import { ConflictError } from '../exceptions/ConflictError';
import { Balance } from '../types/Balance';
import { ReserveParams } from '../types/Reserve';
import { Stock } from '../types/Stock';

export class StockRepository {
  private stock_delegate: Prisma.StockDelegate;

  constructor(private client: PrismaClient) {
    this.stock_delegate = client.stock;
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

  async reserve({ product_id, quantity }: ReserveParams): Promise<Array<Stock['id']>> {
    return this.client.$transaction(async (tx) => {
      const stocks = await tx.stock.findMany({
        select: { product_id: true, id: true },
        where: { product_id, status: StockStatus.AVAILABLE },
        take: quantity
      });

      if (stocks.length < quantity) {
        throw new ConflictError(CODE_MESSAGES.NOT_ENOUGH_ITEMS);
      }

      const stock_ids = stocks.map((stock) => stock.id);
      const response = await tx.stock.updateMany({
        where: { id: { in: stock_ids } },
        data: { status: StockStatus.RESERVED }
      });

      if (response.count < quantity) {
        throw new ConflictError(CODE_MESSAGES.NOT_ENOUGH_ITEMS);
      }

      return stock_ids;
    });
  }

  async sell(stock_ids: Array<Stock['id']>): Promise<void> {
    await this.stock_delegate.updateMany({
      where: { id: { in: stock_ids } },
      data: { status: StockStatus.SOLD }
    });
  }
}
