import { LoggerFactory, Token } from '@common';
import { BadRequestException } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Test, TestingModule } from '@nestjs/testing';
import { PriceService } from '@price';
import { BigNumber } from 'ethers';
import { ContractFactory, PriceFeedContract } from '../contract';
import { LatestRoundData } from '../dto';
import { PriceFeedService } from './price-feed.service';

describe('PriceFeedService', () => {
  let service: PriceFeedService;
  let mockContractFactory: Partial<ContractFactory>;
  let mockContact: Partial<PriceFeedContract>;
  let mockSchedulerRegistry: Partial<SchedulerRegistry>;
  let mockPriceService: Partial<PriceService>;
  let mockLatestRoundData: [
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
  ];

  beforeEach(async () => {
    jest
      .spyOn(LoggerFactory, 'getLogger')
      .mockReturnValue({ log: jest.fn(), error: jest.fn() } as any);
    jest.useFakeTimers('modern');
    const timestamp = Math.floor(Date.now() / 1000);
    mockLatestRoundData = [
      BigNumber.from(1),
      BigNumber.from(100),
      BigNumber.from(timestamp),
      BigNumber.from(timestamp),
      BigNumber.from(1),
    ];
    mockSchedulerRegistry = {
      addCronJob: jest.fn(),
    };
    mockPriceService = {
      savePriceRates: jest.fn(),
    };
    mockContact = {
      latestRoundData: jest.fn().mockResolvedValue(mockLatestRoundData),
    };
    mockContractFactory = {
      getTokenPairPriceFeedContract: jest.fn().mockReturnValue(mockContact),
      getAllPairs: jest.fn().mockReturnValue([
        [Token.BNB, Token.USD],
        [Token.BTC, Token.USD],
      ]),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PriceFeedService,
        { provide: ContractFactory, useValue: mockContractFactory },

        { provide: SchedulerRegistry, useValue: mockSchedulerRegistry },
        { provide: PriceService, useValue: mockPriceService },
      ],
    }).compile();

    service = module.get<PriceFeedService>(PriceFeedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTokenLatestPriceFeed', () => {
    it('should return latestRoundData', async () => {
      const res = await service.getTokenLatestPriceFeed(Token.BNB, Token.USD);
      expect(res).toStrictEqual(
        new LatestRoundData(mockLatestRoundData, Token.BNB, Token.USD),
      );
    });
    it('should throw error if pair not found', async () => {
      mockContractFactory.getTokenPairPriceFeedContract = jest
        .fn()
        .mockReturnValue(null);
      await expect(
        service.getTokenLatestPriceFeed(Token.BTC, Token.BNB),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('fetchAllPriceFeed', () => {
    it('should fetch data from contracts', async () => {
      await service.fetchAllPriceFeed();
      expect(mockContractFactory.getAllPairs).toBeCalledTimes(1);
      expect(mockContact.latestRoundData).toBeCalledTimes(2);
    });
    it('should save data', async () => {
      await service.fetchAllPriceFeed();
      expect(mockPriceService.savePriceRates).toBeCalledTimes(1);
    });
  });
});
