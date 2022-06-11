import { Token } from '@common';
import { Controller, Get, Query } from '@nestjs/common';
import { PriceFeedService } from './service';

@Controller('price-feed')
export class PriceFeedController {
  constructor(private readonly priceFeedService: PriceFeedService) {}
  @Get('/latestPrice')
  public async getTokenLatestPriceFromPriceFeed(@Query('token') token: Token) {
    return this.priceFeedService.getTokenLatestPriceFeed(token, Token.USD);
  }
}
