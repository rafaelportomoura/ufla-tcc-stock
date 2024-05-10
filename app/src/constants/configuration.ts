import { LoggerLevel } from './loggerLevel';

const set_env = <T = string>(key: string, default_value: T): T => (process.env[key] ?? default_value) as T;
const set_number_env = (key: string, default_value: number) => Number(set_env(key, default_value));
const set_string_env = (key: string, default_value: unknown) => String(set_env(key, default_value));
const set_boolean_env = (key: string, default_value: 'true' | 'false') =>
  set_env(key.toLowerCase(), default_value) === 'true';
export const CONFIGURATION = {
  STAGE: set_string_env('STAGE', 'development'),
  TENANT: set_string_env('TENANT', 'tcc'),
  REGION: set_string_env('REGION', 'us-east-2'),
  MICROSERVICE: set_string_env('MICROSERVICE', 'stocks'),
  LOG_LEVEL: set_env<LoggerLevel>('LOG_LEVEL', LoggerLevel.debug),
  PORT: set_number_env('PORT', 4000),
  EVENT_BUS: set_string_env('EVENT_BUS', ''),
  RDS_SECRET: set_string_env('RDS_SECRET', ''),
  RDS_PARAMS: set_string_env('RDS_PARAMS', ''),
  CREATE_DATABASE: set_boolean_env('CREATE_DATABASE', 'false')
} as const;
