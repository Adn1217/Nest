import { Body, Controller, Delete, Get, Param, ParseIntPipe, ParseUUIDPipe, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { StudentsService } from './students.service';
import { users } from './models/students.interface';
import { CreateStudentDto, UpdateStudentDto } from './dtos';

@Controller('students')
export class StudentsController {

  constructor( private readonly studentsService: StudentsService){

  }

  @Get()
  getStudents() : users[]{
    const students = this.studentsService.findAll();
    return students
  }

  @Get('/:id')
  getStudentById(@Param('id', new ParseUUIDPipe({ version: '4'})) id: string): users{
  const student = this.studentsService.findById(id);
    return student 
  }

  @Post()
  // @UsePipes(ValidationPipe) // Se implementa globalmente en la app.
  createStudent(@Body() studentDto: CreateStudentDto): users{
    const newUser = this.studentsService.createStudent(studentDto);
    return newUser
  }
  
  @Patch('/:id')
  updateStudent(@Param('id', new ParseUUIDPipe({ version: '4'})) id: string, @Body() studentDto: UpdateStudentDto ): users{
    const updatedStudent = this.studentsService.updateStudent(id, studentDto);
    return updatedStudent
  }

  @Delete('/:id')
  deleteStudent(@Param('id', new ParseUUIDPipe({ version: '4'})) id: string) : users{
    const deletedStudent = this.studentsService.deleteStudent(id);
    return deletedStudent;
  }
}
