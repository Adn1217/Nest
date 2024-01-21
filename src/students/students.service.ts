import { Injectable, NotFoundException } from '@nestjs/common';
import { users } from './models/students.interface';
import { v4 as uuid } from 'uuid';
import { CreateStudentDto, UpdateStudentDto } from './dtos';

@Injectable()
export class StudentsService {

  private students : users [] = []


  findAll(): users[] {
    return this.students;
  }

  findById(id: string): users | undefined {
    const student = this.students.find((student) => student.id === id);
    if(!student){
        throw new NotFoundException(`Usuario con id: ${id} no encontrado.`);
    }
    return student
  }

  findByEmail(email: string): users[] | undefined {
    const student = this.students.find((student) => student.correo === email);
    if(!student){
        throw new NotFoundException(`Usuario con correo: ${email} no encontrado.`);
    }
    return [student]
  }

  createStudent(createStudentDto: CreateStudentDto): users {
    const { nombres, apellidos, usuario, edad, correo, password, role } = createStudentDto;
    const newStudent: users = { 
        id : uuid(), 
        nombres,
        apellidos,
        usuario,
        edad: +edad, 
        correo,
        password,
        role
    };
    this.students.push(newStudent);
    return newStudent;
  }

  updateStudent(id: string, updateStudentDto: UpdateStudentDto): users{
    const savedStudent = this.findById(id);
    // console.log('SavedStudent: ', savedStudent);
    const updatedStudent: users = {...savedStudent, ...updateStudentDto, edad: +updateStudentDto.edad}
    if(!updatedStudent.edad){ //TODO: Verify necesity of this if.
        updatedStudent.edad = savedStudent.edad;
    }
    const index = this.students.findIndex((student) => student.id === id);
    console.log('Index: ', index);
    this.students.splice(index,1, updatedStudent);
    return updatedStudent;
  }

  deleteStudent(id: string): users {
    const savedStudent = this.findById(id);
    const index = this.students.findIndex((student) => student.id === id);
    this.students.splice(index,1)
    return savedStudent
  }

  fillStudentsWithSEED( STUDENTS_SEED: users[]){
    this.students = STUDENTS_SEED;
  }
}
