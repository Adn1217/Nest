import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { CoursesModule } from 'src/courses/courses.module';
import { StudentsModule } from 'src/students/students.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [CoursesModule, StudentsModule],
})
export class SeedModule {}
