import { JobOffer } from './job-offer.entity';
export declare class Skill {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    jobOffers: JobOffer[];
}
