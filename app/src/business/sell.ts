import { EVENT_STATUS, EVENT_TYPE } from '../constants/event';
import { StockRepository } from '../repositories/stock';
import { EventBus } from '../services/EventBus';
import { SellArgs } from '../types/Sell';
import { Stock } from '../types/Stock';

export class Sell {
  private stock_repository: StockRepository;

  private event_bus: EventBus;

  constructor({ prisma, logger, event_bus, aws_params }: SellArgs) {
    this.stock_repository = new StockRepository(prisma);
    this.event_bus = new EventBus(logger, event_bus, aws_params);
  }

  async sell(stock_ids: Array<Stock['id']>) {
    const stocks = await this.stock_repository.sell(stock_ids);

    const event_attributes = this.event_bus.messageAttributes(EVENT_TYPE.SOLD, EVENT_STATUS.SUCCESS);
    await this.event_bus.pub({ stocks }, event_attributes);
  }
}
