import { Test, TestingModule } from '@nestjs/testing';
import { PriceFeedController } from './price-feed.controller';
import { PriceFeedService } from './service';

describe('PriceFeedController', () => {
  let controller: PriceFeedController;
  let mockPriceFeedService: Partial<PriceFeedService>;

  beforeEach(async () => {
    mockPriceFeedService = {
      fetchAllPriceFeed: jest.fn(),
      getTokenLatestPriceFeed: jest.fn().mockResolvedValue({}),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: PriceFeedService, useValue: mockPriceFeedService },
      ],
      controllers: [PriceFeedController],
    }).compile();

    controller = module.get<PriceFeedController>(PriceFeedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('fetchAllPrice', () => {
    it('should delegate to service.fetchAllPriceFeed', () => {
      controller.fetchAllPrice();
      expect(mockPriceFeedService.fetchAllPriceFeed).toBeCalledTimes(1);
    });
  });
});
