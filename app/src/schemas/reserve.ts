import { z } from 'zod';

export const reserve_schema = z.object({
  product_id: z.string(),
  quantity: z.number().int().positive()
});
