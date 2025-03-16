import { Repository, DataSource } from 'typeorm';
import { JobOffer } from '../entities/job-offer.entity';
import { Company } from '../entities/company.entity';
import { Skill } from '../entities/skill.entity';
import { JobApiService } from './job-api.service';
import { JobTransformerService } from './job-transformer.service';
import { JobFilterDto } from '../dto/job-filter.dto';
export declare class JobService {
    private readonly dataSource;
    private jobOfferRepository;
    private companyRepository;
    private skillRepository;
    private readonly jobApiService;
    private readonly jobTransformerService;
    private readonly logger;
    constructor(dataSource: DataSource, jobOfferRepository: Repository<JobOffer>, companyRepository: Repository<Company>, skillRepository: Repository<Skill>, jobApiService: JobApiService, jobTransformerService: JobTransformerService);
    fetchAndStoreJobs(): Promise<void>;
    private saveJobs;
    private findOrCreateCompany;
    private updateJobSkills;
    findJobs(filter: JobFilterDto): Promise<{
        data: JobOffer[];
        total: number;
    }>;
    private getSkillIdsByNames;
    getJobById(id: string): Promise<JobOffer | null>;
}
