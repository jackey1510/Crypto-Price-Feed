import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { PriceModule } from './price/price.module';
import { PriceFeedModule } from './price-feed/price-feed.module';
import configuration from './config/configuration';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    DatabaseModule,
    PriceModule,
    PriceFeedModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
})
export class AppModule {}
