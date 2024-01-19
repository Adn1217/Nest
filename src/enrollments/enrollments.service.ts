import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/createEnrollment.dto';
import { UpdateEnrollmentDto } from './dto/updateEnrollment.dto';
import { Enrollment } from './models/enrollments.interface';
import { v4 as uuid } from 'uuid';
import { CoursesService } from 'src/courses/courses.service';
import { StudentsService } from 'src/students/students.service';

@Injectable()
export class EnrollmentsService {

  private enrollments: Enrollment [] = [];

  constructor(private readonly studentsService: StudentsService, private readonly coursesService: CoursesService){

  }

  checkStudentAndCourse(enrollmentDto: CreateEnrollmentDto | UpdateEnrollmentDto){

    if(enrollmentDto.userId){
      const student = this.studentsService.findById(enrollmentDto.userId);
      if(!student){
        throw new NotFoundException(`No se encuentra el usuario con id ${enrollmentDto.userId}`)
      }
    }
    
    if (enrollmentDto.courseId){
      const course = this.coursesService.findOne(enrollmentDto.courseId);
      if(!course){
        throw new NotFoundException(`No se encuentra el curso con id ${enrollmentDto.courseId}`)
      }
    }

    return true;
  }
  
  create(createEnrollmentDto: CreateEnrollmentDto) {

    this.checkStudentAndCourse(createEnrollmentDto);
    const newEnrollment = {
      id: uuid(),
      ...createEnrollmentDto, 
    }
    this.enrollments.push(newEnrollment);
    return newEnrollment;
  }

  findAll(): Enrollment [] {
    const enrollments = this.enrollments;
    return enrollments;
  }

  findOne(id: string) {
    const enrollment = this.enrollments.find((enrollment) => enrollment.id === id);
    if(!enrollment){
      throw new NotFoundException(`Inscripción con id: ${id} no encontrada.`)
    }
    return enrollment;
  }

  update(id: string, updateEnrollmentDto: UpdateEnrollmentDto) {
    this.checkStudentAndCourse(updateEnrollmentDto);
    const enrollment = this.findOne(id);
    const updatedEnrollment = {...enrollment, ...updateEnrollmentDto}
    const index = this.enrollments.findIndex((enrollment) => enrollment.id === id);
    this.enrollments.splice(index, 1, updatedEnrollment);
    return updatedEnrollment;
  }

  delete(id: string) {
    const enrollment = this.findOne(id);
    const index = this.enrollments.findIndex((enrollment) => enrollment.id === id);
    this.enrollments.splice(index, 1);
    return enrollment;
  }

  fillEnrollmentsWithSEED( ENROLLMENTS_SEED: Enrollment[]){
    this.enrollments = ENROLLMENTS_SEED;
  }

}