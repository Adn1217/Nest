import { Module } from '@nestjs/common';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from './entities/student.entity';

@Module({
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService],
  imports: [MongooseModule.forFeature([{
    name: Student.name,
    schema: StudentSchema
  }])]
})
export class StudentsModule {}
