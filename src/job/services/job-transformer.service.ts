import { Injectable } from '@nestjs/common';
import { Provider1JobDto } from '../../job/dto/provider1-job.dto';
import { Provider2JobDto } from '../../job/dto/provider2-job.dto';
import { JobOfferDto } from '../../job/dto/job-offer.dto';

@Injectable()
export class JobTransformerService {
  transformProvider1Job(job: Provider1JobDto): JobOfferDto {
    // Parse salary range (e.g., "$78k - $125k")
    const salaryRangeMatch = job.details.salaryRange.match(/\$(\d+)k\s*-\s*\$(\d+)k/);
    const salaryMin = salaryRangeMatch ? parseInt(salaryRangeMatch[1]) * 1000 : null;
    const salaryMax = salaryRangeMatch ? parseInt(salaryRangeMatch[2]) * 1000 : null;
    
    // Extract location components (e.g., "New York, NY")
    const locationParts = job.details.location.split(',').map(part => part.trim());
    const location = locationParts[0];
    const state = locationParts.length > 1 ? locationParts[1] : null;

    return {
      externalJobId: job.jobId,
      title: job.title,
      location,
      state: state || undefined,
      remote: false, // Provider1 doesn't specify remote status, default to false
      type: job.details.type,
      salaryMin: salaryMin || undefined,
      salaryMax: salaryMax || undefined,
      currency: 'USD', // Assuming USD for Provider1
      companyName: job.company.name,
      industry: job.company.industry,
      website: undefined, // Provider1 doesn't provide website
      experience: undefined, // Provider1 doesn't specify required experience
      postedDate: new Date(job.postedDate),
      skills: job.skills,
      source: 'provider1'
    };
  }

  transformProvider2Job(jobId: string, job: Provider2JobDto): JobOfferDto {
    return {
      externalJobId: jobId,
      title: job.position,
      location: job.location.city,
      state: job.location.state,
      remote: job.location.remote,
      type: undefined, // Provider2 doesn't specify job type
      salaryMin: job.compensation.min,
      salaryMax: job.compensation.max,
      currency: job.compensation.currency,
      companyName: job.employer.companyName,
      industry: undefined, // Provider2 doesn't specify industry
      website: job.employer.website,
      experience: job.requirements.experience,
      postedDate: new Date(job.datePosted),
      skills: job.requirements.technologies,
      source: 'provider2'
    };
  }
}