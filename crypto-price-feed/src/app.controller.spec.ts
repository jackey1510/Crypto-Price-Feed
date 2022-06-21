import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { version } from '../package.json';

describe('AppController', () => {
  let appController: AppController;
  const now = Date.now();

  beforeEach(async () => {
    jest.useFakeTimers().setSystemTime(now);
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  afterEach(() => {
    jest.useRealTimers();
  });
  describe('health', () => {
    it('should return "Hello World!"', () => {
      expect(appController.health()).toStrictEqual({
        status: 'ok',
        startTime: now,
        version,
      });
    });
  });
});
