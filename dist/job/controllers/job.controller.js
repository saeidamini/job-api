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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const job_service_1 = require("../services/job.service");
const scheduler_service_1 = require("../services/scheduler.service");
const job_filter_dto_1 = require("../dto/job-filter.dto");
const pagination_dto_1 = require("../dto/pagination.dto");
const job_offer_response_dto_1 = require("../dto/job-offer-response.dto");
let JobController = class JobController {
    jobService;
    schedulerService;
    constructor(jobService, schedulerService) {
        this.jobService = jobService;
        this.schedulerService = schedulerService;
    }
    async getJobs(filter, pagination) {
        try {
            const { data, total } = await this.jobService.findJobs(filter);
            return {
                data: data.map(job => this.mapToDto(job)),
                meta: {
                    total,
                    page: pagination.page || 1,
                    limit: pagination.limit || 10,
                    totalPages: Math.ceil(total / (pagination.limit || 10)),
                },
            };
        }
        catch (error) {
            throw new common_1.HttpException(`Failed to fetch job offers: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async refreshJobs() {
        try {
            await this.schedulerService.triggerFetchJobs();
            return { message: 'Job fetch process triggered successfully' };
        }
        catch (error) {
            throw new common_1.HttpException(`Failed to trigger job fetch: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    mapToDto(job) {
        return {
            externalJobId: job.externalJobId,
            title: job.title,
            location: job.location,
            state: job.state || undefined,
            remote: job.remote || false,
            type: job.type || undefined,
            salaryMin: job.salaryMin || undefined,
            salaryMax: job.salaryMax || undefined,
            currency: job.currency || 'USD',
            companyName: job.company?.name || 'Unknown Company',
            industry: job.company?.industry || undefined,
            website: job.company?.website || undefined,
            experience: job.experience || undefined,
            postedDate: job.postedDate,
            skills: job.skills?.map(skill => skill.name) || [],
            source: job.source
        };
    }
};
exports.JobController = JobController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get job offers with filtering and pagination' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Returns paginated job offers',
        type: job_offer_response_dto_1.JobOfferResponseDto,
    }),
    (0, swagger_1.ApiQuery)({ name: 'title', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'location', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'minSalary', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'maxSalary', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'skills', required: false, type: [String] }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [job_filter_dto_1.JobFilterDto,
        pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], JobController.prototype, "getJobs", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, swagger_1.ApiOperation)({ summary: 'Manually trigger job fetch' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Job fetch process triggered',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], JobController.prototype, "refreshJobs", null);
exports.JobController = JobController = __decorate([
    (0, swagger_1.ApiTags)('jobs'),
    (0, common_1.Controller)('api/job-offers'),
    __metadata("design:paramtypes", [job_service_1.JobService,
        scheduler_service_1.SchedulerService])
], JobController);
//# sourceMappingURL=job.controller.js.map