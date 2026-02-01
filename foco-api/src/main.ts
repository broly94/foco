import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as morgan from 'morgan';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CORS } from '@app/constans/cors';
import { PostgresExceptionFilter } from '@app/common/filters/postgres-exception.filter';

async function bootstrap() {
  console.log('Iniciando la aplicación123');
  const app = await NestFactory.create(AppModule, { logger: ['log', 'error', 'warn', 'debug', 'verbose'] });

  const configService = app.get(ConfigService);

  app.enableCors(CORS);

  app.use(morgan('dev'));

  app.setGlobalPrefix('api');

  app.useGlobalFilters(new PostgresExceptionFilter());

  // Swagger config
  const configSwagger = new DocumentBuilder()
    .addSecurity('basic', { type: 'http' })
    .setTitle('Foco Anuncio Api Rest')
    .setDescription('Api res de Foco Anuncio')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('docs', app, document);

  // Auto validate - class validator
  app.useGlobalPipes(
    new ValidationPipe({
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(configService.get('PORT'));
  console.log(`Serving on port ${configService.get('PORT')}`);
}
bootstrap();
