import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { reserve_schema } from '../schemas/reserve';
import { AwsParams } from './Aws';
import { CodeMessage } from './CodeMessage';
import { Logger } from './Logger';
import { Stock } from './Stock';

export type ReserveArgs = {
  aws_params: AwsParams;
  prisma: PrismaClient;
  logger: Logger;
  event_bus: string;
};

export type ReserveParams = z.infer<typeof reserve_schema>;

export type ReserveResponse = CodeMessage & {
  stock_ids: Array<Stock['id']>;
};
