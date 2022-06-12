declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      PRICE_FETCH_RUN_ON_INIT: string;
      PRICE_FETCH_INTERVAL: string;
      PRICE_FETCH_START_NOW: string;
      CRYPTO_PRICE_FEED_URL: string;
    }
  }
}

export {}
