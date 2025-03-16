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
var SchedulerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const bull_1 = require("@nestjs/bull");
const config_1 = require("@nestjs/config");
let SchedulerService = SchedulerService_1 = class SchedulerService {
    jobQueue;
    configService;
    logger = new common_1.Logger(SchedulerService_1.name);
    constructor(jobQueue, configService) {
        this.jobQueue = jobQueue;
        this.configService = configService;
    }
    async scheduleFetchJobs() {
        const cronExpression = this.configService.get('JOB_FETCH_CRON', schedule_1.CronExpression.EVERY_5_MINUTES);
        this.logger.log(`Scheduling job fetch with cron: ${cronExpression}`);
        try {
            await this.jobQueue.add('fetch-jobs', {
                timestamp: new Date().toISOString(),
            }, {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 5000,
                },
                removeOnComplete: true,
            });
            this.logger.log('Job successfully added to queue');
        }
        catch (error) {
            this.logger.error(`Failed to add job to queue: ${error.message}`);
        }
    }
    async triggerFetchJobs() {
        this.logger.log('Manually triggering job fetch');
        return this.scheduleFetchJobs();
    }
};
exports.SchedulerService = SchedulerService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_5_MINUTES),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SchedulerService.prototype, "scheduleFetchJobs", null);
exports.SchedulerService = SchedulerService = SchedulerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bull_1.InjectQueue)('job-queue')),
    __metadata("design:paramtypes", [Object, config_1.ConfigService])
], SchedulerService);
//# sourceMappingURL=scheduler.service.js.map