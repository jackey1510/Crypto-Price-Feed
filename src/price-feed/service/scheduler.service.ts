import { ClassLogger } from '@common';
import { Injectable } from '@nestjs/common';

@Injectable()
@ClassLogger()
export class SchedulerService {}
