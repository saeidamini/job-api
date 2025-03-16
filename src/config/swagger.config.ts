import { DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Job Board API')
  .setDescription('API for job offers from multiple providers')
  .setVersion('1.0')
  .addTag('jobs')
  .addBearerAuth()
  .build();

// export const swaggerOptions: SwaggerCustomOptions = {
//   swaggerOptions: {
//     persistAuthorization: true,
//     tagsSorter: 'alpha',
//     operationsSorter: 'alpha',
//   },
//   customSiteTitle: 'Job Board API Documentation',
// };