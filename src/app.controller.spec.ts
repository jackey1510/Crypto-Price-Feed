import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { version } from '../package.json';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
    jest.useFakeTimers('modern');
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('health', () => {
    it('should return "Hello World!"', () => {
      expect(appController.health()).toStrictEqual({
        status: 'ok',
        startTime: Date.now(),
        version,
      });
    });
  });
});
