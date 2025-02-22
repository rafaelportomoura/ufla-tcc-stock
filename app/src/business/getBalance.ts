import { StockRepository } from '../repositories/stock';
import { Balance, GetBalanceArgs } from '../types/Balance';
import { Stock } from '../types/Stock';

export class GetBalance {
  private stock_repository: StockRepository;

  constructor({ prisma, logger }: GetBalanceArgs) {
    this.stock_repository = new StockRepository(prisma, logger);
  }

  async getBalance(where: Partial<Stock>): Promise<Balance> {
    return this.stock_repository.getBalance(where);
  }
}
