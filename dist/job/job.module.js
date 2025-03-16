"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const axios_1 = require("@nestjs/axios");
const bull_1 = require("@nestjs/bull");
const config_1 = require("@nestjs/config");
const schedule_1 = require("@nestjs/schedule");
const job_offer_entity_1 = require("./entities/job-offer.entity");
const company_entity_1 = require("./entities/company.entity");
const skill_entity_1 = require("./entities/skill.entity");
const job_service_1 = require("./services/job.service");
const job_api_service_1 = require("./services/job-api.service");
const job_transformer_service_1 = require("./services/job-transformer.service");
const scheduler_service_1 = require("./services/scheduler.service");
const job_controller_1 = require("./controllers/job.controller");
const job_processor_1 = require("./processor/job.processor");
let JobModule = class JobModule {
};
exports.JobModule = JobModule;
exports.JobModule = JobModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([job_offer_entity_1.JobOffer, company_entity_1.Company, skill_entity_1.Skill]),
            axios_1.HttpModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    timeout: configService.get('HTTP_TIMEOUT', 5000),
                    maxRedirects: configService.get('HTTP_MAX_REDIRECTS', 5),
                }),
                inject: [config_1.ConfigService],
            }),
            bull_1.BullModule.registerQueueAsync({
                name: 'job-queue',
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    redis: {
                        host: configService.get('REDIS_HOST', 'localhost'),
                        port: configService.get('REDIS_PORT', 6379),
                    },
                    defaultJobOptions: {
                        attempts: 3,
                        removeOnComplete: true,
                        removeOnFail: false,
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            schedule_1.ScheduleModule.forRoot(),
        ],
        controllers: [job_controller_1.JobController],
        providers: [
            job_service_1.JobService,
            job_api_service_1.JobApiService,
            job_transformer_service_1.JobTransformerService,
            scheduler_service_1.SchedulerService,
            job_processor_1.JobProcessor,
        ],
        exports: [job_service_1.JobService],
    })
], JobModule);
//# sourceMappingURL=job.module.js.map