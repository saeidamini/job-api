import { Queue } from 'bull';
import { ConfigService } from '@nestjs/config';
export declare class SchedulerService {
    private jobQueue;
    private configService;
    private readonly logger;
    constructor(jobQueue: Queue, configService: ConfigService);
    scheduleFetchJobs(): Promise<void>;
    triggerFetchJobs(): Promise<void>;
}
