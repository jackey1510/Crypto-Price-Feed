import { InfluxConfig } from '@config';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InfluxClient } from './influx-client';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: InfluxClient,
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return new InfluxClient(configService.get<InfluxConfig>('INFLUX_DB')!);
      },
    },
  ],
  exports: [InfluxClient],
})
export class DatabaseModule {}
