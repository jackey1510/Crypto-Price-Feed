import { Token } from '@common';
import { Controller, Get, Query } from '@nestjs/common';
import {
  PriceRateDto,
  QueryAverageUSDPriceRateDto,
  QueryUSDPriceRateDto
} from './dto';
import { PriceService } from './service';

@Controller('price')
export class PriceController {
  constructor(private priceService: PriceService) { }

  @Get('/latestUSDRate')
  async queryLatestTokenPriceToUSD(
    @Query('token') token: Token,
  ): Promise<PriceRateDto> {
    return this.priceService.queryLatestPriceRate(token, Token.USD);
  }

  @Get('/latestUSDRateAtTime')
  async queryTokenPriceToUSDAtTime(
    @Query() queryUSDPriceRateDto: QueryUSDPriceRateDto,
  ): Promise<PriceRateDto> {
    return this.priceService.queryPriceRateAtTime({
      ...queryUSDPriceRateDto,
      toToken: Token.USD,
    });
  }

  @Get('/averageUSDRate')
  async queryAverageUSDRate(
    @Query() queryAverageUSDPriceRateDto: QueryAverageUSDPriceRateDto,
  ) {
    return this.priceService.queryPriceRateAverageWithinTimeSlot({
      ...queryAverageUSDPriceRateDto,
      toToken: Token.USD,
    });
  }
}
