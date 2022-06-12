import { Logger } from '@nestjs/common';
import { LoggerFactory } from './logger-factory';

describe('LoggerFactory', () => {
  it('should be defined', () => {
    expect(new LoggerFactory()).toBeDefined();
  });
  describe('getLogger', () => {
    it('should return a new Logger', () => {
      expect(LoggerFactory.getLogger('class')).toBeInstanceOf(Logger);
    });
    it('should return the same Logger', () => {
      const logger = LoggerFactory.getLogger('class');
      expect(LoggerFactory.getLogger('class')).toEqual(logger);
    });
  });
});
