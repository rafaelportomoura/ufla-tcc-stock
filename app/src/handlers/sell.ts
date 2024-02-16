import { SQSEvent } from 'aws-lambda';
import { Logger } from '../adapters/logger';
import { PrismaStatic } from '../adapters/prisma';
import { aws_params } from '../aws/config';
import { Sell } from '../business/sell';
import { CONFIGURATION } from '../constants/configuration';

export async function sell(event: SQSEvent): Promise<void> {
  const prisma = await PrismaStatic.create(aws_params());
  const logger = Logger(CONFIGURATION.STAGE, CONFIGURATION.LOG_LEVEL);
  try {
    await prisma.$connect();
    const { Records } = event;
    const business = new Sell({ prisma });
    for (const record of Records) {
      const { stock_ids } = JSON.parse(record.body);

      await business.sell(stock_ids as number[]);
    }
  } catch (error) {
    logger.error(error, 'Handler');
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
