import { Module } from '@nestjs/common';
import { PriceRepository } from './repository';
import { PriceService } from './service';
import { PriceController } from './price.controller';

@Module({
  providers: [PriceRepository, PriceService],
  controllers: [PriceController],
  exports: [PriceService],
})
export class PriceModule {}
