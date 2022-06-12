import { Token } from '@common';
import { PriceOracleConfig } from '@config';
import { Inject, Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { PriceFeedContract } from '.';

@Injectable()
export class ContractFactory {
  constructor(
    private readonly provider: ethers.providers.Provider,
    @Inject('PRICE_ORACLE_CONFIG')
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

  public getAllPairs(): [Token, Token][] {
    const allPairs: [Token, Token][] = [];
    for (const fromToken in this.priceOracleConfig) {
      if (fromToken == 'abi') continue;
      for (const toToken in this.priceOracleConfig[fromToken]) {
        allPairs.push([<Token>fromToken, <Token>toToken]);
      }
    }
    return allPairs;
  }
}
