import { StockStatus } from '@prisma/client';
import { z } from 'zod';

export const list_stock_query = z.object({
  page: z.coerce.number().int().positive().default(1),
  size: z.coerce.number().int().positive().default(10),
  status: z.enum([StockStatus.AVAILABLE, StockStatus.RESERVED, StockStatus.SOLD]).optional(),
  product_id: z.string().optional()
});
