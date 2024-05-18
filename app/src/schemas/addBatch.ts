import { z } from 'zod';

export const create_batch_schema = z
  .object({
    product_id: z.string().max(64),
    quantity: z.number().int().positive()
  })
  .strict();
