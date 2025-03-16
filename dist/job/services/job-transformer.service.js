"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobTransformerService = void 0;
const common_1 = require("@nestjs/common");
let JobTransformerService = class JobTransformerService {
    transformProvider1Job(job) {
        const salaryRangeMatch = job.details.salaryRange.match(/\$(\d+)k\s*-\s*\$(\d+)k/);
        const salaryMin = salaryRangeMatch ? parseInt(salaryRangeMatch[1]) * 1000 : null;
        const salaryMax = salaryRangeMatch ? parseInt(salaryRangeMatch[2]) * 1000 : null;
        const locationParts = job.details.location.split(',').map(part => part.trim());
        const location = locationParts[0];
        const state = locationParts.length > 1 ? locationParts[1] : null;
        return {
            externalJobId: job.jobId,
            title: job.title,
            location,
            state: state || undefined,
            remote: false,
            type: job.details.type,
            salaryMin: salaryMin || undefined,
            salaryMax: salaryMax || undefined,
            currency: 'USD',
            companyName: job.company.name,
            industry: job.company.industry,
            website: undefined,
            experience: undefined,
            postedDate: new Date(job.postedDate),
            skills: job.skills,
            source: 'provider1'
        };
    }
    transformProvider2Job(jobId, job) {
        return {
            externalJobId: jobId,
            title: job.position,
            location: job.location.city,
            state: job.location.state,
            remote: job.location.remote,
            type: undefined,
            salaryMin: job.compensation.min,
            salaryMax: job.compensation.max,
            currency: job.compensation.currency,
            companyName: job.employer.companyName,
            industry: undefined,
            website: job.employer.website,
            experience: job.requirements.experience,
            postedDate: new Date(job.datePosted),
            skills: job.requirements.technologies,
            source: 'provider2'
        };
    }
};
exports.JobTransformerService = JobTransformerService;
exports.JobTransformerService = JobTransformerService = __decorate([
    (0, common_1.Injectable)()
], JobTransformerService);
//# sourceMappingURL=job-transformer.service.js.map