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
