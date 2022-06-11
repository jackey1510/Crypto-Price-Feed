import { Token } from '@common';
import { InfluxClient } from '@database';
import {
  QueryApi,
  WriteApi,
  WriteOptions,
  WritePrecisionType,
} from '@influxdata/influxdb-client';
import { Injectable } from '@nestjs/common';
import { PricePairResultDto } from '../dto';

@Injectable()
export class PriceRepository {
  private static BUCKET = 'price';
  private org: string;
  private queryApi: QueryApi;

  constructor(private influxClient: InfluxClient) {
    this.org = influxClient.getConfig().org;
    this.queryApi = this.influxClient.getQueryApi({ org: this.org });
  }

  public getWriteApi(
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
    const window = '24h';
    const query = `from(bucket: "${PriceRepository.BUCKET}")
                  |> range(start: -${window}, stop: -0s)
                  |> filter(fn: (r) => r["_measurement"] == "${fromToken}")
                  |> filter(fn: (r) => r["_field"] == "price")
                  |> filter(fn: (r) => r["pair"] == "${toToken}")
                  |> aggregateWindow(every: ${window}, fn: last, createEmpty: false)
                  |> yield(name: "last")
                  `;
    return this.queryApi.collectRows(query);
  }
}
