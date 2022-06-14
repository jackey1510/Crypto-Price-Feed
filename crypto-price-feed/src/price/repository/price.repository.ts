import { ClassLogger, Token } from '@common';
import { InfluxClient } from '@database';
import {
  QueryApi,
  WriteApi,
  WriteOptions,
  WritePrecisionType,
} from '@influxdata/influxdb-client';
import { Inject, Injectable } from '@nestjs/common';
import {
  PricePairResultDto,
  QueryAveragePriceRateDto,
  QueryPriceRateDto,
  SavePriceRateDto,
} from '../dto';
import { RepositoryUtil } from './';

@Injectable()
@ClassLogger()
export class PriceRepository {
  private static BUCKET = 'price';
  private org: string;
  private queryApi: QueryApi;

  constructor(
    private influxClient: InfluxClient,
    @Inject('RepositoryUtil') private repositoryUtil: RepositoryUtil,
  ) {
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
    const points = priceRates.map(
      this.repositoryUtil.getPointFromSavePriceRateDto,
    );
    const writerApi = this.getWriteApi();
    writerApi.writePoints(points);
    return writerApi.close();
  }

  async queryPriceRateAtTime({
    fromToken,
    minuteTolerance,
    toToken,
    time,
  }: QueryPriceRateDto): Promise<PricePairResultDto[]> {
    const startTime = new Date(time.getTime() - minuteTolerance * 60 * 1000);
    const endTime = new Date(time.getTime() + minuteTolerance * 60 * 1000);
    const query = `
      from(bucket: "${PriceRepository.BUCKET}")
      |> range(start: ${startTime.toISOString()}, stop: ${endTime.toISOString()})
      |> filter(fn: (r) => r["_measurement"] == "${fromToken}")
      |> filter(fn: (r) => r["_field"] == "${toToken}")
      |> aggregateWindow(every: 1s, fn: mean, createEmpty: false)
      |> limit(n:100, offset: 0)
      |> yield(name: "mean")`;
    const result: PricePairResultDto[] = await this.queryApi.collectRows(query);

    const actualTimeStamp = time.getTime();
    const sorted = result.sort(
      this.repositoryUtil.closestTimeComparator(actualTimeStamp),
    );
    return sorted;
  }

  async queryPriceRateAverageWithinTimeSlot(
    queryAveragePriceRateDto: QueryAveragePriceRateDto,
  ): Promise<PricePairResultDto[]> {
    const { endTime, fromToken, startTime, toToken } = queryAveragePriceRateDto;

    const window = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

    const query = `
      from(bucket: "price")
      |> range(start: ${startTime.toISOString()}, stop: ${endTime.toISOString()})
      |> filter(fn: (r) => r["_measurement"] == "${fromToken}")
      |> filter(fn: (r) => r["_field"] == "${toToken}")
      |> aggregateWindow(every: ${window}s, fn: mean, createEmpty: false)
      |> yield(name: "mean")`;

    return this.queryApi.collectRows(query);
  }
}
