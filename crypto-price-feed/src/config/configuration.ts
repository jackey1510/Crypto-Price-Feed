import { ClientOptions } from '@influxdata/influxdb-client';

export interface PriceOracleConfig {
  [key: string]: Record<string, string>;
  abi: any;
}

export interface InfluxConfig extends ClientOptions {
  org: string;
  token: string;
}

export default () => {
  return {
    INFLUX_DB: {
      url: process.env.INFLUX_DB_URL,
      token: process.env.INFLUX_DB_TOKEN,
      org: process.env.INFLUX_DB_ORG,
    },
    ETH_PROVIDER_URL: process.env.ETH_PROVIDER_URL,
    PRICE_ORACLE: {
      abi: JSON.parse(process.env.CHAINLINK_PRICE_ORACLE_ABI),
      BNB: {
        USD: process.env.BNB_USD_ADDRESS,
      },
      BTC: {
        USD: process.env.BTC_USD_ADDRESS,
      },
      ETH: {
        USD: process.env.ETH_USD_ADDRESS,
      },
      MATIC: {
        USD: process.env.MATIC_USD_ADDRESS,
      },
    },
  };
};
