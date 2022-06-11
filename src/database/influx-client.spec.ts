import { InfluxConfig } from '@config';
import { ConfigService } from '@nestjs/config';
import { TestingModule, Test } from '@nestjs/testing';
import { InfluxClient } from './influx-client';

const mockConfig: InfluxConfig = {
  url: 'http://localhost:8086',
  token: 'token',
  org: 'org',
};

describe('InfluxClient', () => {
  let influxClient: InfluxClient;
  const mockConfigService: Partial<ConfigService> = {};
  beforeEach(async () => {
    mockConfigService.get = jest.fn().mockReturnValue(mockConfig);
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        InfluxClient,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    influxClient = app.get<InfluxClient>(InfluxClient);
  });
  it('should be defined', () => {
    expect(influxClient).toBeDefined();
  });

  describe('getConfig', () => {
    it('should return mockConfig', () => {
      expect(influxClient.getConfig()).toStrictEqual(mockConfig);
    });
  });
});
