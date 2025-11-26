import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3001;
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true
  });

  await app.listen(port);
  // Log to help verify container startup without extra tooling
  console.log(`API listening on port ${port}`);
}

bootstrap();
