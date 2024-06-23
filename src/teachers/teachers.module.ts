import { Module } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { TeachersController } from './teachers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Teacher, TeacherSchema } from './entities/teacher.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [TeachersController],
  providers: [TeachersService],
  exports: [TeachersService],
  imports: [ConfigModule,MongooseModule.forFeature([{
    name: Teacher.name,
    schema: TeacherSchema
  }
  ])]
})
export class TeachersModule {}
