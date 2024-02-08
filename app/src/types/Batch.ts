import { Batch as PrismaBatch } from '@prisma/client';

export type Batch = PrismaBatch;

export type CreateBatch = Pick<Batch, 'product_id' | 'quantity'>;
