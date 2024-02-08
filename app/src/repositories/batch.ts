import { Prisma } from '@prisma/client';
import { Batch, CreateBatch } from '../types/Batch';
/* eslint-disable no-empty-function */

export class BatchRepository {
  constructor(private client: Prisma.BatchDelegate) {}

  async create(data: CreateBatch): Promise<Batch> {
    return this.client.create({ data });
  }
}
