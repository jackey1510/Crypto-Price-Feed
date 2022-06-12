export class PriceFetchTaskConfig {
  interval: string;
  startNow: boolean;
  runOnInit: boolean;
}

function parseBoolean(bool: string): boolean {
  return bool?.toUpperCase() === 'TRUE';
}

export class CryptoPriceFeedConfig {
  url: string;
}

export default (): {
  PRICE_FETCH_TASK_CONFIG: PriceFetchTaskConfig;
  CRYPTO_PRICE_FEED_CONFIG: CryptoPriceFeedConfig;
} => {
  return {
    PRICE_FETCH_TASK_CONFIG: {
      interval: process.env.PRICE_FETCH_INTERVAL,
      startNow: parseBoolean(process.env.PRICE_FETCH_START_NOW),
      runOnInit: parseBoolean(process.env.PRICE_FETCH_RUN_ON_INIT),
    },
    CRYPTO_PRICE_FEED_CONFIG: {
      url: process.env.CRYPTO_PRICE_FEED_URL,
    },
  };
};
