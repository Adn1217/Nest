import { Module } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsController } from './enrollments.controller';
import { StudentsModule } from 'src/students/students.module';
import { CoursesModule } from 'src/courses/courses.module';

@Module({
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService],
  exports: [EnrollmentsService],
  imports: [StudentsModule, CoursesModule]
})
export class EnrollmentsModule {}
