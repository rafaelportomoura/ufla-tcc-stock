import { EVENT_STATUS, EVENT_TYPE } from '../constants/event';
import { StockRepository } from '../repositories/stock';
import { EventBus } from '../services/EventBus';
import { ReserveArgs, ReserveParams } from '../types/Reserve';
import { Stock } from '../types/Stock';

export class ReserveStock {
  private stock_repository: StockRepository;

  private event_bus: EventBus;

  constructor({ prisma, logger, event_bus, aws_params }: ReserveArgs) {
    this.stock_repository = new StockRepository(prisma);
    this.event_bus = new EventBus(logger, event_bus, aws_params);
  }

  async reserve({ product_id, quantity }: ReserveParams): Promise<Array<Stock['id']>> {
    const ids = this.stock_repository.reserve({ product_id, quantity });
    const event_attributes = this.event_bus.messageAttributes(EVENT_TYPE.RESERVED, EVENT_STATUS.SUCCESS);
    await this.event_bus.pub({ product_id, quantity, stocks: ids }, event_attributes);
    return ids;
  }
}
