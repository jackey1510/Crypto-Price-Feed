import { Token } from '@common';
import { getPointFromSavePriceRateDto } from '.';
import { SavePriceRateDto } from '../dto';

describe('getPointFromSavePriceRateDto', () => {
  beforeEach(() => {
    jest.useFakeTimers('modern');
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('fields should match payload', () => {
    const savePriceRatesDto: SavePriceRateDto = {
      fromToken: Token.BNB,
      toToken: Token.USD,
      price: 100,
      timestamp: new Date(),
    };
    const results = getPointFromSavePriceRateDto(savePriceRatesDto);
    expect(results.fields).toStrictEqual({
      USD: savePriceRatesDto.price.toString(),
    });
    expect(results.toString()).toEqual(
      `${savePriceRatesDto.fromToken} USD=${savePriceRatesDto.price} ${
        savePriceRatesDto.timestamp.getTime() * 1000000
      }`, //ms -> ns
    );
  });
});
