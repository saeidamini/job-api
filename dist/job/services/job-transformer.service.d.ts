import { Provider1JobDto } from '../../job/dto/provider1-job.dto';
import { Provider2JobDto } from '../../job/dto/provider2-job.dto';
import { JobOfferDto } from '../../job/dto/job-offer.dto';
export declare class JobTransformerService {
    transformProvider1Job(job: Provider1JobDto): JobOfferDto;
    transformProvider2Job(jobId: string, job: Provider2JobDto): JobOfferDto;
}
