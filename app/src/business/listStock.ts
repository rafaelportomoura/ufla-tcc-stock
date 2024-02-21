import { CODE_MESSAGES } from '../constants/codeMessages';
import { NotFoundError } from '../exceptions/NotFoundError';
import { StockRepository } from '../repositories/stock';
import { ListStockArgs, ListStockParams, ListStockResponse } from '../types/ListStock';

export class ListStock {
  private stock_repository: StockRepository;

  constructor({ prisma }: ListStockArgs) {
    this.stock_repository = new StockRepository(prisma);
  }

  async list({ page, size, ...query }: ListStockParams): Promise<ListStockResponse> {
    const count = await this.stock_repository.count(query);
    const skip = (page - 1) * size;
    const take = size + skip;
    const pages = Math.ceil(count / size);

    if (skip > count) throw new NotFoundError(CODE_MESSAGES.INVALID_PAGE);

    const stocks = await this.stock_repository.listStock(query, { skip, take });

    return {
      page,
      pages,
      count,
      stocks
    };
  }
}
