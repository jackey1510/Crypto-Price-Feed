import { Point } from '@influxdata/influxdb-client';
import { Injectable } from '@nestjs/common';
import { PricePairResultDto, SavePriceRateDto } from '../dto';

@Injectable()
export class RepositoryUtil {
  closestTimeComparator(
    timestamp: number,
  ): (a: PricePairResultDto, b: PricePairResultDto) => number {
    return (a, b) => {
      return (
        Math.abs(new Date(a._time).getTime() - timestamp) -
        Math.abs(new Date(b._time).getTime() - timestamp)
      );
    };
  }
  getPointFromSavePriceRateDto(priceRate: SavePriceRateDto): Point {
    const point = new Point(priceRate.fromToken);
    point.timestamp(priceRate.timestamp);
    point.floatField(priceRate.toToken, priceRate.price);
    return point;
  }
}
