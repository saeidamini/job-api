import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Between, Like, ILike, In, FindOperator } from 'typeorm';
import { JobOffer } from '../entities/job-offer.entity';
import { Company } from '../entities/company.entity';
import { Skill } from '../entities/skill.entity';
import { JobApiService } from './job-api.service';
import { JobTransformerService } from './job-transformer.service';
import { JobFilterDto } from '../dto/job-filter.dto';
import { PaginationDto } from '../dto/pagination.dto';

@Injectable()
export class JobService {
  private readonly logger = new Logger(JobService.name);

  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(JobOffer)
    private jobOfferRepository: Repository<JobOffer>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectRepository(Skill)
    private skillRepository: Repository<Skill>,
    private readonly jobApiService: JobApiService,
    private readonly jobTransformerService: JobTransformerService,
  ) {}

  async fetchAndStoreJobs(): Promise<void> {
    this.logger.log('Starting job fetching process');
    
    try {
      // Fetch jobs from Provider 1
      const provider1Jobs = await this.jobApiService.fetchProvider1Jobs();
      
      // Fetch jobs from Provider 2
      const provider2JobsMap = await this.jobApiService.fetchProvider2Jobs();
      
      // Transform jobs to unified structure
      const transformedJobs = [
        ...provider1Jobs.map(job => this.jobTransformerService.transformProvider1Job(job)),
        ...Object.entries(provider2JobsMap).map(([jobId, job]) => 
          this.jobTransformerService.transformProvider2Job(jobId, job)
        )
      ];
      
      this.logger.log(`Fetched ${transformedJobs.length} jobs in total`);
      
      // Store jobs in database
      await this.saveJobs(transformedJobs);
      
      this.logger.log('Job fetching process completed successfully');
    } catch (error) {
      this.logger.error(`Job fetching process failed: ${error.message}`);
      throw error;
    }
  }

  private async saveJobs(jobOffers: any[]): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      for (const jobOffer of jobOffers) {
        // Check if job already exists
        const existingJob = await this.jobOfferRepository.findOne({
          where: { externalJobId: jobOffer.externalJobId }
        });
        
        if (existingJob) {
          // Update existing job
          existingJob.title = jobOffer.title;
          existingJob.location = jobOffer.location;
          existingJob.state = jobOffer.state ?? existingJob.state;
          existingJob.remote = jobOffer.remote ?? existingJob.remote;
          existingJob.type = jobOffer.type ?? existingJob.type;
          existingJob.salaryMin = jobOffer.salaryMin ?? existingJob.salaryMin;
          existingJob.salaryMax = jobOffer.salaryMax ?? existingJob.salaryMax;
          existingJob.currency = jobOffer.currency ?? existingJob.currency;
          existingJob.experience = jobOffer.experience ?? existingJob.experience;
          existingJob.postedDate = jobOffer.postedDate;
          
          // Update company
          const company = await this.findOrCreateCompany({
            name: jobOffer.companyName,
            industry: jobOffer.industry ?? null,
            website: jobOffer.website ?? null,
          });
          
          existingJob.company = company;
          existingJob.companyId = company.id;
          
          await queryRunner.manager.save(existingJob);
          
          // Update skills
          await this.updateJobSkills(queryRunner, existingJob, jobOffer.skills || []);
        } else {
          // Find or create company
          const company = await this.findOrCreateCompany({
            name: jobOffer.companyName,
            industry: jobOffer.industry ?? null,
            website: jobOffer.website ?? null,
          });
          
          // Create job offer
          const newJobOffer = this.jobOfferRepository.create({
            externalJobId: jobOffer.externalJobId,
            title: jobOffer.title,
            location: jobOffer.location,
            state: jobOffer.state ?? null,
            remote: jobOffer.remote ?? false,
            type: jobOffer.type ?? null,
            salaryMin: jobOffer.salaryMin ?? null,
            salaryMax: jobOffer.salaryMax ?? null,
            currency: jobOffer.currency ?? 'USD',
            company,
            companyId: company.id,
            experience: jobOffer.experience ?? null,
            postedDate: jobOffer.postedDate,
            source: jobOffer.source,
          });
          
          // Save job offer
          const savedJobOffer = await queryRunner.manager.save(newJobOffer);
          
          // Process skills
          if (jobOffer.skills && jobOffer.skills.length > 0) {
            await this.updateJobSkills(queryRunner, savedJobOffer, jobOffer.skills);
          }
        }
      }
      
      await queryRunner.commitTransaction();
      this.logger.log('Successfully saved job data to database');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Failed to save job data: ${error.message}`);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async findOrCreateCompany(companyData: { 
    name: string; 
    industry: string | null; 
    website: string | null; 
  }): Promise<Company> {
    let company = await this.companyRepository.findOne({
      where: { name: companyData.name }
    });
    
    if (!company) {
      // Fix the create syntax
      company = new Company();
      company.name = companyData.name;
      company.industry = companyData.industry || '';
      company.website = companyData.website || '';
      await this.companyRepository.save(company);
    }
    
    return company;
  }

  private async updateJobSkills(queryRunner: any, jobOffer: JobOffer, skillNames: string[]): Promise<void> {
    // Initialize properly typed array
    const skills: Skill[] = [];
    
    for (const skillName of skillNames) {
      let skill = await this.skillRepository.findOne({
        where: { name: skillName }
      });
      
      if (!skill) {
        skill = new Skill();
        skill.name = skillName;
        await queryRunner.manager.save(skill);
      }
      
      skills.push(skill);
    }
    
    jobOffer.skills = skills;
    await queryRunner.manager.save(jobOffer);
  }

  async findJobs(filter: JobFilterDto, pagination: PaginationDto): Promise<{ data: JobOffer[], total: number }> {
    const { title, location, minSalary, maxSalary, skills, page = pagination?.page || 1, limit = pagination?.limit || 10 } = filter;
    
    // Build the query builder
    let queryBuilder = this.jobOfferRepository.createQueryBuilder('jobOffer')
      .leftJoinAndSelect('jobOffer.company', 'company')
      .leftJoinAndSelect('jobOffer.skills', 'skills');
    
    // Apply basic filters
    if (title) {
      queryBuilder.andWhere('jobOffer.title ILIKE :title', { title: `%${title}%` });
    }
    
    if (location) {
      queryBuilder.andWhere('jobOffer.location ILIKE :location', { location: `%${location}%` });
    }
    
    // Handle salary range filtering
    if (minSalary) {
      queryBuilder.andWhere('jobOffer.salaryMin >= :minSalary', { minSalary });
    }
    
    if (maxSalary) {
      queryBuilder.andWhere('jobOffer.salaryMax <= :maxSalary', { maxSalary });
    }
    
    // Handle skills filtering
    if (skills && skills.length > 0) {
      const skillIds = await this.getSkillIdsByNames(skills);
      
      if (skillIds.length > 0) {
        // Create a subquery to get job IDs with ALL required skills
        const subQuery = this.dataSource
          .createQueryBuilder()
          .select('jos.jobOfferId')
          .from('job_offer_skills', 'jos')
          .where('jos.skillId IN (:...skillIds)', { skillIds })
          .groupBy('jos.jobOfferId')
          .having('COUNT(DISTINCT jos.skillId) = :skillCount', { skillCount: skillIds.length });
        
        // Add the subquery to the main query
        queryBuilder.andWhere(`jobOffer.id IN (${subQuery.getQuery()})`)
          .setParameters(subQuery.getParameters());
      }
    }
    
    // Apply ordering
    queryBuilder.orderBy('jobOffer.postedDate', 'DESC');
    
    // Get total count
    const total = await queryBuilder.getCount();
    
    // Apply pagination
    queryBuilder.skip((page - 1) * limit).take(limit);
    
    // Get data
    const data = await queryBuilder.getMany();
    
    return { data, total };
  }
  
  async findJobsOld(filter: JobFilterDto, pagination: PaginationDto): Promise<{ data: JobOffer[], total: number }> {
    const { title, location, minSalary, maxSalary, skills, page = pagination?.page || 1, limit = pagination?.limit || 10 } = filter;
    
    const where: any = {};
    
    if (title) {
      where.title = ILike(`%${title}%`);
    }
    
    if (location) {
      where.location = ILike(`%${location}%`);
    }
    
    // Handle salary range filtering
    if (minSalary && maxSalary) {
      where.salaryMin = minSalary ? Between(minSalary, Number.MAX_SAFE_INTEGER) : undefined;
      where.salaryMax = maxSalary ? Between(0, maxSalary) : undefined;
    } else if (minSalary) {
      where.salaryMin = minSalary ? Between(minSalary, Number.MAX_SAFE_INTEGER) : undefined;
    } else if (maxSalary) {
      where.salaryMax = maxSalary ? Between(0, maxSalary) : undefined;
    }
    
    // Handle skills filtering
    let skillsQuery: any = null;
    if (skills && skills.length > 0) {
      const skillIds = await this.getSkillIdsByNames(skills);
      if (skillIds.length > 0) {
        skillsQuery = {
          join: {
            alias: "jobOffer",
            leftJoinAndSelect: {
              skills: "jobOffer.skills"
            }
          },
          where: (qb: any) => {
            qb.andWhere('skills.id IN (:...skillIds)', { skillIds });
          }
        };
      }
    }
    
    const [data, total] = await this.jobOfferRepository.findAndCount({
      where,
      relations: ['company', 'skills'],
      skip: (page - 1) * limit,
      take: limit,
      order: {
        postedDate: 'DESC'
      },
      ...(skillsQuery || {})
    });
    
    return { data, total };
  }

  private async getSkillIdsByNames(skillNames: string | string[]): Promise<string[]> {
    if (!Array.isArray(skillNames)) {
      skillNames = [skillNames];
    }
    const skills = await this.skillRepository.find({
      where: skillNames.map(name => ({ name: ILike(`%${name}%`) }))
    });
    console.debug(skills);
    return skills.map(skill => skill.id);
  }

  async getJobById(id: string): Promise<JobOffer | null> {
    return this.jobOfferRepository.findOne({
      where: { id },
      relations: ['company', 'skills'],
    });
  }
}