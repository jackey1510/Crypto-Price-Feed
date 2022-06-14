import { Module } from '@nestjs/common';
import { PriceRepository, RepositoryUtil } from './repository';
import { PriceService } from './service';
import { PriceController } from './price.controller';

@Module({
  providers: [
    PriceRepository,
    PriceService,
    { provide: 'RepositoryUtil', useClass: RepositoryUtil },
  ],
  controllers: [PriceController],
  exports: [PriceService],
})
export class PriceModule {}
