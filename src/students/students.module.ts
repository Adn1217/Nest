import { Module } from '@nestjs/common';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from './entities/student.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService],
  imports: [ConfigModule, MongooseModule.forFeature([{
    name: Student.name,
    schema: StudentSchema
  }])]
})
export class StudentsModule {}
