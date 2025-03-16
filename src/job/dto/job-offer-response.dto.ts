import { ApiProperty } from '@nestjs/swagger';
import { JobOffer } from '../entities/job-offer.entity';

class PaginationMeta {
  @ApiProperty({ description: 'Total number of items' })
  total: number;

  @ApiProperty({ description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Number of items per page' })
  limit: number;

  @ApiProperty({ description: 'Total number of pages' })
  totalPages: number;
}

export class JobOfferResponseDto {
  @ApiProperty({ description: 'List of job offers', type: [JobOffer] })
  data: JobOffer[];

  @ApiProperty({ description: 'Pagination metadata', type: PaginationMeta })
  meta: PaginationMeta;
}