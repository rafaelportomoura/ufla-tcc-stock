import { EVENT_STATUS, EVENT_TYPE } from '../constants/event';
import { StockRepository } from '../repositories/stock';
import { EventBus } from '../services/EventBus';
import { ReturnToStockArgs } from '../types/ReturnToStock';
import { Stock } from '../types/Stock';

export class ReturnToStock {
  private stock_repository: StockRepository;

  private event_bus: EventBus;

  constructor({ prisma, logger, event_bus, aws_params }: ReturnToStockArgs) {
    this.stock_repository = new StockRepository(prisma);
    this.event_bus = new EventBus(logger, event_bus, aws_params);
  }

  async return(stock_ids: Array<Stock['id']>) {
    const stocks = await this.stock_repository.returnToStock(stock_ids);

    const event_attributes = this.event_bus.messageAttributes(EVENT_TYPE.RETURN_TO_STOCK, EVENT_STATUS.SUCCESS);
    await this.event_bus.pub({ stocks }, event_attributes);
  }
}
