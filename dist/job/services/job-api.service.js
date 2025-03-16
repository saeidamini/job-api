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
var JobApiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobApiService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
let JobApiService = JobApiService_1 = class JobApiService {
    httpService;
    configService;
    logger = new common_1.Logger(JobApiService_1.name);
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
    }
    async fetchProvider1Jobs() {
        const url = this.configService.get('API_PROVIDER1_URL', 'https://assignment.devotel.io/api/provider1/jobs');
        try {
            const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url).pipe((0, rxjs_1.catchError)((error) => {
                this.logger.error(`Failed to fetch data from Provider 1: ${error.message}`);
                throw new Error(`Failed to fetch data from Provider 1: ${error.message}`);
            })));
            return data.jobs || [];
        }
        catch (error) {
            this.logger.error(`Error processing Provider 1 data: ${error.message}`);
            return [];
        }
    }
    async fetchProvider2Jobs() {
        const url = this.configService.get('API_PROVIDER2_URL', 'https://assignment.devotel.io/api/provider2/jobs');
        try {
            const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url).pipe((0, rxjs_1.catchError)((error) => {
                this.logger.error(`Failed to fetch data from Provider 2: ${error.message}`);
                throw new Error(`Failed to fetch data from Provider 2: ${error.message}`);
            })));
            return data?.data?.jobsList || {};
        }
        catch (error) {
            this.logger.error(`Error processing Provider 2 data: ${error.message}`);
            return {};
        }
    }
};
exports.JobApiService = JobApiService;
exports.JobApiService = JobApiService = JobApiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], JobApiService);
//# sourceMappingURL=job-api.service.js.map