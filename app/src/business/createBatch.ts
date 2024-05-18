import { CODE_MESSAGES } from '../constants/codeMessages';
import { EVENT_STATUS, EVENT_TYPE } from '../constants/event';
import { NotFoundError } from '../exceptions/NotFoundError';
import { BatchStockRepository } from '../repositories/batchStock';
import { EventBus } from '../services/EventBus';
import { Products } from '../services/Products';
import { CreateBatchSchema } from '../types/Batch';
import { BatchWithStocks } from '../types/BatchStock';
import { CreateBatchArgs } from '../types/CreateBatch';

export class CreateBatch {
  private batch_stock_repository: BatchStockRepository;

  private product_service: Products;

  private event_bus: EventBus;

  constructor({ prisma, logger, product_base_url, aws_params, event_bus, request_id }: CreateBatchArgs) {
    this.batch_stock_repository = new BatchStockRepository(prisma);
    this.product_service = new Products({ base_url: product_base_url, logger, request_id });
    this.event_bus = new EventBus(logger, event_bus, aws_params);
  }

  async add(data: CreateBatchSchema): Promise<BatchWithStocks> {
    const { product_id } = data;

    const has_product = await this.product_service.productExist(product_id);

    if (!has_product) throw new NotFoundError(CODE_MESSAGES.PRODUCT_NOT_FOUND);

    const { batch, stocks } = await this.batch_stock_repository.create(data);

    const event_attributes = this.event_bus.messageAttributes(EVENT_TYPE.CREATE, EVENT_STATUS.SUCCESS);

    await this.event_bus.pub({ product_id, batch, stocks }, event_attributes);

    return { batch, stocks };
  }
}
