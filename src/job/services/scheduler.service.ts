import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    @InjectQueue('job-queue') private jobQueue: Queue,
    private configService: ConfigService,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES) // Default to hourly
  async scheduleFetchJobs() {
    const cronExpression = this.configService.get<string>('JOB_FETCH_CRON', CronExpression.EVERY_5_MINUTES);
    this.logger.log(`Scheduling job fetch with cron: ${cronExpression}`);
    
    try {
      await this.jobQueue.add('fetch-jobs', {
        timestamp: new Date().toISOString(),
      }, {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000, // 5 seconds
        },
        removeOnComplete: true,
      });
      
      this.logger.log('Job successfully added to queue');
    } catch (error) {
      this.logger.error(`Failed to add job to queue: ${error.message}`);
    }
  }

  // Method to manually trigger job fetch (for testing/initial setup)
  async triggerFetchJobs() {
    this.logger.log('Manually triggering job fetch');
    return this.scheduleFetchJobs();
  }
}