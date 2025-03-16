import { JobOffer } from '../entities/job-offer.entity';
declare class PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export declare class JobOfferResponseDto {
    data: JobOffer[];
    meta: PaginationMeta;
}
export {};
