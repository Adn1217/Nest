import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentsModule } from './students/students.module';
import { CoursesModule } from './courses/courses.module';
import { SeedModule } from './seed/seed.module';
import { TeachersModule } from './teachers/teachers.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { MongooseModule } from '@nestjs/mongoose';
import { isMongoId } from './common/middlewares/isMongoId.middeware';
import { CoursesController } from './courses/courses.controller';

@Module({
  imports: [StudentsModule, CoursesModule, SeedModule, TeachersModule, EnrollmentsModule, MongooseModule.forRoot('mongodb://localhost:27017/nest-academy-platform')],
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
              path: 'courses', method: RequestMethod.POST
              }
            )
            .forRoutes(CoursesController)
  }
}
