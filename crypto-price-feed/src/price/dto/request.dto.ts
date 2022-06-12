import { IsToken, Token } from '@common';
import { Transform, Type } from 'class-transformer';
import { IsPositive, IsDate, ValidateNested } from 'class-validator';

export class SavePriceRateDto {
  @IsToken()
  fromToken: Token;
  @IsToken()
  toToken: Token;
  @IsPositive()
  price: number;
  @Transform(({ value }) => new Date(value))
  @IsDate()
  timestamp: Date;
}

export class SavePriceRatesArrayDto {
  @ValidateNested({ each: true })
  @Type(() => SavePriceRateDto)
  savePriceRates: SavePriceRateDto[];
}
