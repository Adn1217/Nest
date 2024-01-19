import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentsModule } from './students/students.module';
import { CoursesModule } from './courses/courses.module';
import { SeedModule } from './seed/seed.module';
import { TeachersModule } from './teachers/teachers.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';

@Module({
  imports: [StudentsModule, CoursesModule, SeedModule, TeachersModule, EnrollmentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
