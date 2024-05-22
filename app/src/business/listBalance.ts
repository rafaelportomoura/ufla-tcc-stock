import { CODE_MESSAGES } from '../constants/codeMessages';
import { NotFoundError } from '../exceptions/NotFoundError';
import { StockRepository } from '../repositories/stock';
import { ListBalanceArgs, ListBalanceParams, ListBalanceResponse } from '../types/ListBalance';

export class ListBalance {
  private stock_repository: StockRepository;

  constructor({ prisma }: ListBalanceArgs) {
    this.stock_repository = new StockRepository(prisma);
  }

  async list({ page, size }: ListBalanceParams): Promise<ListBalanceResponse> {
    const count = await this.stock_repository.countDistinctProductIds();
    const skip = (page - 1) * size;
    const take = size + skip;
    const pages = Math.ceil(count / size);

    if (skip > count - 1 && page > 1) throw new NotFoundError(CODE_MESSAGES.INVALID_PAGE);

    const products_balance = await this.stock_repository.getBalanceGroupedByProducts(skip, take);

    return {
      page,
      pages,
      count,
      products_balance
    };
  }
}
