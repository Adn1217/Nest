import { Controller, Get, Param } from '@nestjs/common';
import { StudentsService } from './students.service';

@Controller('students')
export class StudentsController {


  constructor( private readonly studentsService: StudentsService){

  }

  @Get()
  getStudents() {
    const students = this.studentsService.findAll();
    return students
  }

  @Get(':id')
  getStudentById(@Param('id') id: string){

    const student = this.studentsService.findById(+id);
    
    return student 
  }
}
