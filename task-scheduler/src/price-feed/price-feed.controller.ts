import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { PriceFeedService } from './service';

@Controller('priceFeed')
export class PriceFeedController {
  constructor(private readonly priceFeedService: PriceFeedService) {}

  @Post('fetchAllPrice')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async fetchAllPrice() {
    this.priceFeedService.fetchAllPriceFeed();
  }
}
