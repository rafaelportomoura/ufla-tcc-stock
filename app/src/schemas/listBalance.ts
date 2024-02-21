import { z } from 'zod';

export const list_balance_schema = z.object({
  page: z.number().int().positive().default(1),
  size: z.number().int().positive().default(10)
});
