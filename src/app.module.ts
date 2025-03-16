import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { LoggerModule } from 'nestjs-pino';
import { APP_FILTER } from '@nestjs/core';

// Modules
import { JobModule } from './job/job.module';

// Filters
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { AllExceptionsFilter } from './shared/filters/all-exceptions.filter';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.development', '.env.production'],
    }),
    
    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_DATABASE', 'devotel_job'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('DB_SYNCHRONIZE', false),
        migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
        migrationsRun: configService.get('DB_RUN_MIGRATIONS', true),
        logging: configService.get('DB_LOGGING', false),
      }),
    }),
    
    // Redis/Bull
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST', 'localhost'),
          port: configService.get('REDIS_PORT', 6379),
        },
      }),
    }),
    
    // Logging
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        pinoHttp: {
          level: configService.get('LOG_LEVEL', 'info'),
          transport: process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty' }
            : undefined,
        },
      }),
    }),
    
    // Feature modules
    JobModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}

// import { Module } from '@nestjs/common';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { BullModule } from '@nestjs/bull';
// import { ScheduleModule } from '@nestjs/schedule';
// import { HttpModule } from '@nestjs/axios';
// import { LoggerModule } from 'nestjs-pino';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { JobModule } from './job/job.module';

// import databaseConfig from './config/database.config';

// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       isGlobal: true,
//       load: [databaseConfig],
//     }),
//     TypeOrmModule.forRootAsync({
//       inject: [ConfigService],
//       useFactory: async (configService: ConfigService) => {
//         const dbConfig = configService.get('database');
//         if (!dbConfig) {
//           throw new Error('Database configuration not found');
//         }
//         return dbConfig;
//       },
//     }),
//     BullModule.forRootAsync({
//       inject: [ConfigService],
//       useFactory: (configService: ConfigService) => ({
//         redis: {
//           host: configService.get('REDIS_HOST', 'localhost'),
//           port: configService.get('REDIS_PORT', 6379),
//         },
//       }),
//     }),
//     ScheduleModule.forRoot(),
//     HttpModule,
//     LoggerModule.forRoot({
//       pinoHttp: {
//         transport: process.env.NODE_ENV !== 'production' 
//           ? { target: 'pino-pretty' } 
//           : undefined,
//         level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
//       },
//     }),
//     JobModule,
//   ],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}