import { CONFIGURATION } from './configuration';

export const EVENT = CONFIGURATION.MICROSERVICE;

export const EVENT_TYPE = {
  CREATE: 'create',
  RESERVED: 'reserved',
  RETURN_TO_STOCK: 'returned_to_stock',
  SOLD: 'sold'
} as const;

export const EVENT_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error'
} as const;
