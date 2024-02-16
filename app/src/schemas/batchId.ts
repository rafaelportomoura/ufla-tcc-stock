import { z } from 'zod';

export const batch_id_schema = z
  .object({
    batch_id: z.coerce.number()
  })
  .strict();
