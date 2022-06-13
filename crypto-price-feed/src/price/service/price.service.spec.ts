import { Token } from '@common';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PriceRateDto } from '../dto';
import { PriceRepository } from '../repository';
import { PriceService } from './price.service';

describe('PriceService', () => {
  let service: PriceService;
  let mockPriceRepository: Partial<PriceRepository>;
  let mockPricePairResult = {
    result: 'last',
    table: 0,
    _start: new Date('2022-06-12T15:45:32.480518929Z'),
    _stop: new Date('2022-06-13T15:45:32.480518929Z'),
    _time: new Date('2022-06-13T15:45:32.480518929Z'),
    _value: 23224.48224488,
    _field: Token.USD,
    _measurement: Token.BTC,
  };

  beforeEach(async () => {
    mockPriceRepository = {
      queryLatestPriceRate: jest.fn().mockResolvedValue([mockPricePairResult]),
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

  describe('queryLatestPriceRate', () => {
    it('should return PriceRateDto', async () => {
      const res = await service.queryLatestPriceRate(Token.BTC, Token.USD);
      expect(res).toStrictEqual(new PriceRateDto(mockPricePairResult));
    });
    it('should throw NotFoundException when no result', async () => {
      mockPriceRepository.queryLatestPriceRate = jest
        .fn()
        .mockResolvedValue([]);
      await expect(
        service.queryLatestPriceRate(Token.BNB, Token.USD),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('savePriceRates', () => {
    it('should delegate to repository.savePriceRates', async () => {
      await service.savePriceRates([]);
      expect(mockPriceRepository.savePriceRates).toBeCalledWith([]);
    });
  });
});
