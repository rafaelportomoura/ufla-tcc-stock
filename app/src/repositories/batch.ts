import { Prisma } from '@prisma/client';
import { Batch, CreateBatchSchema } from '../types/Batch';
import { PrismaSubClient } from '../types/Prisma';
/* eslint-disable no-empty-function */

export class BatchRepository {
  private batch_delegate: Prisma.BatchDelegate;

  constructor(client: PrismaSubClient) {
    this.batch_delegate = client.batch;
  }

  async create(data: CreateBatchSchema): Promise<Batch> {
    return this.batch_delegate.create({ data });
  }
}
