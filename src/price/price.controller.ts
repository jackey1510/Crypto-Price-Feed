import { Get, Post, Query } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { PriceService } from './service';
import { Token } from '@common';
import { PricePairResultDto } from './dto';

@Controller('price')
export class PriceController {
  constructor(private priceService: PriceService) {}

  @Post()
  async save() {
    return this.priceService.save();
  }
  @Get()
  async queryLatestTokenPriceToUSD(
    @Query('token') token: Token,
  ): Promise<PricePairResultDto> {
    return this.priceService.queryLatestPriceRate(token, Token.USD);
  }
}
