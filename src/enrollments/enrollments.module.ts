import { Module } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsController } from './enrollments.controller';
import { StudentsModule } from 'src/students/students.module';
import { CoursesModule } from 'src/courses/courses.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Enrollment, EnrollmentSchema } from './entities/enrollment.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService],
  exports: [EnrollmentsService],
  imports: [ConfigModule, StudentsModule, CoursesModule, MongooseModule.forFeature([{
    name: Enrollment.name,
    schema: EnrollmentSchema
  }])]
})
export class EnrollmentsModule {}
