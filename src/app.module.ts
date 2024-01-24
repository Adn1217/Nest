import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentsModule } from './students/students.module';
import { CoursesModule } from './courses/courses.module';
import { SeedModule } from './seed/seed.module';
import { TeachersModule } from './teachers/teachers.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [StudentsModule, CoursesModule, SeedModule, TeachersModule, EnrollmentsModule, MongooseModule.forRoot('mongodb://localhost:27017/nest-academy-platform')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
