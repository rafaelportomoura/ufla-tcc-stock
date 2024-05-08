/* eslint-disable import/no-extraneous-dependencies */
import { SQSEvent } from 'aws-lambda';
import { Logger } from '../adapters/logger';
import { PrismaStatic } from '../adapters/prisma';
import { Validator } from '../adapters/validate';
import { aws_params } from '../aws/config';
import { ReturnToStock } from '../business/returnToStock';
import { CONFIGURATION } from '../constants/configuration';
import { return_to_stock } from '../schemas/returnToStock';

export async function returnToStock(event: SQSEvent): Promise<void> {
  const prisma = await PrismaStatic.create(aws_params());
  const logger = new Logger(CONFIGURATION.LOG_LEVEL, event.Records[0]);
  try {
    await prisma.$connect();
    const business = new ReturnToStock({
      prisma,
      logger,
      event_bus: CONFIGURATION.EVENT_BUS,
      aws_params: aws_params()
    });
    for (const record of event.Records) {
      const { stock_ids } = await Validator.validate(JSON.parse(record.body), return_to_stock);

      await business.sell(stock_ids);
    }
  } catch (error) {
    logger.error(error, 'Handler');
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
