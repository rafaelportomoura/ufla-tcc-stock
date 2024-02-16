import { PinoLoggerOptions } from 'fastify/types/logger';
import pino from 'pino';
import { LoggerLevel } from '../types/Logger';

const local_logger_options = (level: LoggerLevel): PinoLoggerOptions => ({
  level,
  transport: {
    target: 'pino-pretty'
  }
});

const aws_logger_options = (level: LoggerLevel): PinoLoggerOptions => ({ level });

const test_logger_options = () => ({ level: 'silent' });

export const logger_options = (stage: string, level: LoggerLevel) =>
  ({
    [stage]: aws_logger_options(level),
    development: local_logger_options(level),
    test: test_logger_options()
  })[stage];

export const Logger = (stage: string, level: LoggerLevel) => pino(logger_options(stage, level));
