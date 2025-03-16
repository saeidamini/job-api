import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of, throwError } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';
import { JobApiService } from './job-api.service';

describe('JobApiService', () => {
  let service: JobApiService;
  let httpService: HttpService;

  const mockHttpService = {
    get: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockImplementation((key, defaultValue) => defaultValue),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobApiService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<JobApiService>(JobApiService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('fetchProvider1Jobs', () => {
    it('should return jobs from Provider 1', async () => {
      const mockResponse: AxiosResponse = {
        data: {
          jobs: [
            {
              jobId: 'P1-123',
              title: 'Developer',
            },
          ],
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { url: 'https://test.com' } as any,
      };

      mockHttpService.get.mockReturnValueOnce(of(mockResponse));

      const result = await service.fetchProvider1Jobs();

      expect(result).toEqual([{ jobId: 'P1-123', title: 'Developer' }]);
      expect(httpService.get).toHaveBeenCalledWith(
        'https://assignment.devotel.io/api/provider1/jobs',
      );
    });

    it('should handle HTTP errors and return empty array', async () => {
      const error = new AxiosError();
      error.message = 'Network Error';

      mockHttpService.get.mockReturnValueOnce(throwError(() => error));

      const result = await service.fetchProvider1Jobs();

      expect(result).toEqual([]);
    });

    it('should handle unexpected response structure and return empty array', async () => {
      const mockResponse: AxiosResponse = {
        data: { unexpected: 'structure' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { url: 'https://test.com' } as any,
      };

      mockHttpService.get.mockReturnValueOnce(of(mockResponse));

      const result = await service.fetchProvider1Jobs();

      expect(result).toEqual([]);
    });
  });

  describe('fetchProvider2Jobs', () => {
    it('should return jobs from Provider 2', async () => {
      const mockResponse: AxiosResponse = {
        data: {
          status: 'success',
          data: {
            jobsList: {
              'job-123': { position: 'Developer' },
            },
          },
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { url: 'https://test.com' } as any,
      };

      mockHttpService.get.mockReturnValueOnce(of(mockResponse));

      const result = await service.fetchProvider2Jobs();

      expect(result).toEqual({ 'job-123': { position: 'Developer' } });
      expect(httpService.get).toHaveBeenCalledWith(
        'https://assignment.devotel.io/api/provider2/jobs',
      );
    });

    it('should handle HTTP errors and return empty object', async () => {
      const error = new AxiosError();
      error.message = 'Network Error';

      mockHttpService.get.mockReturnValueOnce(throwError(() => error));

      const result = await service.fetchProvider2Jobs();

      expect(result).toEqual({});
    });

    it('should handle unexpected response structure and return empty object', async () => {
      const mockResponse: AxiosResponse = {
        data: { unexpected: 'structure' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { url: 'https://test.com' } as any,
      };

      mockHttpService.get.mockReturnValueOnce(of(mockResponse));

      const result = await service.fetchProvider2Jobs();

      expect(result).toEqual({});
    });
  });
});