import { Controller, Get, Post, Body, Param, Delete, HttpException, HttpStatus, Put, Query } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/createTeacher.dto';
import { UpdateTeacherDto } from './dto/updateTeacher.dto';
import { Teacher, teacherQueryParams } from './models/teachers.interface';
import { PaginationDto } from 'src/courses/dto/pagination.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post()
  create(@Body() createTeacherDto: CreateTeacherDto): Promise<Teacher> {
    if (isNaN(+createTeacherDto.edad)){
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: `El atributo 'edad' debe ser un número`,
      }, HttpStatus.BAD_REQUEST)
    }
    const course = this.teachersService.create(createTeacherDto);
    return course;
  }

  // @Get()
  // findAll() {
  //   const courses = this.teachersService.findAll();
  //   return courses;
  // }
  
  @Get()
  async getStudents(@Query() query: teacherQueryParams) : Promise<Teacher[] | Teacher>{
    const {correo, ...rest} = query;
    const paginationDto: PaginationDto = rest;
    if(correo){
      const student = await this.teachersService.findByEmail(correo);
      return student;
    }else{
      const students = await this.teachersService.findAll(paginationDto);
      return students;
    }
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: ParseMongoIdPipe): Promise<Teacher> {
    const course = this.teachersService.findOne(id);
    return course;
  }

  @Put(':id')
  update(@Param('id', ParseMongoIdPipe) id: ParseMongoIdPipe, @Body() updateTeacherDto: UpdateTeacherDto): Promise<Teacher> {
    if (Object.keys(updateTeacherDto).length === 0){
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: `No se encuentra información en el payload`,
      }, HttpStatus.BAD_REQUEST)
    }
    const teacher = this.teachersService.update(id, updateTeacherDto);
    return teacher;
  }

  @Delete(':id')
  delete(@Param('id', ParseMongoIdPipe) id: ParseMongoIdPipe) : Promise<Teacher> {
    const deletedTeacher = this.teachersService.delete(id);
    return deletedTeacher;
  }
}
