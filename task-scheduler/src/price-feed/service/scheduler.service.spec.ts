import { PriceFetchTaskConfig } from '@config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Test, TestingModule } from '@nestjs/testing';
import { CronJob } from 'cron';
import { PriceFeedService } from '.';
import { SchedulerService } from './scheduler.service';

describe('SchedulerService', () => {
  let service: SchedulerService;
  let mockPriceFeedService: Partial<PriceFeedService>;
  let mockSchedulerRegistry: Partial<SchedulerRegistry>;
  let mockPriceFetchTaskConfig: Partial<PriceFetchTaskConfig>;
  let jobMap: Map<string, CronJob>;

  beforeEach(async () => {
    jest.useFakeTimers('modern');
    jobMap = new Map();
    mockSchedulerRegistry = {
      addCronJob: jest.fn().mockImplementation((name, job) => {
        jest.spyOn(job, 'start');
        jobMap.set(name, job);
      }),
      getCronJobs: jest.fn().mockImplementation(() => jobMap),
    };
    mockPriceFeedService = {
      fetchAllPriceFeed: jest.fn(),
    };
    mockPriceFetchTaskConfig = {
      interval: '0 * * * * *',
      runOnInit: true,
      startNow: true,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchedulerService,
        { provide: PriceFetchTaskConfig, useValue: mockPriceFetchTaskConfig },
        { provide: SchedulerRegistry, useValue: mockSchedulerRegistry },
        { provide: PriceFeedService, useValue: mockPriceFeedService },
      ],
    }).compile();

    service = module.get<SchedulerService>(SchedulerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add a job on initialize', () => {
    expect(mockSchedulerRegistry.addCronJob).toBeCalledTimes(1);
    expect(mockSchedulerRegistry.addCronJob).toBeCalledWith(
      'priceFetchJob',
      expect.any(CronJob),
    );
  });
  it('should start priceFetchJob on init', () => {
    const job = jobMap.get('priceFetchJob')!;
    expect(job).toBeDefined();
    expect(job.start).toBeCalledTimes(1);
  });
});
