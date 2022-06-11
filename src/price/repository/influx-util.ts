import { Point } from '@influxdata/influxdb-client';
import { SavePriceRateDto } from '../dto';

export function getPointFromSavePriceRateDto(
  priceRate: SavePriceRateDto,
): Point {
  const point = new Point(priceRate.fromToken);
  point.tag('pair', priceRate.toToken);
  point.timestamp(priceRate.timestamp);
  point.floatField('price', priceRate.price);
  return point;
}
