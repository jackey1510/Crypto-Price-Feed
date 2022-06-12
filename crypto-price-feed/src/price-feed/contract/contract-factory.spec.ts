import { Token } from '@common';
import { PriceOracleConfig } from '@config';
import { ethers } from 'ethers';
import { ContractFactory } from './contract-factory';

describe('ContractFactory', () => {
  let mockProvider: ethers.providers.Provider;
  let mockPriceOracleConfig: PriceOracleConfig;

  let factory: ContractFactory;

  beforeEach(() => {
    mockProvider = new ethers.providers.InfuraProvider();
    mockPriceOracleConfig = {
      abi: [] as any,
      BTC: {
        USD: 'https://localhost',
      },
    };
    factory = new ContractFactory(mockProvider, mockPriceOracleConfig);
  });

  afterEach(() => {
    mockProvider = {} as ethers.providers.Provider;
  });

  it('should be defined', () => {
    expect(factory).toBeDefined();
  });

  describe('getTokenPairContract', () => {
    it('should return a valid contract', () => {
      expect(
        factory.getTokenPairPriceFeedContract(Token.BTC, Token.USD),
      ).toBeInstanceOf(ethers.Contract);
    });
    it('should return null if not found', () => {
      expect(
        factory.getTokenPairPriceFeedContract(Token.BNB, Token.USD),
      ).toBeNull();
    });
  });
});
