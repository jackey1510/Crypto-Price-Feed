import { BigNumber } from 'ethers';

export class LatestRoundData {
  roundId: string;
  price: number;
  startedAt: Date;
  updatedAt: Date;
  answeredInRound: string;
  constructor(
    response: [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber],
  ) {
    this.roundId = response[0].toString();
    this.price = +response[1] / 100000000;
    this.startedAt = new Date(response[2].toNumber() * 1000);
    this.updatedAt = new Date(response[3].toNumber() * 1000);
    this.answeredInRound = response[4].toString();
  }
}
