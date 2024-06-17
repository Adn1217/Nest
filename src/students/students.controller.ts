import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { StudentsService } from './students.service';
import { studentQueryParams, users } from './models/students.interface';
import { CreateStudentDto, UpdateStudentDto } from './dtos';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { PaginationDto } from 'src/courses/dto/pagination.dto';

@Controller('users')
export class StudentsController {

  constructor( private readonly studentsService: StudentsService){

  }

  @Get()
  async getStudents(@Query() query: studentQueryParams) : Promise<users[] | users>{
    const {correo, ...rest} = query;
    const paginationDto: PaginationDto = rest;
    if(correo){
      const student = await this.studentsService.findByEmail(correo);
      return student;
    }else{
      const students = await this.studentsService.findAll(paginationDto);
      return students;
    }
  }

  @Get('/:id')
  async getStudentById(@Param('id', ParseMongoIdPipe) id: ParseMongoIdPipe): Promise<users>{
  const student = this.studentsService.findOne(id);
    return student 
  }

  @Post()
  // @UsePipes(ValidationPipe) // Se implementa globalmente en la app.
  async createStudent(@Body() studentDto: CreateStudentDto): Promise<users>{
    const newUser = this.studentsService.create(studentDto);
    return newUser
  }
  
  @Put('/:id')
  async updateStudent(@Param('id', ParseMongoIdPipe) id: ParseMongoIdPipe, @Body() studentDto: UpdateStudentDto ): Promise<users>{
    if (Object.keys(studentDto).length === 0){
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: `No se encuentra información en el payload`,
      }, HttpStatus.BAD_REQUEST)
    }
    const updatedStudent = await this.studentsService.update(id, studentDto);
    return updatedStudent
  }

  @Delete('/:id')
  async deleteStudent(@Param('id', ParseMongoIdPipe) id: ParseMongoIdPipe) : Promise<users>{
    const deletedStudent = await this.studentsService.delete(id);
    return deletedStudent;
  }
}
