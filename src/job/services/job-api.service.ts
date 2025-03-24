import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { Provider1JobDto } from '../dto/provider1-job.dto';
import { Provider2JobDto } from '../dto/provider2-job.dto';

@Injectable()
export class JobApiService {
  private readonly logger = new Logger(JobApiService.name);
  
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async fetchProvider1Jobs(): Promise<Provider1JobDto[]> {
    const url = this.configService.get<string>('API_PROVIDER1_URL', 'https://assignment.devotel.io/api/provider1/jobs');
    console.debug("Fetching Provider 1 jobs from: ", url);
    
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(url).pipe(
          catchError((error: AxiosError) => {
            this.logger.error(`Failed to fetch data from Provider 1: ${error.message}`);
            throw new Error(`Failed to fetch data from Provider 1: ${error.message}`);
          }),
        ),
      );
      
      return data.jobs || [];
    } catch (error) {
      this.logger.error(`Error processing Provider 1 data: ${error.message}`);
      return [];
    }
  }

  async fetchProvider2Jobs(): Promise<Record<string, Provider2JobDto>> {
    const url = this.configService.get<string>('API_PROVIDER2_URL', 'https://assignment.devotel.io/api/provider2/jobs');
    console.debug("Fetching Provider 2 jobs from: ", url);

    try {
      const { data } = await firstValueFrom(
        this.httpService.get(url).pipe(
          catchError((error: AxiosError) => {
            this.logger.error(`Failed to fetch data from Provider 2: ${error.message}`);
            throw new Error(`Failed to fetch data from Provider 2: ${error.message}`);
          }),
        ),
      );
      
      return data?.data?.jobsList || {};
    } catch (error) {
      this.logger.error(`Error processing Provider 2 data: ${error.message}`);
      return {};
    }
  }
}