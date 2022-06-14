import { ClassLogger, Token } from '@common';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  AveragePriceRateDto,
  PriceRateDto,
  QueryAveragePriceRateDto,
  QueryPriceRateDto,
  SavePriceRateDto,
} from '../dto';
import { PriceRepository } from '../repository';

@Injectable()
@ClassLogger()
export class PriceService {
  constructor(private priceRepository: PriceRepository) { }

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
  async queryPriceRateAtTime(
    queryPriceRateDto: QueryPriceRateDto,
  ): Promise<PriceRateDto> {
    const result = await this.priceRepository.queryPriceRateAtTime(
      queryPriceRateDto,
    );
    if (!result?.length)
      throw new NotFoundException(
        `Price Not Found for ${queryPriceRateDto.fromToken}/${queryPriceRateDto.toToken
        } at ${queryPriceRateDto.time.toISOString()}`,
      );
    return new PriceRateDto(result[0]);
  }

  async queryPriceRateAverageWithinTimeSlot(
    queryAveragePriceRateDto: QueryAveragePriceRateDto,
  ): Promise<AveragePriceRateDto> {
    const result =
      await this.priceRepository.queryPriceRateAverageWithinTimeSlot(
        queryAveragePriceRateDto,
      );
    if (!result?.length)
      throw new NotFoundException(
        `Price Not Found for ${queryAveragePriceRateDto.fromToken}/${queryAveragePriceRateDto.toToken
        } at ${queryAveragePriceRateDto.startTime.toISOString()} - ${queryAveragePriceRateDto.endTime.toISOString()}`,
      );
    return new AveragePriceRateDto(result[0]);
  }
}
