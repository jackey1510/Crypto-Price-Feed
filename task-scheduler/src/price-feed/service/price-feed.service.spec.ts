import { CryptoPriceFeedConfig } from '@config';
import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';

import { PriceFeedService } from './price-feed.service';

describe('PriceFeedService', () => {
  let service: PriceFeedService;
  let mockHttpService: Partial<HttpService>;
  let mockCryptoPriceFeedConfig: Partial<CryptoPriceFeedConfig>;

  beforeEach(async () => {
    jest.useFakeTimers('modern');
    mockHttpService = {
      request: jest.fn().mockReturnValue(of({ status: 200 })),
    };
    mockCryptoPriceFeedConfig = {
      url: 'http://localhost:8080',
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PriceFeedService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: CryptoPriceFeedConfig, useValue: mockCryptoPriceFeedConfig },
      ],
    }).compile();

    service = module.get<PriceFeedService>(PriceFeedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('fetchAllPriceFeed', () => {
    it('should call url from cryptoPriceFeedConfig', () => {
      service.fetchAllPriceFeed();
      expect(mockHttpService.request).toBeCalledWith({
        baseURL: mockCryptoPriceFeedConfig.url,
        url: 'priceFeed/fetchAllPrice',
        method: 'POST',
      });
    });
  });
});
