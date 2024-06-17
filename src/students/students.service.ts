import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { newUser, users } from './models/students.interface';
import { CreateStudentDto, UpdateStudentDto } from './dtos';
import { Student as StudentEntity } from './entities/student.entity';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { PaginationDto } from 'src/courses/dto/pagination.dto';


enum studentOrder {
  DESC = -1,
  ASC = 1
}
@Injectable()
export class StudentsService {

  private students : users [] = []
  private defaultOrder: string;
  
  constructor(
    @InjectModel(StudentEntity.name) 
    private readonly studentModel: Model<StudentEntity>,
    private readonly configService: ConfigService,
  ){
    this.defaultOrder = configService.get<string>('STUDENT_ORDER');
  }


  // findAll(): users[] {
  //   return this.students;
  // }

  async findAll(paginationDto?: PaginationDto) : Promise<users[]> {
    const {limit, offset} = paginationDto;
    try{
      const studentsMg = await this.studentModel.find().sort({
        apellidos: studentOrder[this.defaultOrder] // Ordena por atributo curso ascendente (1) o descendentemente (-1).
      }).limit(limit).skip(offset)
      //.select('-__v') // Elimina de la respuesta el atributo __v
      const students = studentsMg.map((courseMg) => {
        const {_id, nombres, apellidos, usuario, edad, correo, password, role} = courseMg;
        const student = {id: _id, nombres, apellidos, usuario, edad, correo, password, role};
        return student;
      })
    return students;
    }catch(error){
      this.handleExceptions(error, 'buscar');
    }
  }

  // findById(id: string): users | undefined {
  //   const student = this.students.find((student) => student.id === id);
  //   if(!student){
  //       throw new NotFoundException(`Usuario con id: ${id} no encontrado.`);
  //   }
  //   return student
  // }
  
  async findOne(id: ParseMongoIdPipe) : Promise<users> {
    try{
      const student = await this.studentModel.findById(id);

      if(!student){
          throw new NotFoundException(`Estudiante con id: ${id} no encontrado.`);
      }else{
        const {_id, nombres, apellidos, usuario, edad, correo, password, role} = student;
        const studentMg = {id: _id, nombres, apellidos, usuario, edad, correo, password, role};
        return studentMg;
      }
    }catch(error){
      // console.log('Se presenta error: ', error );
      this.handleExceptions(error, 'buscar', id);
    }
  }

  async findByEmail(email: string): Promise<users> {
    const student = await this.studentModel.findOne({correo: email});
    if(!student){
        throw new NotFoundException(`Usuario con correo: ${email} no encontrado.`);
    }else{
      const {_id, nombres, apellidos, usuario, edad, correo, password, role } = student;
      const studenMg = {id: _id, nombres, apellidos, usuario, edad, correo, password, role};
      return studenMg
    }
  }

  // createStudent(createStudentDto: CreateStudentDto): newUser {
  //   const { nombres, apellidos, usuario, edad, correo, password, role } = createStudentDto;
  //   const newStudent: users = { 
  //       // id : uuid(), 
  //       nombres,
  //       apellidos,
  //       usuario,
  //       edad: +edad, 
  //       correo,
  //       password,
  //       role
  //   };
  //   this.students.push(newStudent);
  //   return newStudent;
  // }
  
  async create(createStudentDto: CreateStudentDto): Promise<users> {
    try {
      const newStudentMongo = await this.studentModel.create(createStudentDto);
      const {_id, nombres, apellidos, usuario, edad, correo, password, role } = newStudentMongo;
      const newEnrollmentMg= {id: _id.toString(), nombres, apellidos, usuario, edad, correo, password, role}
      return newEnrollmentMg;
    }catch(error){
      // console.log('Se presenta error: ', error);
      this.handleExceptions(error, 'guardar');
    }
  }

  // updateStudent(id: ParseMongoIdPipe, updateStudentDto: UpdateStudentDto): users{
  //   const savedStudent = this.findOne(id);
  //   // console.log('SavedStudent: ', savedStudent);
  //   const updatedStudent: users = {...savedStudent, ...updateStudentDto, edad: +updateStudentDto.edad}
  //   if(!updatedStudent.edad){ //TODO: Verify necesity of this if.
  //       updatedStudent.edad = savedStudent.edad;
  //   }
  //   const index = this.students.findIndex((student) => student.id === id);
  //   // console.log('Index: ', index);
  //   this.students.splice(index,1, updatedStudent);
  //   return updatedStudent;
  // }

