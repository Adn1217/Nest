import { BadRequestException, Injectable } from '@nestjs/common';
import { CoursesService } from 'src/courses/courses.service';
import { StudentsService } from 'src/students/students.service';
import { STUDENTS_SEED, COURSES_SEED, TEACHERS_SEED, ENROLLMENTS_SEED } from './data';
import { TeachersService } from 'src/teachers/teachers.service';
import { EnrollmentsService } from 'src/enrollments/enrollments.service';
import { seedDB } from './models/seedDB.model';

@Injectable()
export class SeedService {

  constructor( private readonly studentService: StudentsService, private readonly courseService: CoursesService, private readonly teacherService: TeachersService, private readonly enrollmentService: EnrollmentsService){

  }

  async populateDB(): Promise<seedDB> {

    const createdSeedDB : seedDB = {
      createdStudents: [],
      createdTeachers: [],
      createdCourses: [] ,
      createdEnrollments: []
    }

    // createdSeedDB.createdTeachers = this.teacherService.fillTeachersWithSEED(TEACHERS_SEED);
    // console.log('Profesores creados: ', createdSeedDB.createdTeachers);
    this.teacherService.fillTeachersWithSEED(TEACHERS_SEED);
    console.log('Profesores creados: ', TEACHERS_SEED);
    try{

      const createdStudentsMg = await this.studentService.fillStudentsWithSEED(STUDENTS_SEED);
      console.log('Estudiantes creados: ', createdStudentsMg);
      createdSeedDB.createdStudents = createdStudentsMg;
    }catch(error){
      if(error.code === 11000){
        throw new BadRequestException(`Se ha presentado error al intentar cargar los estudiantes por defecto - ${JSON.stringify(error.message)}}`);
      }
    }

    try{
      
      const createdEnrollmentsMg = await this.enrollmentService.fillEnrollmentsWithSEED(ENROLLMENTS_SEED);
      // const createdCoursesMg = await this.courseService.fillCoursesWithSEED(COURSES_SEED);
      console.log('Inscripciones creadas: ', createdEnrollmentsMg);
      createdSeedDB.createdEnrollments = createdEnrollmentsMg;
      // return createdEnrollmentsMg;
      // return `Seed loaded on DBs`;
    }catch(error){
      if(error.code === 11000){
        throw new BadRequestException(`Se ha presentado error al intentar cargar los cursos por defecto - ${JSON.stringify(error.message)}}`);
      }
    }

    try{
      const createdCoursesMg = await this.courseService.fillCoursesWithSEED(COURSES_SEED);
      console.log('Cursos creados: ', createdCoursesMg);
      createdSeedDB.createdCourses = createdCoursesMg;
      // return createdCoursesMg;
      // return `Seed loaded on DBs`;
    }catch(error){
      if(error.code === 11000){
        throw new BadRequestException(`Se ha presentado error al intentar cargar los cursos por defecto - ${JSON.stringify(error.message)}}`);
      }
    }

    return createdSeedDB;
  }
}