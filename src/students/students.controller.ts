import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseUUIDPipe, Post, Put, Query } from '@nestjs/common';
import { StudentsService } from './students.service';
import { users } from './models/students.interface';
import { CreateStudentDto, UpdateStudentDto } from './dtos';

@Controller('users')
export class StudentsController {

  constructor( private readonly studentsService: StudentsService){

  }

  @Get()
  getStudents(@Query('correo') correo: string) : users[] | users{
    if(correo){
      const student = this.studentsService.findByEmail(correo);
      return student;
    }else{
      const students = this.studentsService.findAll();
      return students;
    }
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
  
  @Put('/:id')
  updateStudent(@Param('id', new ParseUUIDPipe({ version: '4'})) id: string, @Body() studentDto: UpdateStudentDto ): users{
    if (Object.keys(studentDto).length === 0){
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: `No se encuentra información en el payload`,
      }, HttpStatus.BAD_REQUEST)
    }
    const updatedStudent = this.studentsService.updateStudent(id, studentDto);
    return updatedStudent
  }

  @Delete('/:id')
  deleteStudent(@Param('id', new ParseUUIDPipe({ version: '4'})) id: string) : users{
    const deletedStudent = this.studentsService.deleteStudent(id);
    return deletedStudent;
  }
}
