import { Token } from '@common';
import { InfluxConfig } from '@config';
import { InfluxClient } from '@database';
import { QueryApi, WriteApi } from '@influxdata/influxdb-client';
import { Test, TestingModule } from '@nestjs/testing';
import { SavePriceRateDto } from '../dto';
import { getPointFromSavePriceRateDto } from './';
import { PriceRepository } from './price.repository';

describe('PriceRepository', () => {
  let repository: PriceRepository;
  let mockInfluxClient: Partial<InfluxClient> = {};
  const mockConfig: InfluxConfig = {
    org: 'org',
    url: 'http://localhost:8086',
    token: 'token',
  };
  let mockQueryApi: Partial<QueryApi>;
  let mockWriteApi: Partial<WriteApi>;

  beforeEach(async () => {
    mockQueryApi = {
      collectRows: jest.fn().mockResolvedValue({}),
    };
    mockWriteApi = {
      writePoints: jest.fn(),
      close: jest.fn(),
    };
    mockInfluxClient.getQueryApi = jest.fn().mockReturnValue(mockQueryApi);
    mockInfluxClient.getWriteApi = jest.fn().mockReturnValue(mockWriteApi);
    mockInfluxClient.getConfig = jest.fn().mockReturnValue(mockConfig);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PriceRepository,
        { provide: InfluxClient, useValue: mockInfluxClient },
      ],
    }).compile();

    repository = module.get<PriceRepository>(PriceRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('queryLatestPriceRate', () => {
    it('should delegate to queryAPI', async () => {
      const res = await repository.queryLatestPriceRate(Token.ETH, Token.USD);
      expect(mockQueryApi.collectRows).toBeCalledWith(
        `from(bucket: "price")
                  |> range(start: -2h)
                  |> filter(fn: (r) => r["_measurement"] == "${Token.ETH}")
                  |> filter(fn: (r) => r["_field"] == "${Token.USD}")
                  |> aggregateWindow(every: 24h, fn: last, createEmpty: false)
                  |> yield(name: \"last\")`,
      );
      expect(res).toEqual({});
    });
  });

  describe('savePriceRates', () => {
    it('should save points of price rate', async () => {
      const priceRates: SavePriceRateDto[] = [
        {
          fromToken: Token.BNB,
          toToken: Token.USD,
          price: 100,
          timestamp: new Date(),
        },
      ];
      const points = priceRates.map(getPointFromSavePriceRateDto);
      await repository.savePriceRates(priceRates);
      expect(mockWriteApi.writePoints).toBeCalledWith(points);
      expect(mockWriteApi.close).toBeCalledTimes(1);
    });
  });
});
