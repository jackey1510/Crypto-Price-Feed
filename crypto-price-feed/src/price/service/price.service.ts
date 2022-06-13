import { ClassLogger, Token } from '@common';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PriceRateDto, SavePriceRateDto } from '../dto';
import { PriceRepository } from '../repository';

@Injectable()
@ClassLogger()
export class PriceService {
  constructor(private priceRepository: PriceRepository) {}

  async savePriceRates(savePriceRateDtos: SavePriceRateDto[]) {
    return this.priceRepository.savePriceRates(savePriceRateDtos);
  }
  async queryLatestPriceRate(fromToken: Token, toToken: Token) {
    const result = await this.priceRepository.queryLatestPriceRate(
      fromToken,
      toToken,
    );
    if (!result?.length)
      throw new NotFoundException(
        `Price Not Found for ${fromToken}/${toToken}`,
      );
    return new PriceRateDto(result[0]);
  }
}
