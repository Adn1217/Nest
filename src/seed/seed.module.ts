import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { CoursesModule } from 'src/courses/courses.module';
import { StudentsModule } from 'src/students/students.module';
import { TeachersModule } from 'src/teachers/teachers.module';
import { EnrollmentsModule } from 'src/enrollments/enrollments.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [CoursesModule, StudentsModule, TeachersModule, EnrollmentsModule],
})
export class SeedModule {}
