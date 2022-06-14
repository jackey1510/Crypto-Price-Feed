import { IsToken, Token } from '@common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsInt, IsOptional, IsPositive } from 'class-validator';

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

export class QueryUSDPriceRateDto {
  @IsToken()
  fromToken: Token;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  @ApiProperty({example: '2022-06-01T00:00:00Z'})
  time: Date;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  minuteTolerance: number = 15
}

export class QueryPriceRateDto {
  @IsToken()
  fromToken: Token;

  @IsToken()
  toToken: Token;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  @ApiProperty({example: '2022-06-01T00:00:00Z'})
  time: Date;

  @IsOptional()
  @IsPositive()
  minuteTolerance: number = 15
}
