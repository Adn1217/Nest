import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina los atributos que no hacen parte de la clase.
      forbidNonWhitelisted: true, // Genera un error si recibe un atributo que no hace parte de la clase.
      transform: true,
      transformOptions: {
        enableImplicitConversion: true, // Transforma queries a número implicitamente.
      },
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(
          validationErrors.map((error) => ({
            field: error.property,
            error: Object.values(error.constraints).join(', '),
          })),
        );
      },
    }
  ))
  app.enableCors(); // Permite CORS Policy.
  await app.listen(+process.env.PORT);
}
bootstrap();
