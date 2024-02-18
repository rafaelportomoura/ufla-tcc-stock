import z from 'zod';

export const sell_schema = z.object({
  stock_ids: z.number().int().positive().array()
});
