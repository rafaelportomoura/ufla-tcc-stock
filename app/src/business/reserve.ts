import { EVENT_STATUS, EVENT_TYPE } from '../constants/event';
import { StockRepository } from '../repositories/stock';
import { EventBus } from '../services/EventBus';
import { ReserveArgs, ReserveOutputs, ReserveParams } from '../types/Reserve';

export class ReserveStock {
  private stock_repository: StockRepository;

  private event_bus: EventBus;

  constructor({ prisma, logger, event_bus, aws_params }: ReserveArgs) {
    this.stock_repository = new StockRepository(prisma);
    this.event_bus = new EventBus(logger, event_bus, aws_params);
  }

  async reserve({ products }: ReserveParams): Promise<ReserveOutputs> {
    const reserves = await this.stock_repository.reserve({ products });
    const event_attributes = this.event_bus.messageAttributes(EVENT_TYPE.RESERVED, EVENT_STATUS.SUCCESS);
    await this.event_bus.pub({ reserves }, event_attributes);
    return reserves;
  }
}
