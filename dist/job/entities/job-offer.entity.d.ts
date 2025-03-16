import { Company } from './company.entity';
import { Skill } from './skill.entity';
export declare class JobOffer {
    id: string;
    externalJobId: string;
    title: string;
    location: string;
    state: string;
    remote: boolean;
    type: string;
    salaryMin: number;
    salaryMax: number;
    currency: string;
    company: Company;
    companyId: string;
    experience: number;
    postedDate: Date;
    source: string;
    createdAt: Date;
    updatedAt: Date;
    skills: Skill[];
}
