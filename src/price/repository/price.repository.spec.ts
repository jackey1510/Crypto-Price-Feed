import { Token } from '@common';
import { InfluxConfig } from '@config';
import { InfluxClient } from '@database';
import { Test, TestingModule } from '@nestjs/testing';
import { PriceRepository } from './price.repository';

describe('PriceRepository', () => {
  let repository: PriceRepository;
  let mockInfluxClient: Partial<InfluxClient> = {};
  const mockConfig: InfluxConfig = {
    org: 'org',
    url: 'http://localhost:8086',
    token: 'token',
  };

  beforeEach(async () => {
    mockInfluxClient.getQueryApi = jest.fn().mockReturnValue({
      collectRows: jest.fn().mockResolvedValue({}),
    });
    mockInfluxClient.getWriteApi = jest.fn().mockReturnValue({});
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
      expect(
        mockInfluxClient.getQueryApi!({ org: mockConfig.org }).collectRows,
      ).toBeCalledWith(
        `from(bucket: "price")
                  |> range(start: -2h, stop: -0s)
                  |> filter(fn: (r) => r["_measurement"] == "${Token.ETH}")
                  |> filter(fn: (r) => r["_field"] == "price")
                  |> filter(fn: (r) => r["pair"] == "${Token.USD}")`,
      );
      expect(res).toEqual({});
    });
  });
});
