"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var JobService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const job_offer_entity_1 = require("../entities/job-offer.entity");
const company_entity_1 = require("../entities/company.entity");
const skill_entity_1 = require("../entities/skill.entity");
const job_api_service_1 = require("./job-api.service");
const job_transformer_service_1 = require("./job-transformer.service");
let JobService = JobService_1 = class JobService {
    dataSource;
    jobOfferRepository;
    companyRepository;
    skillRepository;
    jobApiService;
    jobTransformerService;
    logger = new common_1.Logger(JobService_1.name);
    constructor(dataSource, jobOfferRepository, companyRepository, skillRepository, jobApiService, jobTransformerService) {
        this.dataSource = dataSource;
        this.jobOfferRepository = jobOfferRepository;
        this.companyRepository = companyRepository;
        this.skillRepository = skillRepository;
        this.jobApiService = jobApiService;
        this.jobTransformerService = jobTransformerService;
    }
    async fetchAndStoreJobs() {
        this.logger.log('Starting job fetching process');
        try {
            const provider1Jobs = await this.jobApiService.fetchProvider1Jobs();
            const provider2JobsMap = await this.jobApiService.fetchProvider2Jobs();
            const transformedJobs = [
                ...provider1Jobs.map(job => this.jobTransformerService.transformProvider1Job(job)),
                ...Object.entries(provider2JobsMap).map(([jobId, job]) => this.jobTransformerService.transformProvider2Job(jobId, job))
            ];
            this.logger.log(`Fetched ${transformedJobs.length} jobs in total`);
            await this.saveJobs(transformedJobs);
            this.logger.log('Job fetching process completed successfully');
        }
        catch (error) {
            this.logger.error(`Job fetching process failed: ${error.message}`);
            throw error;
        }
    }
    async saveJobs(jobOffers) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            for (const jobOffer of jobOffers) {
                const existingJob = await this.jobOfferRepository.findOne({
                    where: { externalJobId: jobOffer.externalJobId }
                });
                if (existingJob) {
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
                    const company = await this.findOrCreateCompany({
                        name: jobOffer.companyName,
                        industry: jobOffer.industry ?? null,
                        website: jobOffer.website ?? null,
                    });
                    existingJob.company = company;
                    existingJob.companyId = company.id;
                    await queryRunner.manager.save(existingJob);
                    await this.updateJobSkills(queryRunner, existingJob, jobOffer.skills || []);
                }
                else {
                    const company = await this.findOrCreateCompany({
                        name: jobOffer.companyName,
                        industry: jobOffer.industry ?? null,
                        website: jobOffer.website ?? null,
                    });
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
                    const savedJobOffer = await queryRunner.manager.save(newJobOffer);
                    if (jobOffer.skills && jobOffer.skills.length > 0) {
                        await this.updateJobSkills(queryRunner, savedJobOffer, jobOffer.skills);
                    }
                }
            }
            await queryRunner.commitTransaction();
            this.logger.log('Successfully saved job data to database');
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`Failed to save job data: ${error.message}`);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async findOrCreateCompany(companyData) {
        let company = await this.companyRepository.findOne({
            where: { name: companyData.name }
        });
        if (!company) {
            company = new company_entity_1.Company();
            company.name = companyData.name;
            company.industry = companyData.industry || '';
            company.website = companyData.website || '';
            await this.companyRepository.save(company);
        }
        return company;
    }
    async updateJobSkills(queryRunner, jobOffer, skillNames) {
        const skills = [];
        for (const skillName of skillNames) {
            let skill = await this.skillRepository.findOne({
                where: { name: skillName }
            });
            if (!skill) {
                skill = new skill_entity_1.Skill();
                skill.name = skillName;
                await queryRunner.manager.save(skill);
            }
            skills.push(skill);
        }
        jobOffer.skills = skills;
        await queryRunner.manager.save(jobOffer);
    }
    async findJobs(filter) {
        const { title, location, minSalary, maxSalary, skills, page = 1, limit = 10 } = filter;
        const where = {};
        if (title) {
            where.title = (0, typeorm_2.ILike)(`%${title}%`);
        }
        if (location) {
            where.location = (0, typeorm_2.ILike)(`%${location}%`);
        }
        if (minSalary && maxSalary) {
            where.salaryMin = minSalary ? (0, typeorm_2.Between)(minSalary, Number.MAX_SAFE_INTEGER) : undefined;
            where.salaryMax = maxSalary ? (0, typeorm_2.Between)(0, maxSalary) : undefined;
        }
        else if (minSalary) {
            where.salaryMin = minSalary ? (0, typeorm_2.Between)(minSalary, Number.MAX_SAFE_INTEGER) : undefined;
        }
        else if (maxSalary) {
            where.salaryMax = maxSalary ? (0, typeorm_2.Between)(0, maxSalary) : undefined;
        }
        let skillsQuery = null;
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
                    where: (qb) => {
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
    async getSkillIdsByNames(skillNames) {
        const skills = await this.skillRepository.find({
            where: skillNames.map(name => ({ name: (0, typeorm_2.ILike)(`%${name}%`) }))
        });
        return skills.map(skill => skill.id);
    }
    async getJobById(id) {
        return this.jobOfferRepository.findOne({
            where: { id },
            relations: ['company', 'skills'],
        });
    }
};
exports.JobService = JobService;
exports.JobService = JobService = JobService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(job_offer_entity_1.JobOffer)),
    __param(2, (0, typeorm_1.InjectRepository)(company_entity_1.Company)),
    __param(3, (0, typeorm_1.InjectRepository)(skill_entity_1.Skill)),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        job_api_service_1.JobApiService,
        job_transformer_service_1.JobTransformerService])
], JobService);
//# sourceMappingURL=job.service.js.map