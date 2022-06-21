import { Token } from '@common';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  AveragePriceRateDto,
  PriceRateDto,
  QueryAveragePriceRateDto,
  QueryPriceRateDto,
} from '../dto';
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
    jest.useFakeTimers();

    mockPriceRepository = {
      queryLatestPriceRate: jest.fn().mockResolvedValue([mockPricePairResult]),
      savePriceRates: jest.fn(),
      queryPriceRateAtTime: jest.fn().mockResolvedValue([mockPricePairResult]),
      queryPriceRateAverageWithinTimeSlot: jest
        .fn()
        .mockResolvedValue([mockPricePairResult]),
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
      expect(mockPriceRepository.queryLatestPriceRate).toBeCalled();
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

  describe('queryPriceRateAtTime', () => {
    it('should return price rate dto', async () => {
      const queryPriceRateDto: QueryPriceRateDto = {
        fromToken: Token.BNB,
        toToken: Token.USD,
        time: new Date(),
        minuteTolerance: 0,
      };
      const res = await service.queryPriceRateAtTime(queryPriceRateDto);
      expect(mockPriceRepository.queryPriceRateAtTime).toBeCalled();
      expect(res).toStrictEqual(new PriceRateDto(mockPricePairResult));
    });
    it('should throw NotFoundException when no result', async () => {
      const queryPriceRateDto: QueryPriceRateDto = {
        fromToken: Token.BNB,
        toToken: Token.USD,
        time: new Date(),
        minuteTolerance: 0,
      };
      mockPriceRepository.queryPriceRateAtTime = jest
        .fn()
        .mockResolvedValue([]);
      await expect(
        service.queryPriceRateAtTime(queryPriceRateDto),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('queryPriceRateAverageWithinTimeSlot', () => {
    it('should return average price rate dto', async () => {
      const queryAveragePriceRateDto: QueryAveragePriceRateDto = {
        fromToken: Token.BNB,
        toToken: Token.USD,
        startTime: new Date(),
        endTime: new Date(),
      };

      const result = await service.queryPriceRateAverageWithinTimeSlot(
        queryAveragePriceRateDto,
      );
      expect(
        mockPriceRepository.queryPriceRateAverageWithinTimeSlot,
      ).toBeCalled();
      expect(result).toStrictEqual(
        new AveragePriceRateDto(mockPricePairResult),
      );
    });
  });
  it('should throw NotFoundException when no result', async () => {
    const queryAveragePriceRateDto: QueryAveragePriceRateDto = {
      fromToken: Token.BNB,
      toToken: Token.USD,
      startTime: new Date(),
      endTime: new Date(),
    };
    mockPriceRepository.queryPriceRateAverageWithinTimeSlot = jest
      .fn()
      .mockResolvedValue([]);
    await expect(
      service.queryPriceRateAverageWithinTimeSlot(queryAveragePriceRateDto),
    ).rejects.toThrowError(NotFoundException);
  });
});
