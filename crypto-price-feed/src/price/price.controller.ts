import { Token } from '@common';
import { Controller, Get, Query } from '@nestjs/common';
import { PriceRateDto } from './dto';
import { PriceService } from './service';

@Controller('price')
export class PriceController {
  constructor(private priceService: PriceService) {}

  @Get('/latestUSDRate')
  async queryLatestTokenPriceToUSD(
    @Query('token') token: Token,
  ): Promise<PriceRateDto> {
    return this.priceService.queryLatestPriceRate(token, Token.USD);
  }
}
