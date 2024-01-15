import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina los atributos que no hacen parte de la clase.
      forbidNonWhitelisted: true, // Genera un error si recibe un atributo que no hace parte de la clase.
    })
  )

  await app.listen(3500);
}
bootstrap();
