import { Batch as PrismaBatch } from '@prisma/client';
import { z } from 'zod';
import { create_batch_schema } from '../schemas/addBatch';

export type Batch = PrismaBatch;

export type CreateBatchSchema = z.infer<typeof create_batch_schema>;
