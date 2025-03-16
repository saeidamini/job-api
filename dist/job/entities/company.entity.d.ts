import { JobOffer } from '../entities/job-offer.entity';
export declare class Company {
    id: string;
    name: string;
    industry: string;
    website: string;
    createdAt: Date;
    updatedAt: Date;
    jobOffers: JobOffer[];
}
