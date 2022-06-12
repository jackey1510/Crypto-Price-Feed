import { ClassLogger, Token } from '@common';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PriceService, SavePriceRateDto } from '@price';
import { ContractFactory } from '../contract';
import { LatestRoundData } from '../dto/response.dto';

@Injectable()
@ClassLogger()
export class PriceFeedService {
  constructor(
    private readonly contractFactory: ContractFactory,
    // private schedulerRegistry: SchedulerRegistry,
    @Inject('PRICE_FETCH_INTERVAL')
    private readonly priceService: PriceService,
  ) {}

  public async fetchAllPriceFeed() {
    const availablePairs = this.contractFactory.getAllPairs();
    const latestPriceFeeds = await Promise.all(
      availablePairs.map(([fromToken, toToken]) =>
        this.getTokenLatestPriceFeed(fromToken, toToken),
      ),
    );
    const savePriceRateDtos: SavePriceRateDto[] = latestPriceFeeds.map(
      (feed) => ({
        fromToken: feed.fromToken,
        toToken: feed.toToken,
        price: feed.price,
        timestamp: feed.updatedAt,
      }),
    );
    await this.priceService.savePriceRates(savePriceRateDtos);
  }

  public async getTokenLatestPriceFeed(fromToken: Token, toToken: Token) {
    const contract = this.contractFactory.getTokenPairPriceFeedContract(
      fromToken,
      toToken,
    );
    if (!contract) throw new BadRequestException('Token Pair not supported');
    const result = await contract.latestRoundData();
    return new LatestRoundData(result, fromToken, toToken);
  }
}
