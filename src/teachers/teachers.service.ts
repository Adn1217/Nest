import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateTeacherDto } from './dto/createTeacher.dto';
import { UpdateTeacherDto } from './dto/updateTeacher.dto';
import { Teacher as TeacherEntity } from './entities/teacher.entity';
import { v4 as uuid } from 'uuid';
import { Teacher, newTeacher } from './models/teachers.interface'
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';


enum teacherOrder {
  DESC = -1,
  ASC = 1
}

@Injectable()
export class TeachersService {


  private teachers: Teacher [] = [];
  private defaultOrder: string;

  constructor(

    @InjectModel(TeacherEntity.name) 
    private readonly teacherModel: Model<TeacherEntity>,
    private readonly configService: ConfigService,
  ){
    this.defaultOrder = configService.get<string>('TEACHER_ORDER');
  }

  create(createTeacherDto: CreateTeacherDto) : Teacher {
    const newTeacher = {
      id: uuid(), 
      ...createTeacherDto,
      edad: +createTeacherDto.edad};
    this.teachers.push(newTeacher);
    return newTeacher;
  }

  findAll() : Teacher [] {
    return this.teachers;
  }

  findOne(id: string) : Teacher {
    const teacher = this.teachers.find((teacher) => teacher.id === id);
    if(!teacher){
      throw new NotFoundException(`Profesor con id: ${id} no encontrado.`)
    }
    return teacher;
  }

  update(id: string, updateTeacherDto: UpdateTeacherDto) {
    const teacher = this.findOne(id);
    const updatedTeacher = {...teacher, ...updateTeacherDto}
    const index = this.teachers.findIndex((teacher) => teacher.id === id);
    this.teachers.splice(index, 1, updatedTeacher);
    return updatedTeacher;
  }

  delete(id: string) {
    const teacher = this.findOne(id);
    const index = this.teachers.findIndex((teacher) => teacher.id === id);
    this.teachers.splice(index, 1);
    return teacher;
  }

  // fillTeachersWithSEED( TEACHERS_SEED: Teacher[]){
  //   this.teachers = TEACHERS_SEED;
  //   return TEACHERS_SEED
  // }

  async fillTeachersWithSEED( TEACHERS_SEED: newTeacher[]): Promise<Teacher[]>{
    const teachersSeedMg: CreateTeacherDto [] = TEACHERS_SEED.map((teacher: newTeacher) : CreateTeacherDto => {
      const {nombres, apellidos, usuario, edad, nivelAcademico, materias, correo, password, role} = teacher;
      const teacherMg = {nombres, apellidos, usuario, edad, nivelAcademico, materias, correo, password, role}
      // console.log("studentMgDto: ", studentMg);
      return teacherMg;
    });

    // Haciendo uso de un arreglo.
    const createdTeachersMg = this.createMany(teachersSeedMg);
    return createdTeachersMg;
  }
  
  async createMany(createTeacherDto: CreateTeacherDto | CreateTeacherDto []): Promise<any> {
    try {
      const newTeacherMongo = this.teacherModel.create(createTeacherDto);
      // const {_id, creditos, curso } = newCourseMongo;
      // const newCourseMg = {id: _id.toString(), curso, creditos}
      return newTeacherMongo;
    }catch(error){
      console.log('Se presenta error: ', error);
      this.handleExceptions(error, 'guardar');
    }
  }

  private handleExceptions(error: any, verb: string, id?: ParseMongoIdPipe){

    const errorMsg = error.keyValue;
    if(id){
      if(error.code === 11000){
        throw new BadRequestException(`Se ha presentado error al intentar ${verb} el profesor con id: ${id} - ${JSON.stringify(errorMsg)} duplicado.}`);
      }else if (error.status === 404) {
        throw new NotFoundException(`Se ha presentado error al intentar ${verb} el profesor con id: ${id} - ${JSON.stringify(error.message)}`)
      }else{
        throw new InternalServerErrorException(`Se ha presentado error al intentar ${verb} el profesor con id ${id} - ${JSON.stringify(error.message)}}`);
      }
    }else{
      if (error.code === 11000){
        throw new BadRequestException(
          `Se ha presentado error al intentar ${verb} los profesores - ${JSON.stringify(errorMsg)} duplicado.`
        )
      }else{
        throw new InternalServerErrorException(`Se ha presentado error al intentar ${verb} los profesores - ${JSON.stringify(error.message)}}`);
      }
    }
  }
}
