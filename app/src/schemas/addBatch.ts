import { z } from 'zod';

export const create_batch_schema = z
  .object({
    product_id: z.string(),
    quantity: z.number().int()
  })
  .strict();
