import { Logger } from '@nestjs/common';

export class LoggerFactory {
  private static loggers: Map<string, Logger> = new Map();
  public static getLogger = (name: string): Logger => {
    if (LoggerFactory.loggers.has(name))
      return LoggerFactory.loggers.get(name)!;
    const logger = new Logger(name);
    LoggerFactory.loggers.set(name, logger);
    return logger;
  };
}
