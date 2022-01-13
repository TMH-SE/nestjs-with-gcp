import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const version = process.env.npm_package_version || '1.0';

  // OpenAPI
  const config = new DocumentBuilder()
    .setTitle('NestJS with GCP')
    .setVersion(`${version}`)
    .addServer('/v1')
    // .addServer('/v2')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.setGlobalPrefix(`/v${version.split('.')[0]}`);

  // Security
  app.enableCors();
  app.use(helmet());

  await app.listen(AppModule.port);
}
bootstrap();
