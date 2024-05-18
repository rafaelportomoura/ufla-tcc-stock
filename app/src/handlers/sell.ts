/* eslint-disable import/no-extraneous-dependencies */
import { SNSEventRecord, SQSEvent } from 'aws-lambda';
import { Logger } from '../adapters/logger';
import { PrismaStatic } from '../adapters/prisma';
import { Validator } from '../adapters/validate';
import { aws_params } from '../aws/config';
import { Sell } from '../business/sell';
import { CONFIGURATION } from '../constants/configuration';
import { sell_schema } from '../schemas/sell';
import { sqs_request_id } from '../utils/sqs_id';

export async function sell(event: SQSEvent): Promise<void> {
  const prisma = PrismaStatic.create();
  const record = event.Records[0];
  const logger = new Logger(CONFIGURATION.LOG_LEVEL, sqs_request_id(record));
  try {
    await prisma.$connect();
    const business = new Sell({ prisma, logger, event_bus: CONFIGURATION.EVENT_BUS, aws_params: aws_params() });
    let body = JSON.parse(record.body);
    if ((body as SNSEventRecord['Sns']).TopicArn) body = JSON.parse(body.Message);
    const { stock_ids } = await Validator.validate(body, sell_schema);

    await business.sell(stock_ids);
  } catch (error) {
    logger.error(error, 'Handler');
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
