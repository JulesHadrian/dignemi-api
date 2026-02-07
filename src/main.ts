import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // 1. Prefijo Global y Versionado
  app.setGlobalPrefix('v1');
  app.enableVersioning({
    type: VersioningType.URI, // v1/...
  });

  // 2. Pipes de validación global (para DTOs)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no decoradas en DTOs
      forbidNonWhitelisted: true, // Lanza error si envían datos extra
      transform: true, // Transforma payloads a tipos de DTO
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  // 3. Configuración Swagger (OpenAPI)
  // Solo habilitar en desarrollo o stage
  if (configService.get('NODE_ENV') !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('LUZENTIA WEB SERVICE')
      .setDescription('Documentación de API para LUZENTIA')
      .setVersion('1.0')
      .addBearerAuth() // Soporte para JWT en Swagger
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document); // Acceso en /docs
  }

  // 4. CORS (Restrictivo por defecto, ajustar según cliente)
  app.enableCors();

  const port = configService.get('PORT');
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}/docs`);
}
bootstrap();