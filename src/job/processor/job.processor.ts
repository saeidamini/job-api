import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { JobService } from '../services/job.service';

@Processor('job-queue')
export class JobProcessor {
  private readonly logger = new Logger(JobProcessor.name);

  constructor(private readonly jobService: JobService) {}

  @Process('fetch-jobs')
  async handleFetchJobs(job: Job) {
    this.logger.debug(`Processing job ${job.id} of type ${job.name}`);
    
    try {
      await this.jobService.fetchAndStoreJobs();
      this.logger.debug(`Job ${job.id} completed successfully`);
    } catch (error) {
      this.logger.error(`Failed to process job ${job.id}: ${error.message}`);
      throw error;
    }
  }
}