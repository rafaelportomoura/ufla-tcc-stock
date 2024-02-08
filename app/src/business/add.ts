import { BatchStockRepository } from '../repositories/batchStock';
import { AddStockArgs } from '../types/AddStock';
import { CreateBatch } from '../types/Batch';
import { CreateBatchStockResponse } from '../types/BatchStock';

export class AddStock {
  private batch_stock_repository: BatchStockRepository;

  constructor({ prisma }: AddStockArgs) {
    this.batch_stock_repository = new BatchStockRepository(prisma);
  }

  async add(data: CreateBatch): Promise<CreateBatchStockResponse> {
    return this.batch_stock_repository.create(data);
  }
}
