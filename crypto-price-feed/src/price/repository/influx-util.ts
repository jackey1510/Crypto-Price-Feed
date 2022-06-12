import { Point } from '@influxdata/influxdb-client';
import { SavePriceRateDto } from '../dto';

export function getPointFromSavePriceRateDto(
  priceRate: SavePriceRateDto,
): Point {
  const point = new Point(priceRate.fromToken);
  point.timestamp(priceRate.timestamp);
  point.floatField(priceRate.toToken, priceRate.price);
  return point;
}
