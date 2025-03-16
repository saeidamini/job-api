import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsBoolean, IsDate, IsArray } from 'class-validator';

export class JobOfferDto {
  @ApiProperty({ description: 'Unique identifier from source system' })
  externalJobId: string;

  @ApiProperty({ description: 'Job title/position' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Job location (city)' })
  @IsString()
  location: string;

  @ApiProperty({ description: 'State/region' })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiProperty({ description: 'Remote job indicator' })
  @IsBoolean()
  @IsOptional()
  remote?: boolean;

  @ApiProperty({ description: 'Job type (Full-time, Contract, etc.)' })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({ description: 'Minimum salary' })
  @IsNumber()
  @IsOptional()
  salaryMin?: number;

  @ApiProperty({ description: 'Maximum salary' })
  @IsNumber()
  @IsOptional()
  salaryMax?: number;

  @ApiProperty({ description: 'Salary currency' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({ description: 'Company name' })
  @IsString()
  companyName: string;

  @ApiProperty({ description: 'Company industry' })
  @IsString()
  @IsOptional()
  industry?: string;

  @ApiProperty({ description: 'Company website' })
  @IsString()
  @IsOptional()
  website?: string;

  @ApiProperty({ description: 'Required years of experience' })
  @IsNumber()
  @IsOptional()
  experience?: number;

  @ApiProperty({ description: 'Job posting date' })
  @IsDate()
  postedDate: Date;

  @ApiProperty({ description: 'Required skills/technologies' })
  @IsArray()
  skills: string[];

  @ApiProperty({ description: 'Data source identifier' })
  @IsString()
  source: string;
}