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
import { PaginationDto } from 'src/courses/dto/pagination.dto';


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
      id: <unknown>'66775ce5a23ea94573431b48' as ParseMongoIdPipe, 
      ...createTeacherDto,
      edad: +createTeacherDto.edad};
    this.teachers.push(newTeacher);
    return newTeacher;
  }

  // findAll() : Teacher [] {
  //   return this.teachers;
  // }
  
  async findAll(paginationDto?: PaginationDto) : Promise<Teacher[]> {
    const {limit, offset} = paginationDto;
    try{
      const teachersMg = await this.teacherModel.find().sort({
        apellidos: teacherOrder[this.defaultOrder] // Ordena por atributo curso ascendente (1) o descendentemente (-1).
      }).limit(limit).skip(offset)
      //.select('-__v') // Elimina de la respuesta el atributo __v
      const teachers = teachersMg.map((teacherMg) => {
        const {_id, nombres, apellidos, usuario, edad, nivelAcademico, materias, correo, password, role} = teacherMg;
        const teacher = {id: _id, nombres, apellidos, usuario, edad, nivelAcademico, materias, correo, password, role};
        return teacher;
      })
    return teachers;
    }catch(error){
      this.handleExceptions(error, 'buscar');
    }
  }

  // findOne(id: ParseMongoIdPipe) : Teacher {
  //   const teacher = this.teachers.find((teacher) => teacher.id === id);
  //   if(!teacher){
  //     throw new NotFoundException(`Profesor con id: ${id} no encontrado.`)
  //   }
  //   return teacher;
  // }
  
  async findOne(id: ParseMongoIdPipe) : Promise<Teacher> {
    try{
      const teacher = await this.teacherModel.findById(id);

      if(!teacher){
          throw new NotFoundException(`Profesor con id: ${id} no encontrado.`);
      }else{
        const {_id, nombres, apellidos, usuario, edad, nivelAcademico, materias, correo, password, role} = teacher;
        const teacherMg = {id: _id, nombres, apellidos, usuario, edad, nivelAcademico, materias, correo, password, role};
        return teacherMg;
      }
    }catch(error){
      // console.log('Se presenta error: ', error );
      this.handleExceptions(error, 'buscar', id);
    }
  }

  async findByEmail(email: string): Promise<Teacher> {
    const teacher = await this.teacherModel.findOne({correo: email});
    if(!teacher){
        throw new NotFoundException(`Usuario con correo: ${email} no encontrado.`);
    }else{
      const {_id, nombres, apellidos, usuario, edad, nivelAcademico, materias, correo, password, role } = teacher;
      const teacherMg = {id: _id, nombres, apellidos, usuario, edad, nivelAcademico, materias, correo, password, role};
      return teacherMg
    }
  }

  // update(id: ParseMongoIdPipe, updateTeacherDto: UpdateTeacherDto) {
  //   const teacher = this.findOne(id);
  //   const updatedTeacher = {...teacher, ...updateTeacherDto}
  //   const index = this.teachers.findIndex((teacher) => teacher.id === id);
  //   this.teachers.splice(index, 1, updatedTeacher);
  //   return updatedTeacher;
  // }
  
  async update(id: ParseMongoIdPipe, updateTeacherDto: UpdateTeacherDto): Promise<Teacher> {
    try{
      const teacher = await this.findOne(id);
      if(!teacher){
          throw new NotFoundException(`Profesor con id: ${id} no encontrado.`);
      }else{
        const updatedTeacher = await this.teacherModel.findOneAndUpdate({_id: id}, updateTeacherDto, { new: true}) // Devuelve el estudiante actualizado.
        if(updatedTeacher){
          const updatedTeacher = {...teacher, ...updateTeacherDto};
          console.log('Se ha actualizado el profesor: ', updatedTeacher);
          return updatedTeacher;
        }else{
          throw new Error('Profesor no actualizado.')
        }
      }
    }catch(error){
      this.handleExceptions(error, 'editar', id);
    }
  }

  delete(id: ParseMongoIdPipe) {
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
