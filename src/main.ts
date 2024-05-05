import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');

  app.use(
    '/swagger/*',
    basicAuth({
      challenge: true,
      users: {
        [process.env.SWAGGER_BASIC_AUTH_USERNAME]:
          process.env.NODE_ENV === 'production'
            ? process.env.SWAGGER_BASIC_AUTH_PASSWORD
            : '123',
      },
    }),
  );

  const publicAppConfig = new DocumentBuilder()
    .setTitle('koovea task manager API')
    .setDescription('The koovea task manager main PUBLIC API.')
    .setVersion('1.0')
    .addBearerAuth(
      {
        description:
          'User oauth2 role based access through JWT access token (resource_access.koovea-task-manager-api.roles.user)',
        type: 'http',
        in: 'header',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'User RBAC JWT access token',
    )
    .build();

  const publicDocument = SwaggerModule.createDocument(app, publicAppConfig);

  SwaggerModule.setup('swagger', app, publicDocument);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  await app.listen(3000);
}
bootstrap();
