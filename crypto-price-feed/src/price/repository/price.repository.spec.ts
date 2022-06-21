import { Token } from '@common';
import { InfluxConfig } from '@config';
import { InfluxClient } from '@database';
import { QueryApi, WriteApi } from '@influxdata/influxdb-client';
import { Test, TestingModule } from '@nestjs/testing';
import { RepositoryUtil } from '.';
import {
  QueryAveragePriceRateDto,
  QueryPriceRateDto,
  SavePriceRateDto,
} from '../dto';
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
  const repositoryUtil: RepositoryUtil = new RepositoryUtil();

  beforeEach(async () => {
    mockQueryApi = {
      collectRows: jest.fn().mockResolvedValue([]),
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
        { provide: 'RepositoryUtil', useValue: repositoryUtil },
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
                  |> aggregateWindow(every: 1s, fn: last, createEmpty: false)
                  |> sort(columns: ["_time"], desc: true)
                  |> limit(n:1, offset: 0)
                  |> yield(name: \"last\")`,
      );
      expect(res).toEqual([]);
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
      const points = priceRates.map(
        repositoryUtil.getPointFromSavePriceRateDto,
      );
      await repository.savePriceRates(priceRates);
      expect(mockWriteApi.writePoints).toBeCalledWith(points);
      expect(mockWriteApi.close).toBeCalledTimes(1);
    });
  });

  describe('queryPriceRateAtTime', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });
    it('should query the at the time range', async () => {
      const mockPayload: QueryPriceRateDto = {
        fromToken: Token.BNB,
        toToken: Token.USD,
        time: new Date(),
        minuteTolerance: 15,
      };

      const start = new Date(
        mockPayload.time.getTime() - mockPayload.minuteTolerance * 60 * 1000,
      );
      const end = new Date(
        mockPayload.time.getTime() + mockPayload.minuteTolerance * 60 * 1000,
      );
      const query = `
      from(bucket: "price")
      |> range(start: ${start.toISOString()}, stop: ${end.toISOString()})
      |> filter(fn: (r) => r["_measurement"] == "${mockPayload.fromToken}")
      |> filter(fn: (r) => r["_field"] == "${mockPayload.toToken}")
      |> aggregateWindow(every: 1s, fn: mean, createEmpty: false)
      |> limit(n:100, offset: 0)
      |> yield(name: "mean")`;
      await repository.queryPriceRateAtTime(mockPayload);
      expect(mockQueryApi.collectRows).toBeCalledWith(query);
    });
  });

  describe('queryPriceRateAverageWithinTimeSlot', () => {
    it('should query the average at the time slot', async () => {
      const queryAveragePriceRateDto: QueryAveragePriceRateDto = {
        fromToken: Token.BTC,
        toToken: Token.USD,
        startTime: new Date('2022-05-01'),
        endTime: new Date('2022-06-01'),
      };

      const { endTime, fromToken, startTime, toToken } =
        queryAveragePriceRateDto;

      const window = Math.floor(
        (endTime.getTime() - startTime.getTime()) / 1000,
      );

      const query = `
      from(bucket: "price")
      |> range(start: ${startTime.toISOString()}, stop: ${endTime.toISOString()})
      |> filter(fn: (r) => r["_measurement"] == "${fromToken}")
      |> filter(fn: (r) => r["_field"] == "${toToken}")
      |> aggregateWindow(every: ${window}s, fn: mean, createEmpty: false)
      |> yield(name: "mean")`;

      await repository.queryPriceRateAverageWithinTimeSlot(
        queryAveragePriceRateDto,
      );
      expect(mockQueryApi.collectRows).toBeCalledWith(query);
    });
  });
});
