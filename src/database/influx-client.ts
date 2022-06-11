import { InfluxConfig } from '@config';
import { InfluxDB } from '@influxdata/influxdb-client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InfluxClient extends InfluxDB {
  constructor(private config: InfluxConfig) {
    super(config);
  }

  public getConfig(): InfluxConfig {
    return this.config;
  }
}
