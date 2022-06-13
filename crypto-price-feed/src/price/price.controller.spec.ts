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
});
