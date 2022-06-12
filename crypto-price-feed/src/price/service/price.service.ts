import { ClassLogger, Token } from '@common';
import { Injectable } from '@nestjs/common';
import { SavePriceRateDto } from '../dto';
import { PriceRepository } from '../repository';

@Injectable()
@ClassLogger()
export class PriceService {
  constructor(private priceRepository: PriceRepository) {}

  async savePriceRates(savePriceRateDtos: SavePriceRateDto[]) {
    return this.priceRepository.savePriceRates(savePriceRateDtos);
  }
  async queryLatestPriceRate(fromToken: Token, toToken: Token) {
    const [result] = await this.priceRepository.queryLatestPriceRate(
      fromToken,
      toToken,
    );
    return result;
  }
}
