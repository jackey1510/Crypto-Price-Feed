import { ClassLogger, Token } from '@common';
import { InfluxClient } from '@database';
import {
  QueryApi,
  WriteApi,
  WriteOptions,
  WritePrecisionType
} from '@influxdata/influxdb-client';
import { Injectable } from '@nestjs/common';
import { getPointFromSavePriceRateDto } from '.';
import { PricePairResultDto, QueryPriceRateDto, SavePriceRateDto } from '../dto';

@Injectable()
@ClassLogger()
export class PriceRepository {
  private static BUCKET = 'price';
  private org: string;
  private queryApi: QueryApi;

  constructor(private influxClient: InfluxClient) {
    this.org = influxClient.getConfig().org;
    this.queryApi = this.influxClient.getQueryApi({ org: this.org });
  }

  private getWriteApi(
    precision?: WritePrecisionType,
    writeOptions?: Partial<WriteOptions>,
  ): WriteApi {
    return this.influxClient.getWriteApi(
      this.org,
      PriceRepository.BUCKET,
      precision,
      writeOptions,
    );
  }

  public queryLatestPriceRate(
    fromToken: Token,
    toToken: Token,
  ): Promise<PricePairResultDto[]> {
    const window = '2h';
    const query = `from(bucket: "${PriceRepository.BUCKET}")
                  |> range(start: -${window})
                  |> filter(fn: (r) => r["_measurement"] == "${fromToken}")
                  |> filter(fn: (r) => r["_field"] == "${toToken}")
                  |> aggregateWindow(every: 1s, fn: last, createEmpty: false)
                  |> sort(columns: ["_time"], desc: true)
                  |> limit(n:1, offset: 0)
                  |> yield(name: "last")`;
    return this.queryApi.collectRows(query);
  }

  async savePriceRates(priceRates: SavePriceRateDto[]) {
    const points = priceRates.map(getPointFromSavePriceRateDto);
    const writerApi = this.getWriteApi();
    writerApi.writePoints(points);
    return writerApi.close();
  }

  async queryPriceRateAtTime(queryPriceRateDto: QueryPriceRateDto): Promise<PricePairResultDto[]> {
    const startTime = new Date(queryPriceRateDto.time.getTime() - queryPriceRateDto.minuteTolerance * 60 * 1000);
    const query = `
      from(bucket: "${PriceRepository.BUCKET}")
      |> range(start: ${startTime.toISOString()}, stop: ${queryPriceRateDto.time.toISOString()})
      |> filter(fn: (r) => r["_measurement"] == "${queryPriceRateDto.fromToken}")
      |> filter(fn: (r) => r["_field"] == "USD")
      |> aggregateWindow(every: 10s, fn: last, createEmpty: false)
      |> sort(columns: ["_time"], desc: true)
      |> limit(n:1, offset: 0)
      |> yield(name: "last")`
    return this.queryApi.collectRows(query);
  }
}
