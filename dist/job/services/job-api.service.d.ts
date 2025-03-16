import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Provider1JobDto } from '../dto/provider1-job.dto';
import { Provider2JobDto } from '../dto/provider2-job.dto';
export declare class JobApiService {
    private readonly httpService;
    private readonly configService;
    private readonly logger;
    constructor(httpService: HttpService, configService: ConfigService);
    fetchProvider1Jobs(): Promise<Provider1JobDto[]>;
    fetchProvider2Jobs(): Promise<Record<string, Provider2JobDto>>;
}
