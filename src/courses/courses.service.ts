import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/createCourse.dto';
import { UpdateCourseDto } from './dto/updateCourse.dto';
import { v4 as uuid } from 'uuid';
import { Course } from './models/courses.model';

@Injectable()
export class CoursesService {

  private courses: Course[] = []

  create(createCourseDto: CreateCourseDto) {
    const newCourse = {
      id: uuid(), 
      ...createCourseDto, 
      creditos: +createCourseDto.creditos};
    this.courses.push(newCourse);
    return newCourse
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
