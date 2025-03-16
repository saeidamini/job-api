import { NestFactory } from '@nestjs/core';
import { SwaggerModule} from '@nestjs/swagger';
import {swaggerConfig} from './config/swagger.config'
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { AllExceptionsFilter } from './shared/filters/all-exceptions.filter';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Use Pino logger
  app.useLogger(app.get(Logger));
  
  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new AllExceptionsFilter(),
  );

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);
  
  // Start server
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
