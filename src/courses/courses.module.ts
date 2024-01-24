import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from './entities/course.entity';

@Module({
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
  imports: [MongooseModule.forFeature([{
    name: Course.name,
    schema: CourseSchema
  }])]
})
export class CoursesModule {}
