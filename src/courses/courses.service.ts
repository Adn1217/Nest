import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/createCourse.dto';
import { UpdateCourseDto } from './dto/updateCourse.dto';
import { v4 as uuid } from 'uuid';
import { Course } from './models/courses.model';
import { Course as CourseEntity } from './entities/course.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(CourseEntity.name) 
    private readonly courseModel: Model<CourseEntity>){
  }

  private courses: Course[] = []

  async create(createCourseDto: CreateCourseDto) {
    
    // const newCourse = {
    //   id: uuid(), 
    //   ...createCourseDto, 
    //   creditos: +createCourseDto.creditos};
    // this.courses.push(newCourse);
    try {
      const newCourseMongo = await this.courseModel.create(createCourseDto);
      // console.log('NewCourseMongo: ', newCourseMongo);
      const {_id, creditos, curso, __v, ...rest} = newCourseMongo;
      const newCourseMg = {id: _id.toString(), curso, creditos}
      this.courses.push(newCourseMg);
      // console.log('NewCourseMongo2: ', newCourseMg);
      return newCourseMg;
    }catch(error){
      console.log('Se presenta error: ', error);
      let errorMsg = error
      if(error.code === 11000){
        errorMsg = error.keyValue
      }
      throw new BadRequestException(
        `Se ha presentado error al intentar guardar el curso ${createCourseDto.curso} - ${JSON.stringify(errorMsg)} duplicado.`
      )
    }
  }

  findAll() : Course[] {
    return this.courses
  }

  findOne(id: string) {
    const course = this.courses.find((course) => course.id === id);
    if(!course){
      throw new NotFoundException(`Curso con id: ${id} no encontrado.`)
    }
    return course;
  }

  update(id: string, updateCourseDto: UpdateCourseDto): Course {
    const course = this.findOne(id);
    const updatedCourse = {...course, ...updateCourseDto}
    const index = this.courses.findIndex((course) => course.id === id);
    this.courses.splice(index, 1, updatedCourse);
    return updatedCourse
  }

  delete(id: string) {
    const course = this.findOne(id);
    const index = this.courses.findIndex((course) => course.id === id);
    this.courses.splice(index, 1);
    return course
  }

  fillCoursesWithSEED( COURSES_SEED: Course[]){
    this.courses = COURSES_SEED;
  }
}
