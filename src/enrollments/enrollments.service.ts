import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/createEnrollment.dto';
import { UpdateEnrollmentDto } from './dto/updateEnrollment.dto';
import { Enrollment, enrollmentExpanded, newEnrollment } from './models/enrollments.interface';
import { CoursesService } from 'src/courses/courses.service';
import { StudentsService } from 'src/students/students.service';
import { PaginationDto } from 'src/courses/dto/pagination.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Enrollment as EnrollmentEntity } from './entities/enrollment.entity';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';



enum enrollmentOrder {
  DESC = -1,
  ASC = 1
}
@Injectable()
export class EnrollmentsService {

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

  async checkStudentAndCourse(enrollmentDto: CreateEnrollmentDto | UpdateEnrollmentDto, id?: ParseMongoIdPipe): Promise<boolean>{

    if(enrollmentDto.userId){
      const student = this.studentsService.findById(enrollmentDto.userId);
      if(!student){
        throw new NotFoundException(`No se encuentra el usuario con id ${enrollmentDto.userId}`)
      }
    }
    
    if (enrollmentDto.courseId){
      try{
        const course = await this.coursesService.findOne(enrollmentDto.courseId);
        if(!course){
          throw new NotFoundException(`No se encuentra el curso con id ${enrollmentDto.courseId}`)
        }
      }catch(error){
        id ? this.handleExceptions(error, 'consultar', enrollmentDto.courseId) : this.handleExceptions(error, 'consultar');
      }
    }

    return true;
  }
  
  async create(createEnrollmentDto: CreateEnrollmentDto): Promise<Enrollment> {
    try {
      await this.checkStudentAndCourse(createEnrollmentDto);
      const newEnrollmentMongo = await this.enrollmentModel.create(createEnrollmentDto);
      const {_id, courseId, userId } = newEnrollmentMongo;
      const newEnrollmentMg= {id: _id.toString(), courseId, userId}
      return newEnrollmentMg;
    }catch(error){
      // console.log('Se presenta error: ', error);
      this.handleExceptions(error, 'guardar');
    }
  }

  async findAll(paginationDto?: PaginationDto) : Promise<Enrollment[]> {
    const {limit, offset} = paginationDto;
    try{
      const enrollmentMg = await this.enrollmentModel.find().sort({
        id: enrollmentOrder[this.defaultOrder] // Ordena por atributo curso ascendente (1) o descendentemente (-1).
      }).limit(limit).skip(offset)
      //.select('-__v') // Elimina de la respuesta el atributo __v
      const enrollments = enrollmentMg.map((enrollmentMg) => {
        const {_id, courseId, userId} = enrollmentMg;
        const enrollment = {id: _id, courseId, userId};
        return enrollment
      })
    return enrollments
    }catch(error){
      this.handleExceptions(error, 'buscar');
    }
  }

  async findAllWithUserAndCourse(paginationDto?: PaginationDto): Promise<enrollmentExpanded []> {
    const students = this.studentsService.findAll();
    try{
      const enrollments = await this.findAll(paginationDto);
      const courses = await this.coursesService.findAll(paginationDto);
      // console.log('Courses: ', courses);
      const enrollmentExpanded = enrollments.map((enrollment) => {
        const enrollmentExp = {...enrollment, 
          course: courses.find((course) => course.id.valueOf() === enrollment.courseId.valueOf()), 
          user: students.find((student) => student.id === enrollment.userId)};
        return enrollmentExp;
    })
    // console.log('EnrollmentExpanded: ', enrollmentExpanded);
    return enrollmentExpanded;
    }catch(error){
      console.log('Se ha presentado error al consultar las inscripciones ', error.message)
    }
  }

  async findOne(id: ParseMongoIdPipe) {
    try{
      const enrollment = await this.enrollmentModel.findById(id);

      if(!enrollment){
          throw new NotFoundException(`Inscripción con id: ${id} no encontrada.`);
      }else{
        const {_id, courseId, userId} = enrollment;
        const enrollmentMg = {id: _id, courseId, userId};
        return enrollmentMg;
      }
    }catch(error){
      this.handleExceptions(error, 'buscar', id);
    }
  }

  async update(id: ParseMongoIdPipe, updateEnrollmentDto: UpdateEnrollmentDto) {
    try{
      await this.checkStudentAndCourse(updateEnrollmentDto, id);
      const enrollment = await this.findOne(id);
      if(!enrollment){
          throw new NotFoundException(`Inscripción con id: ${id} no encontrada.`);
      }else{
        const updatedEnrollment = await this.enrollmentModel.findOneAndUpdate({_id: id}, updateEnrollmentDto, { new: true}) // Devuelve la inscripción actualizada.
        if(updatedEnrollment){
          const updatedEnrollment = {...enrollment, ...updateEnrollmentDto};
          console.log('Se ha actualizado la inscripción: ', updatedEnrollment);
          return updatedEnrollment;
        }else{
          throw new Error('Inscripción no actualizada.')
        }
      }
    }catch(error){
      this.handleExceptions(error, 'editar', id);
    }
  }
  
  async delete(id: ParseMongoIdPipe): Promise<Enrollment> {
    try{
      const enrollment = await this.enrollmentModel.findOneAndDelete({_id: id});
      // console.log('Respuesta Delete: ', enrollment);

      if(!enrollment){
          throw new NotFoundException(`Inscripción con id: ${id} no encontrada.`);
      }else{
        const {_id, courseId, userId} = enrollment;
        const enrollmentDeleted = {id: _id, courseId, userId};
        return enrollmentDeleted;
      }
    }catch(error){
      this.handleExceptions(error, 'eliminar', id);
    }
  }


  async fillEnrollmentsWithSEED( ENROLLMENTS_SEED: newEnrollment[]): Promise<Enrollment[]>{

    const enrollmentsSeedMg: CreateEnrollmentDto [] = ENROLLMENTS_SEED.map((enrollment: newEnrollment) : CreateEnrollmentDto => {
      const {courseId, userId} = enrollment;
      const enrollmentMg = {courseId, userId};
      return enrollmentMg;
    });

    // Haciendo uso de un arreglo.
    const createdEnrollmentsMg = this.createMany(enrollmentsSeedMg);
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
  
  private handleExceptions(error: any, verb: string, id?: ParseMongoIdPipe){

    const errorMsg = error.keyValue;
    if(id){
      if(error.code === 11000){
        throw new BadRequestException(`Se ha presentado error al intentar ${verb} la inscripción con id: ${id} - ${JSON.stringify(errorMsg)} duplicado.}`);
      }else if (error.status === 404) {
        throw new NotFoundException(`Se ha presentado error al intentar ${verb} la inscripción con id: ${id} - ${JSON.stringify(error.message)}`)
      }else{
        throw new InternalServerErrorException(`Se ha presentado error al intentar ${verb} la inscripción con id ${id} - ${JSON.stringify(error.message)}}`);
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