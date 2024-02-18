import z from 'zod';

export const return_to_stock = z.object({
  stock_ids: z.number().int().positive().array()
});
