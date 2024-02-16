import { z } from 'zod';

export const product_id_schema = z
  .object({
    product_id: z.string()
  })
  .strict();
