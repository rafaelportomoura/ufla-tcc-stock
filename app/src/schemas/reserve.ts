import { z } from 'zod';

const single_reserve_schema = z.record(z.number().int().positive());

export const reserve_schema = z.object({
  products: single_reserve_schema
});
