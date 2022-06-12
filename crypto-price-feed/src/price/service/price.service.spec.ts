import { Test, TestingModule } from '@nestjs/testing';
import { PriceRepository } from '../repository';
import { PriceService } from './price.service';

describe('PriceService', () => {
  let service: PriceService;
  let mockPriceRepository: Partial<PriceRepository>;

  beforeEach(async () => {
    mockPriceRepository = {
      queryLatestPriceRate: jest.fn().mockResolvedValue([]),
      savePriceRates: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PriceService,
        { provide: PriceRepository, useValue: mockPriceRepository },
      ],
    }).compile();

    service = module.get<PriceService>(PriceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
