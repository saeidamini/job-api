import { Test, TestingModule } from '@nestjs/testing';
import { JobTransformerService } from './job-transformer.service';
import { Provider1JobDto } from '../dto/provider1-job.dto';
import { Provider2JobDto } from '../dto/provider2-job.dto';

describe('JobTransformerService', () => {
  let service: JobTransformerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobTransformerService],
    }).compile();

    service = module.get<JobTransformerService>(JobTransformerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('transformProvider1Job', () => {
    it('should transform Provider1 job data correctly', () => {
      const provider1Job: Provider1JobDto = {
        jobId: 'P1-312',
        title: 'Frontend Developer',
        details: {
          location: 'New York, NY',
          type: 'Contract',
          salaryRange: '$78k - $125k',
        },
        company: {
          name: 'BackEnd Solutions',
          industry: 'Technology',
        },
        skills: ['HTML', 'CSS', 'Vue.js'],
        postedDate: '2023-03-13T14:09:19.783Z',
      };

      const result = service.transformProvider1Job(provider1Job);

      expect(result).toEqual({
        externalJobId: 'P1-312',
        title: 'Frontend Developer',
        location: 'New York',
        state: 'NY',
        remote: false,
        type: 'Contract',
        salaryMin: 78000,
        salaryMax: 125000,
        currency: 'USD',
        companyName: 'BackEnd Solutions',
        industry: 'Technology',
        website: null,
        experience: null,
        postedDate: expect.any(Date),
        skills: ['HTML', 'CSS', 'Vue.js'],
        source: 'provider1',
      });
    });
  });

  describe('transformProvider2Job', () => {
    it('should transform Provider2 job data correctly', () => {
      const jobId = 'job-364';
      const provider2Job: Provider2JobDto = {
        position: 'Data Scientist',
        location: {
          city: 'Austin',
          state: 'WA',
          remote: true,
        },
        compensation: {
          min: 64000,
          max: 98000,
          currency: 'USD',
        },
        employer: {
          companyName: 'DataWorks',
          website: 'https://backendsolutions.com',
        },
        requirements: {
          experience: 4,
          technologies: ['JavaScript', 'Node.js', 'React'],
        },
        datePosted: '2023-03-05',
      };

      const result = service.transformProvider2Job(jobId, provider2Job);

      expect(result).toEqual({
        externalJobId: 'job-364',
        title: 'Data Scientist',
        location: 'Austin',
        state: 'WA',
        remote: true,
        type: null,
        salaryMin: 64000,
        salaryMax: 98000,
        currency: 'USD',
        companyName: 'DataWorks',
        industry: null,
        website: 'https://backendsolutions.com',
        experience: 4,
        postedDate: expect.any(Date),
        skills: ['JavaScript', 'Node.js', 'React'],
        source: 'provider2',
      });
    });
  });
});