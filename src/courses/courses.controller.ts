import { Controller, Get, Post, Body, Param, Delete, ParseUUIDPipe, HttpException, HttpStatus, Header, Put } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/createCourse.dto';
import { UpdateCourseDto } from './dto/updateCourse.dto';
import { Course } from './models/courses.model';
// import { Response as Res } from 'express';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  create(@Body() createCourseDto: CreateCourseDto): Promise<Course> {
    if (isNaN(+createCourseDto.creditos)){
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: `El atributo 'credito' debe ser un número`,
      }, HttpStatus.BAD_REQUEST);
    }
    const course = this.coursesService.create(createCourseDto);
    return course;
  }

  // @Get()
  // findAll(@Response() res: Res): Res {
  //   const courses = this.coursesService.findAll();
  //   return res.setHeader("Access-Control-Allow-Origin", "*").json(courses);
  // } // Avoid CORS Policy.
  
  @Get()
  @Header("Access-Control-Allow-Origin", "*") // Avoid CORS Policy.
  findAll(): Promise<Course[]> {
    const courses = this.coursesService.findAll();
    return courses;
  } 

  @Get(':id')
  findOne(@Param('id') id: string) : Promise<Course> {
    const course = this.coursesService.findOne(id);
    return course;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) : Promise<Course> {
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
  delete(@Param('id') id: string): Promise<Course> {
    return this.coursesService.delete(id);
  }
}
