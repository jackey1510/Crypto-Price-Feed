import { BigNumber, ethers } from 'ethers';

export interface PriceFeedContract extends ethers.Contract {
  latestRoundData: () => Promise<
    [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]
  >;
}
