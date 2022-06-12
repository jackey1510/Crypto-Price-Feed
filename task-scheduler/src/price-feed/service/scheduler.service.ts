import { ClassLogger, LoggerFactory } from '@common';
import { PriceFetchTaskConfig } from '@config';
import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { PriceFeedService } from '.';

@Injectable()
@ClassLogger()
export class SchedulerService {
  private logger = LoggerFactory.getLogger(SchedulerRegistry.name);
  private static PRICE_FETCH_JOB = 'priceFetchJob';
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private readonly priceFeedService: PriceFeedService,
    private readonly priceFetchTaskConfig: PriceFetchTaskConfig,
  ) {
    this.init();
  }

  private init() {
    this.schedulerRegistry.addCronJob(
      SchedulerService.PRICE_FETCH_JOB,
      this.getPriceFeedFetchJob(),
    );
    this.schedulerRegistry.getCronJobs().forEach((job) => job.start());
  }

  private getPriceFeedFetchJob(): CronJob {
    return new CronJob(
      this.priceFetchTaskConfig.interval,
      () => {
        this.logger.log(`[${SchedulerService.PRICE_FETCH_JOB}] Starting`);
        this.priceFeedService.fetchAllPriceFeed().subscribe({
          next: () =>
            this.logger.log(`[${SchedulerService.PRICE_FETCH_JOB}] Succeed`),
          error: (error) => {
            this.logger.error(
              `[${SchedulerService.PRICE_FETCH_JOB}] Failed: ${error}`,
            );
          },
        });
      },
      () => this.logger.log(`[${SchedulerService.PRICE_FETCH_JOB}] Completed`),
      this.priceFetchTaskConfig.startNow,
      'UTC',
      this.priceFetchTaskConfig.runOnInit,
    );
  }

  public getCronJobs() {
    return this.schedulerRegistry.getCronJobs();
  }
}
