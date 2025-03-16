import { Job } from 'bull';
import { JobService } from '../services/job.service';
export declare class JobProcessor {
    private readonly jobService;
    private readonly logger;
    constructor(jobService: JobService);
    handleFetchJobs(job: Job): Promise<void>;
}
