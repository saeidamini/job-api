import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { JobController } from '../src/job/controllers/job.controller';
import { JobService } from '../src/job/services/job.service';
import { SchedulerService } from '../src/job/services/scheduler.service';
import { JobApiService } from '../src/job/services/job-api.service';
import { JobTransformerService } from '../src/job/services/job-transformer.service';
import { ConfigModule } from '@nestjs/config';
import { JobFilterDto } from '../src/job/dto/job-filter.dto';
import { PaginationDto } from '../src/job/dto/pagination.dto';

describe('JobController (e2e)', () => {
  let app: INestApplication;
  let mockJobService: any;
  let mockSchedulerService: any;
  
  beforeAll(async () => {
    // Create mock services
    mockJobService = {
      findJobs: jest.fn().mockImplementation((filter: JobFilterDto) => {
        // Sample data that mimics database records
        const jobs = [
          {
            externalJobId: 'P1-312-test',
            title: 'Frontend Developer',
            location: 'New York, NY',
            state: 'NY',
            remote: false,
            type: 'Contract',
            salaryMin: 78000,
            salaryMax: 125000,
            currency: 'USD',
            company: {
              name: 'BackEnd Solutions',
              industry: 'Technology',
              website: null,
            },
            skills: [
              { name: 'HTML' },
              { name: 'CSS' },
              { name: 'Vue.js' },
            ],
            experience: null,
            postedDate: new Date('2025-03-13T14:09:19.783Z'),
            source: 'provider1'
          },
          {
            externalJobId: 'P1-759-test',
            title: 'Data Scientist',
            location: 'San Francisco, CA',
            state: 'CA',
            remote: false,
            type: 'Full-Time',
            salaryMin: 57000,
            salaryMax: 121000,
            currency: 'USD',
            company: {
              name: 'DataWorks',
              industry: 'Design',
              website: null,
            },
            skills: [
              { name: 'HTML' },
              { name: 'CSS' },
              { name: 'Vue.js' },
            ],
            experience: null,
            postedDate: new Date('2025-03-06T23:04:10.699Z'),
            source: 'provider1'
          },
          {
            externalJobId: 'job-364-test',
            title: 'Data Scientist',
            location: 'Austin',
            state: 'WA',
            remote: true,
            type: null,
            salaryMin: 78899,
            salaryMax: 110000,
            currency: 'USD',
            company: {
              name: 'DataWorks',
              industry: null,
              website: 'https://backendsolutions.com',
            },
            skills: [
              { name: 'JavaScript' },
              { name: 'Node.js' },
              { name: 'React' },
            ],
            experience: 4,
            postedDate: new Date('2025-03-05'),
            source: 'provider2'
          }
        ];
        
        // Apply simple filtering based on title
        let filteredJobs = jobs;
        if (filter.title) {
          filteredJobs = jobs.filter(job => 
            job.title.toLowerCase().includes(filter.title.toLowerCase())
          );
        }
        
        // Apply location filter
        if (filter.location) {
          filteredJobs = filteredJobs.filter(job => 
            job.location.toLowerCase().includes(filter.location.toLowerCase())
          );
        }
        
        // Apply salary filters
        if (filter.minSalary) {
          filteredJobs = filteredJobs.filter(job => 
            job.salaryMin >= filter.minSalary
          );
        }
        
        if (filter.maxSalary) {
          filteredJobs = filteredJobs.filter(job => 
            job.salaryMax <= filter.maxSalary
          );
        }
        
        // Apply skills filter
        if (filter.skills) {
          const skillsArray = Array.isArray(filter.skills) ? filter.skills : [filter.skills];
          filteredJobs = filteredJobs.filter(job => 
            job.skills.some(skill => 
              skillsArray.some(s => skill.name.toLowerCase().includes(s.toLowerCase()))
            )
          );
        }
        
        // Apply pagination
        const page = filter.page || 1;
        const limit = filter.limit || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        
        return {
          data: filteredJobs.slice(startIndex, endIndex),
          total: filteredJobs.length
        };
      }),
    };
    
    mockSchedulerService = {
      triggerFetchJobs: jest.fn().mockResolvedValue(undefined),
    };
    
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
      ],
      controllers: [JobController],
      providers: [
        {
          provide: JobService,
          useValue: mockJobService,
        },
        {
          provide: SchedulerService,
          useValue: mockSchedulerService,
        },
        {
          provide: JobApiService,
          useValue: {},
        },
        {
          provide: JobTransformerService,
          useValue: {},
        },
      ],
    }).compile();
    
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
      skipMissingProperties: true,
    }));
    await app.init();
  });
  
  afterAll(async () => {
    await app.close();
  });
  
  describe('/job-offers (GET)', () => {
    it('should return jobs with default pagination', () => {
      return request(app.getHttpServer())
        .get('/job-offers')
        .expect(HttpStatus.OK)
        .expect(res => {
          expect(res.body.data).toBeDefined();
          expect(res.body.data.length).toBe(3); // All 3 mock jobs
          expect(res.body.meta).toBeDefined();
          expect(res.body.meta.page).toBe(1);
          expect(res.body.meta.limit).toBe(10);
          expect(mockJobService.findJobs).toHaveBeenCalled();
        });
    });
    
    it('should filter jobs by title', () => {
      return request(app.getHttpServer())
        .get('/job-offers?title=Data')
        .expect(HttpStatus.OK)
        .expect(res => {
          expect(res.body.data.length).toBe(2);
          expect(res.body.data[0].title).toBe('Data Scientist');
          expect(res.body.data[1].title).toBe('Data Scientist');
          expect(mockJobService.findJobs).toHaveBeenLastCalledWith(expect.objectContaining({
            title: 'Data',
          }));
        });
    });
    
    it('should filter jobs by location', () => {
      return request(app.getHttpServer())
        .get('/job-offers?location=New%20York')
        .expect(HttpStatus.OK)
        .expect(res => {
          expect(res.body.data.length).toBe(1);
          expect(res.body.data[0].location).toBe('New York, NY');
          expect(mockJobService.findJobs).toHaveBeenLastCalledWith(expect.objectContaining({
            location: 'New York',
          }));
        });
    });
    
    it('should filter jobs by salary range', () => {
      return request(app.getHttpServer())
        .get('/job-offers?minSalary=78899&maxSalary=110000')
        .expect(HttpStatus.OK)
        .expect(res => {
          expect(res.body.data.length).toBe(1);
          expect(res.body.data[0].externalJobId).toBe('job-364-test');
          expect(mockJobService.findJobs).toHaveBeenLastCalledWith(expect.objectContaining({
            minSalary: 78899,
            maxSalary: 110000,
          }));
        });
    });
    
    // it('should filter jobs by skills', () => {
    //   return request(app.getHttpServer())
    //     .get('/job-offers?skills[]=React')
    //     .expect(HttpStatus.OK)
    //     .expect(res => {
    //       expect(res.body.data.length).toBe(1);
    //       expect(res.body.data[0].externalJobId).toBe('job-364-test');
    //       expect(res.body.data[0].skills).toContain('React');
    //       expect(mockJobService.findJobs).toHaveBeenLastCalledWith(expect.objectContaining({
    //         skills: ['React'],
    //       }));
    //     });
    // });
    
    it('should apply pagination correctly', () => {
      return request(app.getHttpServer())
        .get('/job-offers?page=1&limit=2')
        .expect(HttpStatus.OK)
        .expect(res => {
          expect(res.body.data.length).toBe(2);
          expect(res.body.meta.page).toBe(1);
          expect(res.body.meta.limit).toBe(2);
          expect(res.body.meta.totalPages).toBe(2);
          expect(mockJobService.findJobs).toHaveBeenLastCalledWith(expect.objectContaining({
            page: 1,
            limit: 2,
          }));
        });
    });
    
    it('should handle service errors', () => {
      mockJobService.findJobs.mockImplementationOnce(() => {
        throw new Error('Database error');
      });
      
      return request(app.getHttpServer())
        .get('/job-offers')
        .expect(HttpStatus.INTERNAL_SERVER_ERROR)
        .expect(res => {
          expect(res.body.message).toContain('Failed to fetch job offers');
        });
    });
  });
  
  describe('/job-offers/refresh (POST)', () => {
    it('should trigger the job fetch process', () => {
      return request(app.getHttpServer())
        .post('/job-offers/refresh')
        .expect(HttpStatus.CREATED)
        .expect(res => {
          expect(res.body.message).toBe('Job fetch process triggered successfully');
          expect(mockSchedulerService.triggerFetchJobs).toHaveBeenCalled();
        });
    });
    
    it('should handle errors during job fetch', () => {
      mockSchedulerService.triggerFetchJobs.mockImplementationOnce(() => {
        throw new Error('API failure');
      });
      
      return request(app.getHttpServer())
        .post('/job-offers/refresh')
        .expect(HttpStatus.INTERNAL_SERVER_ERROR)
        .expect(res => {
          expect(res.body.message).toContain('Failed to trigger job fetch');
        });
    });
  });
});