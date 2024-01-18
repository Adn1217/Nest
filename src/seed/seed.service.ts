import { Injectable } from '@nestjs/common';
import { CoursesService } from 'src/courses/courses.service';
import { StudentsService } from 'src/students/students.service';
import { STUDENTS_SEED, COURSES_SEED, TEACHERS_SEED } from './data';
import { TeachersService } from 'src/teachers/teachers.service';

@Injectable()
export class SeedService {

  constructor( private readonly studentService: StudentsService, private readonly courseService: CoursesService, private readonly teacherService: TeachersService){

  }

  populateDB() {
    this.teacherService.fillTeachersWithSEED(TEACHERS_SEED);
    this.studentService.fillStudentsWithSEED(STUDENTS_SEED);
    this.courseService.fillCoursesWithSEED(COURSES_SEED);
    return `Seed loaded on DBs`;
  }
}
