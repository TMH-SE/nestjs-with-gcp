import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from 'src/app.module';
import yaml from 'yaml';
import fs from 'fs';

async function generateOpenApiSpec() {
  const app = await NestFactory.create(AppModule);

  // OpenAPI
  const config = new DocumentBuilder().setTitle('NestJS with GCP').setVersion('1.0').build();
  const openapiDoc = SwaggerModule.createDocument(app, config);
  const yamlDoc = new yaml.Document();
  yamlDoc.contents = Object.assign({}, openapiDoc);
  fs.writeFileSync('openapi3.yaml', yamlDoc.toString());
}

generateOpenApiSpec();
