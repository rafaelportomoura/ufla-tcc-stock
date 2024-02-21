import { z } from 'zod';

export const list_balance_schema = z.object({
  page: z.coerce.number().int().positive().default(1),
  size: z.coerce.number().int().positive().default(10)
});
