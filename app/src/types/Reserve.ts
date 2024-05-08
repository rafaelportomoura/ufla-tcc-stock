import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { Logger } from '../adapters/logger';
import { reserve_schema } from '../schemas/reserve';
import { AwsParams } from './Aws';
import { CodeMessage } from './CodeMessage';
import { Stock } from './Stock';

export type ReserveArgs = {
  aws_params: AwsParams;
  prisma: PrismaClient;
  logger: Logger;
  event_bus: string;
};

export type ReserveParams = z.infer<typeof reserve_schema>;

export type ReserveOutput = {
  product_id: string;
  quantity: number;
  stock_ids: Array<Stock['id']>;
};

export type ReserveOutputs = Array<ReserveOutput>;

export type ReserveResponse = CodeMessage & {
  reserves: ReserveOutputs;
};
