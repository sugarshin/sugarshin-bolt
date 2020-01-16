import { LogLevel, ConsoleLogger } from '@slack/logger';

export const logLevel = process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG;
export const logger = new ConsoleLogger();

logger.setLevel(logLevel);
