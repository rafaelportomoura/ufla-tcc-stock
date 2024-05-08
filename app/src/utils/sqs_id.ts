/* eslint-disable snakecasejs/snakecasejs */
/* eslint-disable import/no-extraneous-dependencies */

import { SQSRecord } from 'aws-lambda';

export const sqs_request_id = ({ attributes, messageId }: SQSRecord): string =>
  attributes?.MessageDeduplicationId ?? messageId;
