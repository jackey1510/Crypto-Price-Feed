import { Token } from '@common';
import { HttpStatus } from '@nestjs/common';
import { HttpCode, Post } from '@nestjs/common';
import { Controller, Get, Query } from '@nestjs/common';
import { PriceFeedService } from './service';

@Controller('priceFeed')
export class PriceFeedController {
  constructor(private readonly priceFeedService: PriceFeedService) {}
  @Get('/latestPrice')
  public async getTokenLatestPriceFromPriceFeed(@Query('token') token: Token) {
    return this.priceFeedService.getTokenLatestPriceFeed(token, Token.USD);
  }

  @Post('fetchAllPrice')
  @HttpCode(HttpStatus.OK)
  public async fetchAllPrice() {
    await this.priceFeedService.fetchAllPriceFeed();
  }
}
