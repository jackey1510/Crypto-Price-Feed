declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      INFLUX_DB_URL: string;
      INFLUX_DB_TOKEN: string;
      INFLUX_DB_ORG: string;
      ETH_PROVIDER_URL: string;
      ETH_USD_ADDRESS: string;
      BTC_USD_ADDRESS: string;
      MATIC_USD_ADDRESS: string;
      BNB_USD_ADDRESS: string;
      CHAINLINK_PRICE_ORACLE_ABI: string;
    }
  }
}

export {}
