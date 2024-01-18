import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, HttpException, HttpStatus, Header } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/createTeacher.dto';
import { UpdateTeacherDto } from './dto/updateTeacher.dto';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post()
  create(@Body() createTeacherDto: CreateTeacherDto) {
    if (isNaN(+createTeacherDto.edad)){
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: `El atributo 'credito' debe ser un número`,
      }, HttpStatus.BAD_REQUEST)
    }
    const course = this.teachersService.create(createTeacherDto);
    return course;
  }

  @Get()
  @Header("Access-Control-Allow-Origin", "*") // Avoid CORS Policy.
  findAll() {
    const courses = this.teachersService.findAll();
    return courses;
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe({version: '4'})) id: string) {
    const course = this.teachersService.findOne(id);
    return course;
  }

  @Patch(':id')
  update(@Param('id', new ParseUUIDPipe({version: '4'})) id: string, @Body() updateTeacherDto: UpdateTeacherDto) {
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
  delete(@Param('id', new ParseUUIDPipe({version: '4'})) id: string) {
    const deletedTeacher = this.teachersService.delete(id);
    return deletedTeacher;
  }
}
