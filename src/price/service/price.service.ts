import { Token } from '@common';
import { Point } from '@influxdata/influxdb-client';
import { Injectable } from '@nestjs/common';
import { PriceRepository } from '../repository';

@Injectable()
export class PriceService {
  constructor(private priceRepository: PriceRepository) {}

  async save() {
    const point = new Point('ETH')
      .tag('pair', 'USD')
      .floatField('price', Math.random() * 5000);
    const writeApi = this.priceRepository.getWriteApi('s', {});
    writeApi.writePoint(point);
    await writeApi.close();
  }
  async queryLatestPriceRate(fromToken: Token, toToken: Token) {
    const result = await this.priceRepository.queryLatestPriceRate(
      fromToken,
      toToken,
    );
    return result[0];
  }
}
