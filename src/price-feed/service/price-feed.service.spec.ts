import { Test, TestingModule } from '@nestjs/testing';
import { ContractFactory } from '../contract';
import { PriceFeedService } from './price-feed.service';

describe('PriceFeedService', () => {
  let service: PriceFeedService;
  let mockContractFactory: Partial<ContractFactory>;
  let mockContact: any;

  beforeEach(async () => {
    mockContact = { latestRoundData: jest.fn().mockResolvedValue({}) };
    mockContractFactory = {
      getTokenPairPriceFeedContract: jest.fn().mockReturnValue(mockContact),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PriceFeedService,
        { provide: ContractFactory, useValue: mockContractFactory },
      ],
    }).compile();

    service = module.get<PriceFeedService>(PriceFeedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
