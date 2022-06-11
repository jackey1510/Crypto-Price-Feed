import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { Token } from '../tokens';

export function IsToken() {
  return applyDecorators(
    IsNotEmpty(),
    Transform(({ value }) => value?.toUpperCase()),
    IsEnum(Token),
  );
}
