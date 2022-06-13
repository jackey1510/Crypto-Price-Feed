import { Token } from '@common';

export class PricePairResultDto {
  result: string;
  table: number;
  _start: Date;
  _stop: Date;
  _time: Date;
  _value: number;
  _field: Token;
  _measurement: Token;
}

export class PriceRateDto {
  fromToken: Token;
  toToken: Token;
  price: number;
  time: Date;

  constructor(pricePairResultDto: PricePairResultDto) {
    this.fromToken = pricePairResultDto._measurement;
    this.toToken = pricePairResultDto._field;
    this.price = pricePairResultDto._value;
    this.time = pricePairResultDto._time;
  }
}
