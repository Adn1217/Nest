import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentsModule } from './students/students.module';
import { CoursesModule } from './courses/courses.module';
import { SeedModule } from './seed/seed.module';
import { TeachersModule } from './teachers/teachers.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { isMongoId } from './common/middlewares/isMongoId.middeware';
import { CoursesController } from './courses/courses.controller';
import { CommonModule } from './common/common.module';
import { EnvConfig } from './config/env.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfig],
    }),
    StudentsModule, CoursesModule, SeedModule, TeachersModule, EnrollmentsModule, MongooseModule.forRoot(process.env.DB), CommonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer){
    consumer.apply(isMongoId)
            .exclude(
              { 
                path: 'courses',
                method: RequestMethod.GET,
              },
              {
                path: 'courses', 
                method: RequestMethod.POST
              },
              {
                path: 'courses', 
                method: RequestMethod.PUT
              }
            )
            .forRoutes(CoursesController)
  }
}
