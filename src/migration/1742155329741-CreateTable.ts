import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTable1742155329741 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create companies table
        await queryRunner.query(`
          CREATE TABLE IF NOT EXISTS companies (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name VARCHAR(255) NOT NULL,
            industry VARCHAR(255),
            website VARCHAR(255),
            "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
          );
          
          CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);
        `);
        
        // Create skills table
        await queryRunner.query(`
          CREATE TABLE IF NOT EXISTS skills (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name VARCHAR(255) UNIQUE NOT NULL,
            "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
          );
          
          CREATE INDEX IF NOT EXISTS idx_skills_name ON skills(name);
        `);
        
        // Create job_offers table
        await queryRunner.query(`
          CREATE TABLE IF NOT EXISTS job_offers (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            "externalJobId" VARCHAR(255) UNIQUE NOT NULL,
            title VARCHAR(255) NOT NULL,
            location VARCHAR(255) NOT NULL,
            state VARCHAR(255),
            remote BOOLEAN DEFAULT FALSE,
            type VARCHAR(255),
            "salaryMin" DECIMAL(10, 2),
            "salaryMax" DECIMAL(10, 2),
            currency VARCHAR(10) DEFAULT 'USD',
            "companyId" UUID NOT NULL REFERENCES companies(id),
            experience INTEGER,
            "postedDate" DATE NOT NULL,
            source VARCHAR(255) NOT NULL,
            "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
          );
          
          CREATE INDEX IF NOT EXISTS idx_job_offers_title ON job_offers(title);
          CREATE INDEX IF NOT EXISTS idx_job_offers_location ON job_offers(location);
          CREATE INDEX IF NOT EXISTS idx_job_offers_salary_min ON job_offers("salaryMin");
          CREATE INDEX IF NOT EXISTS idx_job_offers_salary_max ON job_offers("salaryMax");
          CREATE INDEX IF NOT EXISTS idx_job_offers_posted_date ON job_offers("postedDate");
        `);
        
        // Create job_offer_skills junction table
        await queryRunner.query(`
          CREATE TABLE IF NOT EXISTS job_offer_skills (
            "jobOfferId" UUID NOT NULL REFERENCES job_offers(id) ON DELETE CASCADE,
            "skillId" UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
            PRIMARY KEY ("jobOfferId", "skillId")
          );
          
          CREATE INDEX IF NOT EXISTS idx_job_offer_skills_job_offer_id ON job_offer_skills("jobOfferId");
          CREATE INDEX IF NOT EXISTS idx_job_offer_skills_skill_id ON job_offer_skills("skillId");
        `);
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS job_offer_skills;`);
        await queryRunner.query(`DROP TABLE IF EXISTS job_offers;`);
        await queryRunner.query(`DROP TABLE IF EXISTS skills;`);
        await queryRunner.query(`DROP TABLE IF EXISTS companies;`);
      }
}
