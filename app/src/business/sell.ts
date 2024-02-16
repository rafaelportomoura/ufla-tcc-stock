import { StockRepository } from '../repositories/stock';
import { SellArgs } from '../types/Sell';
import { Stock } from '../types/Stock';

export class Sell {
  private stock_repository: StockRepository;

  constructor({ prisma }: SellArgs) {
    this.stock_repository = new StockRepository(prisma);
  }

  sell(stock_ids: Array<Stock['id']>) {
    return this.stock_repository.sell(stock_ids);
  }
}
