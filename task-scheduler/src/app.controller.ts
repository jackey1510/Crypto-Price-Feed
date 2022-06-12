import { Controller, Get } from '@nestjs/common';
import { version } from '../package.json';

@Controller()
export class AppController {
  private startTime: number = Date.now();

  @Get('/')
  health() {
    return {
      status: 'ok',
      startTime: this.startTime,
      version,
    };
  }
}
