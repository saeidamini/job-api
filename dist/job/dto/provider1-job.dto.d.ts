export declare class Provider1JobDto {
    jobId: string;
    title: string;
    details: {
        location: string;
        type: string;
        salaryRange: string;
    };
    company: {
        name: string;
        industry: string;
    };
    skills: string[];
    postedDate: string;
}
