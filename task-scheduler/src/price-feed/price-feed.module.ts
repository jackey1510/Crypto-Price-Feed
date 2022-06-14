import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PriceFeedService, SchedulerService } from './service';
import { CryptoPriceFeedConfig, PriceFetchTaskConfig } from '@config';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [
    SchedulerService,
    {
      provide: CryptoPriceFeedConfig,
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return configService.get<CryptoPriceFeedConfig>(
          'CRYPTO_PRICE_FEED_CONFIG',
        );
      },
    },
    {
      provide: PriceFetchTaskConfig,
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return configService.get<PriceFetchTaskConfig>(
          'PRICE_FETCH_TASK_CONFIG',
        );
      },
    },
    PriceFeedService,
  ],
  controllers: [],
})
export class PriceFeedModule {}
