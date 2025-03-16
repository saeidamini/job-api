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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobOfferDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class JobOfferDto {
    externalJobId;
    title;
    location;
    state;
    remote;
    type;
    salaryMin;
    salaryMax;
    currency;
    companyName;
    industry;
    website;
    experience;
    postedDate;
    skills;
    source;
}
exports.JobOfferDto = JobOfferDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique identifier from source system' }),
    __metadata("design:type", String)
], JobOfferDto.prototype, "externalJobId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Job title/position' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], JobOfferDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Job location (city)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], JobOfferDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'State/region' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], JobOfferDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Remote job indicator' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], JobOfferDto.prototype, "remote", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Job type (Full-time, Contract, etc.)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], JobOfferDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Minimum salary' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], JobOfferDto.prototype, "salaryMin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Maximum salary' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], JobOfferDto.prototype, "salaryMax", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Salary currency' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], JobOfferDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Company name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], JobOfferDto.prototype, "companyName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Company industry' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], JobOfferDto.prototype, "industry", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Company website' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], JobOfferDto.prototype, "website", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Required years of experience' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], JobOfferDto.prototype, "experience", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Job posting date' }),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], JobOfferDto.prototype, "postedDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Required skills/technologies' }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], JobOfferDto.prototype, "skills", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Data source identifier' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], JobOfferDto.prototype, "source", void 0);
//# sourceMappingURL=job-offer.dto.js.map