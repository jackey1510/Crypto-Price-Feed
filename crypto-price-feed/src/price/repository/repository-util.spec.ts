import { Token } from '@common';
import { PricePairResultDto, SavePriceRateDto } from '../dto';
import { RepositoryUtil } from './repository-util';

describe('RepositoryUtil', () => {
  const repositoryUtil = new RepositoryUtil();
  it('should be defined', () => {
    expect(repositoryUtil).toBeDefined();
  });

  beforeEach(() => {
    jest.useFakeTimers('modern');
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('getPointFromSavePriceRateDto', () => {
    it('fields should match payload', () => {
      const savePriceRatesDto: SavePriceRateDto = {
        fromToken: Token.BNB,
        toToken: Token.USD,
        price: 100,
        timestamp: new Date(),
      };
      const results =
        repositoryUtil.getPointFromSavePriceRateDto(savePriceRatesDto);
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

  describe('closestTimeComparator', () => {
    it('should take a timestamp and return a comparator', () => {
      const comparator: (
        a: PricePairResultDto,
        b: PricePairResultDto,
      ) => number = repositoryUtil.closestTimeComparator(Date.now());
      const oneMinDiff: any = { _time: new Date(Date.now() + 1 * 60 * 1000) };
      const fiveMinDiff: any = { _time: new Date(Date.now() - 5 * 60 * 1000) };
      const tenMinDiff: any = { _time: new Date(Date.now() - 10 * 60 * 1000) };
      const fifthMinDiff: any = {
        _time: new Date(Date.now() + 15 * 60 * 1000),
      };
      const fakeList: PricePairResultDto[] = [
        fifthMinDiff,
        fiveMinDiff,
        tenMinDiff,
        oneMinDiff,
      ];

      expect(fakeList.sort(comparator)).toStrictEqual([
        oneMinDiff,
        fiveMinDiff,
        tenMinDiff,
        fifthMinDiff,
      ]);
    });
  });
});
