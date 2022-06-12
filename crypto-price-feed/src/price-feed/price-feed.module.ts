import { PriceOracleConfig } from '@config';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { ContractFactory } from './contract';
import { PriceFeedService } from './service';
import { PriceFeedController } from './price-feed.controller';
import { PriceModule } from '@price';

@Module({
  imports: [ConfigModule, PriceModule],
  providers: [
    PriceFeedService,

    {
      provide: ethers.providers.Provider,
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        const providerUrl = configService.get<string>('ETH_PROVIDER_URL');
        return new ethers.providers.JsonRpcProvider(providerUrl);
      },
    },
    {
      provide: 'PRICE_ORACLE_CONFIG',
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return configService.get<PriceOracleConfig>('PRICE_ORACLE');
      },
    },
    ContractFactory,
  ],
  controllers: [PriceFeedController],
})
export class PriceFeedModule {}
