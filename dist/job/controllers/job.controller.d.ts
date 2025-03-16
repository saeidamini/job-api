import { JobService } from '../services/job.service';
import { SchedulerService } from '../services/scheduler.service';
import { JobFilterDto } from '../dto/job-filter.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { JobOfferDto } from '../dto/job-offer.dto';
export declare class JobController {
    private readonly jobService;
    private readonly schedulerService;
    constructor(jobService: JobService, schedulerService: SchedulerService);
    getJobs(filter: JobFilterDto, pagination: PaginationDto): Promise<{
        data: JobOfferDto[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    refreshJobs(): Promise<{
        message: string;
    }>;
    private mapToDto;
}
