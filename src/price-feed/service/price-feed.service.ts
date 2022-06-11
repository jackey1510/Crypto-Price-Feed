import { Token } from '@common';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ContractFactory } from '../contract';
import { LatestRoundData } from '../dto/response.dto';

@Injectable()
export class PriceFeedService {
  constructor(private readonly contractFactory: ContractFactory) {}

  public async getTokenLatestPriceFeed(fromToken: Token, toToken: Token) {
    const contract = this.contractFactory.getTokenPairPriceFeedContract(
      fromToken,
      toToken,
    );
    if (!contract) throw new BadRequestException('Token Pair not supported');
    const result = await contract.latestRoundData();
    return new LatestRoundData(result);
  }
}
