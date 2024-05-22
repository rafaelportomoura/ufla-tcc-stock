import { Prisma, PrismaClient, StockStatus } from '@prisma/client';
import { Balance, ProductBalance } from '../types/Balance';
import { ListStockPagination } from '../types/ListStock';
/* eslint-disable no-empty-function */
import { Logger } from '../adapters/logger';
import { ReserveError } from '../exceptions/ReserveError';
import { ReserveOutputs, ReserveParams } from '../types/Reserve';
import { Stock, StockIdentifier } from '../types/Stock';

export class StockRepository {
  private stock_delegate: Prisma.StockDelegate;

  constructor(
    private client: PrismaClient,
    private logger: Logger
  ) {
    this.stock_delegate = client.stock;
  }

  async listStock(where: Partial<Stock>, { skip, take }: ListStockPagination): Promise<Array<Stock>> {
    return this.stock_delegate.findMany({ where, skip, take });
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

  async reserve({ products }: ReserveParams): Promise<ReserveOutputs> {
    return this.client.$transaction(async (tx) => {
      const products_ids = Object.keys(products);

      const stocks_promise = products_ids.map((product_id) =>
        tx.stock.findMany({
          select: { product_id: true, id: true },
          where: { product_id, status: StockStatus.AVAILABLE },
          take: products[product_id]
        })
      );

      const stocks = await Promise.all(stocks_promise);

      const products_stocks = products_ids.map((product_id, index) => ({
        product_id,
        stock_ids: stocks[index].map(({ id }) => id),
        quantity: products[product_id]
      }));

      const products_in_fault = products_stocks.filter(({ stock_ids, quantity }) => stock_ids.length < quantity);
      this.logger.debug('products_in_fault', products_in_fault);
      if (products_in_fault.length) {
        throw new ReserveError(products_in_fault.map(({ product_id }) => product_id));
      }

      const reserve_promises = products_stocks.map(({ stock_ids }) =>
        tx.stock.updateMany({
          where: { id: { in: stock_ids }, status: StockStatus.AVAILABLE },
          data: { status: StockStatus.RESERVED }
        })
      );

      const reserves = await Promise.all(reserve_promises);

      const when_reserve_products_in_fault = reserves.filter(
        (reserve, index) => reserve.count < products_stocks[index].quantity
      );
      this.logger.debug('when_reserve_products_in_fault', when_reserve_products_in_fault);
      if (when_reserve_products_in_fault.length) {
        throw new ReserveError(when_reserve_products_in_fault.map((_, index) => products_ids[index]));
      }

      return products_stocks;
    });
  }

  async sell(stock_ids: Array<Stock['id']>): Promise<Array<StockIdentifier>> {
    return this.changeStatus(stock_ids, StockStatus.RESERVED, StockStatus.SOLD);
  }

  async returnToStock(stock_ids: Array<Stock['id']>): Promise<Array<StockIdentifier>> {
    return this.changeStatus(stock_ids, StockStatus.RESERVED, StockStatus.AVAILABLE);
  }

  async countDistinctProductIds(): Promise<number> {
    const { length } = await this.stock_delegate.groupBy({
      by: ['product_id'],
      _count: {
        product_id: true
      }
    });
    return length;
  }

  async count(where: Prisma.StockWhereInput): Promise<number> {
    return this.stock_delegate.count({ where });
  }

  async getBalanceGroupedByProducts(skip: number = 0, take: number = 10): Promise<Array<ProductBalance>> {
    const stocks = await this.stock_delegate.findMany({
      select: { product_id: true },
      distinct: ['product_id'],
      skip,
      take
    });

    const grouped_by_status = await this.stock_delegate.groupBy({
      by: ['product_id', 'status'],
      _count: {
        status: true
      },
      where: { product_id: { in: stocks.map(({ product_id }) => product_id) } }
    });

    const grouped_by_product_id = grouped_by_status.reduce(
      (acc, { product_id, status, _count: { status: count } }) => {
        if (!acc[product_id]) {
          acc[product_id] = { available: 0, reserved: 0, sold: 0 };
        }

        const status_key = status.toLowerCase() as Lowercase<StockStatus>;

        acc[product_id][status_key] = count;

        return acc;
      },
      {} as Record<string, Balance>
    );

    return Object.entries(grouped_by_product_id).map(([product_id, balance]) => ({ product_id, ...balance }));
  }

  private async changeStatus(
    stock_ids: Array<Stock['id']>,
    old_status: StockStatus,
    status: StockStatus
  ): Promise<Array<StockIdentifier>> {
    const stocks = await this.stock_delegate.findMany({
      where: { id: { in: stock_ids }, status: old_status },
      select: { product_id: true, batch_id: true, id: true }
    });

    await this.stock_delegate.updateMany({
      where: { id: { in: stocks.map((stock) => stock.id) } },
      data: { status }
    });

    return stocks;
  }
}
