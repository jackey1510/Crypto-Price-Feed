import { Token } from '@common';
import { Test, TestingModule } from '@nestjs/testing';
import { PriceController } from './price.controller';
import { PriceService } from './service';

describe('PriceController', () => {
  let controller: PriceController;
  let mockPriceService: Partial<PriceService>;

  beforeEach(async () => {
    mockPriceService = {
      queryLatestPriceRate: jest.fn(),
      queryPriceRateAtTime: jest.fn(),
      queryPriceRateAverageWithinTimeSlot: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: PriceService, useValue: mockPriceService }],
      controllers: [PriceController],
    }).compile();

    controller = module.get<PriceController>(PriceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('queryLatestTokenPriceToUSD', () => {
    it('should call priceService.queryLatestPriceRate', async () => {
      await controller.queryLatestTokenPriceToUSD(Token.BNB);
      expect(mockPriceService.queryLatestPriceRate).toBeCalledWith(
        Token.BNB,
        Token.USD,
      );
    });
  });

  describe('queryTokenPriceToUSDAtTime', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    })
    afterEach(() => {
      jest.useRealTimers();
    })
    it('should call priceService.queryTokenPriceToUSDAtTime', async () => {
      const mockDto = { fromToken: Token.BNB, minuteTolerance: 10, time: new Date() }
      await controller.queryTokenPriceToUSDAtTime(mockDto)
      expect(mockPriceService.queryPriceRateAtTime).toBeCalledWith({ ...mockDto, toToken: Token.USD })
    })
  })

  describe('averageUSDRate', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });
    afterEach(() => {
      jest.useRealTimers();
    });
    it('should call priceService.queryTokenPriceToUSDAtTime', async () => {
      const mockDto = {
        fromToken: Token.BNB,
        startTime: new Date(),
        endTime: new Date('2011')
      };
      await controller.queryAverageUSDRate(mockDto);
      expect(mockPriceService.queryPriceRateAverageWithinTimeSlot).toBeCalledWith({
        ...mockDto,
        toToken: Token.USD,
      });
    });
  });
});
