import { Controller, Get, Param } from '@nestjs/common';

@Controller('students')
export class StudentsController {

  private students = ['A', 'B', 'C'];

  @Get()
  getStudents() {
    return this.students
  }

  @Get(':id')
  getStudentById(@Param('id') id: string){
    const student = {
      id : id,
      student : this.students[+id]
    }
    // console.log(student);
    if(!student.student){
      student.student = 'No encontrado' 
    }
    
    return {
      student
    }
  }
}
