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
var JobProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const job_service_1 = require("../services/job.service");
let JobProcessor = JobProcessor_1 = class JobProcessor {
    jobService;
    logger = new common_1.Logger(JobProcessor_1.name);
    constructor(jobService) {
        this.jobService = jobService;
    }
    async handleFetchJobs(job) {
        this.logger.debug(`Processing job ${job.id} of type ${job.name}`);
        try {
            await this.jobService.fetchAndStoreJobs();
            this.logger.debug(`Job ${job.id} completed successfully`);
        }
        catch (error) {
            this.logger.error(`Failed to process job ${job.id}: ${error.message}`);
            throw error;
        }
    }
};
exports.JobProcessor = JobProcessor;
__decorate([
    (0, bull_1.Process)('fetch-jobs'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], JobProcessor.prototype, "handleFetchJobs", null);
exports.JobProcessor = JobProcessor = JobProcessor_1 = __decorate([
    (0, bull_1.Processor)('job-queue'),
    __metadata("design:paramtypes", [job_service_1.JobService])
], JobProcessor);
//# sourceMappingURL=job.processor.js.map