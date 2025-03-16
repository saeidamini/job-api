import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

// Entities
import { JobOffer } from './entities/job-offer.entity';
import { Company } from './entities/company.entity';
import { Skill } from './entities/skill.entity';

// Services
import { JobService } from './services/job.service';
import { JobApiService } from './services/job-api.service';
import { JobTransformerService } from './services/job-transformer.service';
import { SchedulerService } from './services/scheduler.service';

// Controllers
import { JobController } from './controllers/job.controller';

// Processors
import { JobProcessor } from './processor/job.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobOffer, Company, Skill]),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get('HTTP_TIMEOUT', 5000),
        maxRedirects: configService.get('HTTP_MAX_REDIRECTS', 5),
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueueAsync({
      name: 'job-queue',
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST', 'localhost'),
          port: configService.get('REDIS_PORT', 6379),
        },
        defaultJobOptions: {
          attempts: 3,
          removeOnComplete: true,
          removeOnFail: false,
        },
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [JobController],
  providers: [
    JobService,
    JobApiService,
    JobTransformerService,
    SchedulerService,
    JobProcessor,
  ],
  exports: [JobService],
})
export class JobModule {}