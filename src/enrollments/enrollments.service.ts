import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/createEnrollment.dto';
import { UpdateEnrollmentDto } from './dto/updateEnrollment.dto';
import { Enrollment, enrollmentExpanded, newEnrollment } from './models/enrollments.interface';
import { v4 as uuid } from 'uuid';
import { CoursesService } from 'src/courses/courses.service';
import { StudentsService } from 'src/students/students.service';
import { PaginationDto } from 'src/courses/dto/pagination.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Enrollment as EnrollmentEntity } from './entities/enrollment.entity';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnrollmentsService {

  private enrollments: Enrollment [] = [];
  private defaultOrder: string;
  
  constructor(
    private readonly studentsService: StudentsService, 
    private readonly coursesService: CoursesService,

    @InjectModel(EnrollmentEntity.name) 
    private readonly enrollmentModel: Model<EnrollmentEntity>,
    private readonly configService: ConfigService,
  ){
    this.defaultOrder = configService.get<string>('COURSE_ORDER');
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

  //TODO: Ajustar para que coincidan IDs de estudiantes con Mongo DB.
  async findAllWithUserAndCourse(paginationDto?: PaginationDto): Promise<enrollmentExpanded []> {
    const enrollments = this.findAll();
    const students = this.studentsService.findAll();
    try{
      const courses = await this.coursesService.findAll(paginationDto);
      // console.log('Courses: ', courses);
      const enrollmentExpanded = enrollments.map((enrollment) => {
        const enrollmentExp = {...enrollment, 
          course: courses.find((course) => course.id.valueOf() === enrollment.courseId), 
          user: students.find((student) => student.id === enrollment.userId)};
        return enrollmentExp;
    })
    console.log('EnrollmentExpanded: ', enrollmentExpanded);
    return enrollmentExpanded;
    }catch(error){
      console.log('Se ha presentado error al consultar las inscripciones ', error.message)
    }
  }

  findOne(id: string) {
    const enrollment = this.enrollments.find((enrollment) => enrollment.id.valueOf() === id);
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

  // fillEnrollmentsWithSEED( ENROLLMENTS_SEED: Enrollment[]){
  //   this.enrollments = ENROLLMENTS_SEED;
  // }

  async fillEnrollmentsWithSEED( ENROLLMENTS_SEED: newEnrollment[]): Promise<Enrollment[]>{

    const enrollmentsSeedMg: CreateEnrollmentDto [] = ENROLLMENTS_SEED.map((enrollment: newEnrollment) : CreateEnrollmentDto => {
      const {courseId, userId} = enrollment;
      const enrollmentMg = {courseId, userId};
      return enrollmentMg;
    });

    // Haciendo uso de un arreglo.
    const createdEnrollmentsMg = this.createMany(enrollmentsSeedMg);
    // this.courses = COURSES_SEED;
    return createdEnrollmentsMg;
  }
  
  async createMany(createEnrollmentDto: CreateEnrollmentDto | CreateEnrollmentDto []): Promise<any> {
    try {
      //this.courseModel.insertMany ?
      const newEnrollmentMongo = this.enrollmentModel.create(createEnrollmentDto);
      // const {_id, creditos, curso } = newCourseMongo;
      // const newCourseMg = {id: _id.toString(), curso, creditos}
      return newEnrollmentMongo;
    }catch(error){
      console.log('Se presenta error: ', error);
      this.handleExceptions(error, 'guardar');
    }
  }
  
  private handleExceptions(error: any, verb: string, id?: string){

    const errorMsg = error.keyValue;
    if(id){
      if(error.code === 11000){
        throw new BadRequestException(`Se ha presentado error al intentar ${verb} la inscripción con id: ${id} - ${JSON.stringify(errorMsg)} duplicado.}`);
      }else{
        throw new InternalServerErrorException(`Se ha presentado error al intentar ${verb} la inscrupción con id ${id} - ${JSON.stringify(error.message)}}`);
      }
    }else{
      if (error.code === 11000){
        throw new BadRequestException(
          `Se ha presentado error al intentar ${verb} la inscripción - ${JSON.stringify(errorMsg)} duplicado.`
        )
      }else{
        throw new InternalServerErrorException(`Se ha presentado error al intentar ${verb} las inscripciones - ${JSON.stringify(error.message)}}`);
      }
    }
  }

}