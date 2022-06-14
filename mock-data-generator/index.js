// @ts-check
const { InfluxDB } = require("@influxdata/influxdb-client");

const token = "secret-token";
const org = "crypto-price-feed";
const bucket = "price";

const client = new InfluxDB({ url: "http://localhost:8086", token: token });

const { Point } = require("@influxdata/influxdb-client");
const writeApi = client.getWriteApi(org, bucket);

/**
 * @param {number} min
 * @param {number} max
 */
function randomNumberGenerator(min, max) {
  return min + Math.random() * (max - min);
}

/**
 * @param {string} token
 * @param {number} min
 * @param {number} max
 * @param {number} startTimestamp
 * @param {number} size
 */
function pointGenerator(token, min, max, startTimestamp, size) {
  const points = [];
  for (let i = 0; i < size; i++) {
    const point = new Point(token)
      .floatField("USD", randomNumberGenerator(min, max))
      .timestamp(new Date(randomNumberGenerator(startTimestamp, Date.now())));
    points.push(point);
  }
  return points;
}

function main() {
  const tokens = {
    BNB: {
      min: 200,
      max: 350,
    },
    BTC: {
      min: 29000,
      max: 38000,
    },
    ETH: {
      min: 1100,
      max: 2000,
    },
    MATIC: {
      min: 0.4,
      max: 1.2,
    },
  };
  const startTimestamp = Date.now() - 86400 * 365 * 1000; // 1 year ago
  const points = Object.keys(tokens)
    .map((token) =>
      pointGenerator(
        token,
        tokens[token].min,
        tokens[token].max,
        startTimestamp,
        10000
      )
    )
    .flat();
  writeApi.writePoints(points);
  writeApi.close().then(() => console.log("success"), console.error);
}

main();
