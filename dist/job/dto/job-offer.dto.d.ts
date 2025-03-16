export declare class JobOfferDto {
    externalJobId: string;
    title: string;
    location: string;
    state?: string;
    remote?: boolean;
    type?: string;
    salaryMin?: number;
    salaryMax?: number;
    currency?: string;
    companyName: string;
    industry?: string;
    website?: string;
    experience?: number;
    postedDate: Date;
    skills: string[];
    source: string;
}
