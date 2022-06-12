import { ClassLogger } from '@common';
import { CryptoPriceFeedConfig } from '@config';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

@Injectable()
@ClassLogger()
export class PriceFeedService {
  constructor(
    private readonly httpService: HttpService,
    private readonly cryptoPriceFeedConfig: CryptoPriceFeedConfig,
  ) {}

  fetchAllPriceFeed(): Observable<AxiosResponse> {
    const config: AxiosRequestConfig = {
      baseURL: this.cryptoPriceFeedConfig.url,
      url: 'priceFeed/fetchAllPrice',
      method: 'POST',
    };
    return this.httpService.request(config);
  }
}
