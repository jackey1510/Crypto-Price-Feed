import { PriceOracleConfig } from '@config';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { ContractFactory } from './contract';
import { PriceFeedService } from './service';
import { PriceFeedController } from './price-feed.controller';

@Module({
  imports: [ConfigModule],
  providers: [
    PriceFeedService,
    {
      provide: ContractFactory,
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        const providerUrl = configService.get<string>('ETH_PROVIDER_URL');
        const provider = new ethers.providers.JsonRpcProvider(providerUrl);
        const priceOracleConfig =
          configService.get<PriceOracleConfig>('PRICE_ORACLE')!;
        return new ContractFactory(provider, priceOracleConfig);
      },
    },
  ],
  controllers: [PriceFeedController],
})
export class PriceFeedModule {}
