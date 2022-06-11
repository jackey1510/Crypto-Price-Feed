import { Token } from '@common';
import { PriceOracleConfig } from '@config';
import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { PriceFeedContract } from '.';

@Injectable()
export class ContractFactory {
  constructor(
    private readonly provider: ethers.providers.Provider,
    private readonly priceOracleConfig: PriceOracleConfig,
  ) {}

  public getTokenPairPriceFeedContract(
    fromToken: Token,
    toToken: Token,
  ): PriceFeedContract | null {
    const address = this.findContractAddress(fromToken, toToken);
    if (!address) return null;
    return new ethers.Contract(
      address,
      this.priceOracleConfig.abi,
      this.provider,
    ) as PriceFeedContract;
  }

  private findContractAddress(
    fromToken: Token,
    toToken: Token,
  ): string | undefined {
    return this.priceOracleConfig[fromToken]?.[toToken];
  }
}
