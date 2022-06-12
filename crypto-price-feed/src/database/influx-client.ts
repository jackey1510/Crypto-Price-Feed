import { InfluxConfig } from '@config';
import { InfluxDB } from '@influxdata/influxdb-client';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class InfluxClient extends InfluxDB {
  constructor(@Inject('INFLUX_CONFIG') private config: InfluxConfig) {
    super(config);
  }

  public getConfig(): InfluxConfig {
    return this.config;
  }
}
