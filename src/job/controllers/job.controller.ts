import { Controller, Get, Query, HttpStatus, HttpException, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { JobService } from '../services/job.service';
import { SchedulerService } from '../services/scheduler.service';
import { JobFilterDto } from '../dto/job-filter.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { JobOfferResponseDto } from '../dto/job-offer-response.dto';
import { JobOffer } from '../entities/job-offer.entity';
import { JobOfferDto } from '../dto/job-offer.dto';

@ApiTags('jobs')
@Controller('job-offers')
export class JobController {
  constructor(
    private readonly jobService: JobService,
    private readonly schedulerService: SchedulerService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get job offers with filtering and pagination' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns paginated job offers',
    type: JobOfferResponseDto,
  })
  @ApiQuery({ name: 'title', required: false, type: String })
  @ApiQuery({ name: 'location', required: false, type: String })
  @ApiQuery({ name: 'minSalary', required: false, type: Number })
  @ApiQuery({ name: 'maxSalary', required: false, type: Number })
  @ApiQuery({ name: 'skills', required: false, type: [String] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getJobs(
    @Query() filter: JobFilterDto,
    @Query() pagination: PaginationDto,
  ) {
    try {
      const { data, total } = await this.jobService.findJobs(filter, pagination);

      
      return {
        data: data.map(job => this.mapToDto(job)),
        meta: {
          total,
          page: pagination.page || 1,
          limit: pagination.limit || 10,
          totalPages: Math.ceil(total / (pagination.limit || 10)),
        },
      };
    } catch (error) {
      throw new HttpException(
        `Failed to fetch job offers: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Manually trigger job fetch' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Job fetch process triggered',
  })
  async refreshJobs() {
    try {
      await this.schedulerService.triggerFetchJobs();
      return { message: 'Job fetch process triggered successfully' };
    } catch (error) {
      throw new HttpException(
        `Failed to trigger job fetch: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // In src/modules/job/controllers/job.controller.ts
private mapToDto(job: JobOffer): JobOfferDto {
  return {
    externalJobId: job.externalJobId,
    title: job.title,
    location: job.location,
    state: job.state || undefined,
    remote: job.remote || false,
    type: job.type || undefined,
    salaryMin: job.salaryMin || undefined,
    salaryMax: job.salaryMax || undefined,
    currency: job.currency || 'USD',
    companyName: job.company?.name || 'Unknown Company',
    industry: job.company?.industry || undefined,
    website: job.company?.website || undefined,
    experience: job.experience || undefined,
    postedDate: job.postedDate,
    skills: job.skills?.map(skill => skill.name) || [],
    source: job.source
  };
}
}

