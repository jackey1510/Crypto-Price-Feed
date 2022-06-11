import { InfluxConfig } from '@config';
import { Test, TestingModule } from '@nestjs/testing';
import { InfluxClient } from './influx-client';

const mockConfig: InfluxConfig = {
  url: 'http://localhost:8086',
  token: 'token',
  org: 'org',
};

describe('InfluxClient', () => {
  let influxClient: InfluxClient;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        InfluxClient,
        {
          provide: 'INFLUX_CONFIG',
          useValue: mockConfig,
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
