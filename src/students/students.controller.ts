import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { StudentsService, newUser } from './students.service';

@Controller('students')
export class StudentsController {

  constructor( private readonly studentsService: StudentsService){

  }

  @Get()
  getStudents() {
    const students = this.studentsService.findAll();
    return students
  }

  @Get('/:id')
  getStudentById(@Param('id', ParseIntPipe) id: number){
    const student = this.studentsService.findById(+id);
    return student 
  }

  @Post()
  createStudent(@Body() body: newUser){
    return body
  }
  
  @Patch('/:id')
  updateStudent(@Param('id', ParseIntPipe) id: number, @Body() body: newUser){
    return body
  }

  @Delete('/:id')
  deleteStudent(@Param('id', ParseIntPipe) id: number){
    return {
      message: `Eliminado exitoso del usuario ${id}`
    }
  }
}
