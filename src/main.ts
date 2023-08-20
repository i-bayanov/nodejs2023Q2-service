// import { writeFile } from 'fs/promises';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import { load, dump } from 'js-yaml';

import { PORT } from './env';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const config = new DocumentBuilder().setTitle('Home Library Service').setVersion('1.0').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT);

  // try {
  //   const docRes = await fetch(`http://localhost:${PORT}/api-json`);
  //   const docJson = await docRes.text();
  //   const docYaml = dump(load(docJson));

  //   await writeFile('./doc/api.yaml', docYaml);
  // } catch {}
}
bootstrap();
