# Job Data Integration Service

A NestJS application that fetches, transforms, stores, and exposes job data from multiple sources through a unified API. This service periodically collects job listings from different providers, normalizes the data structure, and offers a filterable API endpoint for client applications.

## Features

- **Data Fetching**: Fetches job data from two different API providers
- **Data Transformation**: Normalizes varied data structures into a unified format
- **Scheduled Execution**: Uses Bull queues for reliable background processing
- **Database Storage**: Stores job data in a PostgreSQL database with optimized schema
- **REST API**: Provides filterable and paginated job search API
- **Documentation**: Includes Swagger API documentation
- **Tests**: Unit and integration tests for key components

## Tech Stack

- **NestJS**: Framework for building server-side applications
- **TypeScript**: Type-safe JavaScript
- **PostgreSQL**: Relational database
- **TypeORM**: Object-Relational Mapping
- **Bull**: Redis-based queue for background processing
- **Swagger**: API documentation
- **Jest**: Testing framework
- **Docker**: Containerization (optional setup)

## Prerequisites

- Node.js (v14+)
- PostgreSQL
- Redis (for Bull queue)

## Installation

1. Clone the repository

```bash
git clone https://github.com/...
cd job-data-integration
```


## Install dependencies

```
npm install

Configure environment variables
cp .env.example .env
# Edit .env with your configuration

Run database migrations
npm run migration:run

## Start the application
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod

```

## API Documentation
Once the application is running, you can access the Swagger API documentation at:
http://localhost:3000/api/docs
API Endpoints

GET /api/job-offers: Get job offers with filtering and pagination

Query Parameters:

- `title`: Filter by job title (string)
- `location`: Filter by location (string)
- `minSalary`: Filter by minimum salary (number)
- `maxSalary`: Filter by maximum salary (number)
- `skills`: Filter by skills (array of strings)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)




POST /api/job-offers/refresh: Manually trigger job data refresh

## Development
### Running Tests
```
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Database Migrations
```
# Generate a new migration
npm run migration:generate -- -n YourMigrationName

# Run migrations
npm run migration:run

# Revert migration
npm run migration:revert
```

## Docker Setup (Optional)
A Docker Compose configuration is provided for local development:
```
# Start the containers
docker-compose up -d

# Stop the containers
docker-compose down

# Start clean data
docker compose down --remove-orphans  --volumes && sudo rm -rf ./data &&   docker compose up -d 
```

## Project Structure

- `src/modules/job`: Main module for job data processing
- `src/modules/job/entities`: Database entities (JobOffer, Company, Skill)
- `src/modules/job/dtos`: Data Transfer Objects for API requests/responses
- `src/modules/job/services`: Business logic services
- `src/modules/job/controllers`: API endpoint controllers


That completes the implementation of the job data integration service. The solution includes all the required components as specified in the assignment:

1. Fetching data from two different API sources
2. Transforming data into a unified structure
3. Scheduled data fetching with Bull queues
4. PostgreSQL database storage with optimized schema
5. Filterable and paginated API endpoint
6. Error handling and logging
7. Unit and integration tests
8. Documentation with Swagger
