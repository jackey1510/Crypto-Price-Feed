import { Token } from '@common';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PricePairResultDto, SavePriceRatesArrayDto } from './dto';
import { PriceService } from './service';

@Controller('price')
export class PriceController {
  constructor(private priceService: PriceService) {}

  @Post('price-rates')
  async(@Body() savePriceRateDtos: SavePriceRatesArrayDto) {
    return this.priceService.savePriceRates(savePriceRateDtos.savePriceRates);
  }
  @Get()
  async queryLatestTokenPriceToUSD(
    @Query('token') token: Token,
  ): Promise<PricePairResultDto> {
    return this.priceService.queryLatestPriceRate(token, Token.USD);
  }
}
