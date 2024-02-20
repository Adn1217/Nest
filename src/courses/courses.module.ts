import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { Course, CourseSchema } from './entities/course.entity';

@Module({
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
  imports: [ConfigModule, MongooseModule.forFeature([{
    name: Course.name,
    schema: CourseSchema
  }])]
})
export class CoursesModule {}
