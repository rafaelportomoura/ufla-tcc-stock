import { CONFIGURATION } from './configuration';

export const EVENT = CONFIGURATION.MICROSERVICE;

export const EVENT_TYPE = {
  CREATE: 'create',
  RESERVED: 'reserved'
} as const;

export const EVENT_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error'
} as const;

export const EVENT_NOTIFICATION = {
  EMAIL: 'email'
} as const;