  async update(id: ParseMongoIdPipe, updateStudentDto: UpdateStudentDto): Promise<users> {
    try{
      const student = await this.findOne(id);
      if(!student){
          throw new NotFoundException(`Estudiante con id: ${id} no encontrado.`);
      }else{
        const updatedStudent = await this.studentModel.findOneAndUpdate({_id: id}, updateStudentDto, { new: true}) // Devuelve el estudiante actualizado.
        if(updatedStudent){
          const updatedStudent = {...student, ...updateStudentDto};
          console.log('Se ha actualizado el usuario: ', updatedStudent);
          return updatedStudent;
        }else{
          throw new Error('Estudiante no actualizado.')
        }
      }
    }catch(error){
      this.handleExceptions(error, 'editar', id);
    }
  }

  // deleteStudent(id: ParseMongoIdPipe): users {
  //   const savedStudent = this.findOne(id);
  //   const index = this.students.findIndex((student) => student.id === id);
  //   this.students.splice(index,1)
  //   return savedStudent
  // }
  
  async delete(id: ParseMongoIdPipe): Promise<any> {
    try{
      // const course = await this.findOne(id);
      const deletedStudentMg = await this.studentModel.findByIdAndDelete(id);
      // console.log("deletionResp: ", deletedStudentMg);
      if(!deletedStudentMg){
          throw new NotFoundException(`Estudiante con id: ${id} no encontrado.`);
      }else{
        const {_id, nombres, apellidos, usuario, edad, correo, password, role} = deletedStudentMg;
        const deletedStudent = {id: _id, nombres, apellidos, usuario, edad, correo, password, role};
        return deletedStudent;
      }
    }catch(error){
      this.handleExceptions(error, 'eliminar', id);
    }
  }

  // fillStudentsWithSEED( STUDENTS_SEED: users[]){
  //   this.students = STUDENTS_SEED;
  // }
  
  async fillStudentsWithSEED( STUDENTS_SEED: newUser[]): Promise<users[]>{
    const studentsSeedMg: CreateStudentDto [] = STUDENTS_SEED.map((student: newUser) : CreateStudentDto => {
      const {nombres, apellidos, usuario, edad, correo, password, role} = student;
      const studentMg = new CreateStudentDto(nombres, apellidos, usuario, edad, correo, password, role)
      // console.log("studentMgDto: ", studentMg);
      return studentMg;
    });

    // Haciendo uso de un arreglo.
    const createdStudentsMg = this.createMany(studentsSeedMg);
    return createdStudentsMg;
  }
  
  async createMany(createStudentDto: CreateStudentDto | CreateStudentDto []): Promise<any> {
    try {
      //this.courseModel.insertMany ?
      const newStudentMongo = this.studentModel.create(createStudentDto);
      // const {_id, creditos, curso } = newCourseMongo;
      // const newCourseMg = {id: _id.toString(), curso, creditos}
      return newStudentMongo;
    }catch(error){
      console.log('Se presenta error: ', error);
      this.handleExceptions(error, 'guardar');
    }
  }

  private handleExceptions(error: any, verb: string, id?: ParseMongoIdPipe){

    const errorMsg = error.keyValue;
    if(id){
      if(error.code === 11000){
        throw new BadRequestException(`Se ha presentado error al intentar ${verb} el estudiante con id: ${id} - ${JSON.stringify(errorMsg)} duplicado.}`);
      }else if (error.status === 404) {
        throw new NotFoundException(`Se ha presentado error al intentar ${verb} el estudiante con id: ${id} - ${JSON.stringify(error.message)}`)
      }else{
        throw new InternalServerErrorException(`Se ha presentado error al intentar ${verb} el estudiante con id ${id} - ${JSON.stringify(error.message)}}`);
      }
    }else{
      if (error.code === 11000){
        throw new BadRequestException(
          `Se ha presentado error al intentar ${verb} los estudiantes - ${JSON.stringify(errorMsg)} duplicado.`
        )
      }else{
        throw new InternalServerErrorException(`Se ha presentado error al intentar ${verb} los estudiantes - ${JSON.stringify(error.message)}}`);
      }
    }
  }
}
