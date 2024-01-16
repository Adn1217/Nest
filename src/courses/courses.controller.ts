import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, HttpException, HttpStatus } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/createCourse.dto';
import { UpdateCourseDto } from './dto/updateCourse.dto';
import { Course } from './models/courses.model';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  create(@Body() createCourseDto: CreateCourseDto) : Course {
    if (isNaN(+createCourseDto.creditos)){
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: `El atributo 'credito' debe ser un número`,
      }, HttpStatus.BAD_REQUEST)
    }
    const course = this.coursesService.create(createCourseDto);
    return course;
  }

  @Get()
  findAll(): Course[] {
    const courses = this.coursesService.findAll();
    return courses;
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe({ version: '4'})) id: string) : Course {
    const course = this.coursesService.findOne(id);
    return course;
  }

  @Patch(':id')
  update(@Param('id', new ParseUUIDPipe({ version: '4'})) id: string, @Body() updateCourseDto: UpdateCourseDto) : Course {
    if (Object.keys(updateCourseDto).length === 0){
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: `No se encuentra información en el payload`,
      }, HttpStatus.BAD_REQUEST)
    }
    if (isNaN(+updateCourseDto.creditos)){
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: `El atributo 'creditos' debe ser un número`,
      }, HttpStatus.BAD_REQUEST)
    }
    const course = this.coursesService.update(id, updateCourseDto);
    return course;
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe({ version: '4'})) id: string): Course {
    return this.coursesService.remove(id);
  }
}
