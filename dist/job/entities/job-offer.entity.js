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
exports.JobOffer = void 0;
const typeorm_1 = require("typeorm");
const company_entity_1 = require("./company.entity");
const skill_entity_1 = require("./skill.entity");
let JobOffer = class JobOffer {
    id;
    externalJobId;
    title;
    location;
    state;
    remote;
    type;
    salaryMin;
    salaryMax;
    currency;
    company;
    companyId;
    experience;
    postedDate;
    source;
    createdAt;
    updatedAt;
    skills;
};
exports.JobOffer = JobOffer;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], JobOffer.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], JobOffer.prototype, "externalJobId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], JobOffer.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], JobOffer.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], JobOffer.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], JobOffer.prototype, "remote", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], JobOffer.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { nullable: true, precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], JobOffer.prototype, "salaryMin", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { nullable: true, precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], JobOffer.prototype, "salaryMax", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'USD' }),
    __metadata("design:type", String)
], JobOffer.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => company_entity_1.Company, company => company.jobOffers),
    (0, typeorm_1.JoinColumn)({ name: 'companyId' }),
    __metadata("design:type", company_entity_1.Company)
], JobOffer.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], JobOffer.prototype, "companyId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], JobOffer.prototype, "experience", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], JobOffer.prototype, "postedDate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], JobOffer.prototype, "source", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], JobOffer.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], JobOffer.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => skill_entity_1.Skill, skill => skill.jobOffers),
    (0, typeorm_1.JoinTable)({
        name: 'job_offer_skills',
        joinColumn: { name: 'jobOfferId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'skillId', referencedColumnName: 'id' }
    }),
    __metadata("design:type", Array)
], JobOffer.prototype, "skills", void 0);
exports.JobOffer = JobOffer = __decorate([
    (0, typeorm_1.Entity)('job_offers')
], JobOffer);
//# sourceMappingURL=job-offer.entity.js.map