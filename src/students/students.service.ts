import { Injectable, NotFoundException } from '@nestjs/common';
import { users } from './models/students.interface';
import { v4 as uuid } from 'uuid';
import { CreateStudentDto, UpdateStudentDto } from './dtos';

@Injectable()
export class StudentsService {

  private students : users [] = [
    // {
    //   "id": uuid(),
    //   "nombres": "Adrian Alberto",
    //   "apellidos": "Fernández Cabrera",
    //   "usuario": "adn1217",
    //   "edad": 32,
    //   "correo": "adn1217@hotmail.com",
    //   "password": "12345678",
    //   "role": "admin"
    // },
    // {
    //   "id": uuid(),
    //   "nombres": "Alejandra Paola",
    //   "apellidos": "Fernández Castro",
    //   "usuario": "alu2110",
    //   "edad": 31,
    //   "correo": "alufndz_@gmail.com",
    //   "password": "12345678",
    //   "role": "user"
    // },
    // {
    //   "id": uuid(),
    //   "nombres": "Rupertico Adolfo",
    //   "apellidos": "Herrera Gonzalez",
    //   "usuario": "ruper12",
    //   "edad": 33,
    //   "correo": "raherreraG@gmail.com",
    //   "password": "12345678",
    //   "role": "user"
    // },
    // {
    //   "id": uuid(),
    //   "nombres": "Keyner Antonio",
    //   "apellidos": "Fuentes Fontalvo",
    //   "usuario": "adn1217",
    //   "edad": 22,
    //   "correo": "adn1217@hotmail.com",
    //   "password": "11111111",
    //   "role": "user"
    // },
    // {
    //   "id": uuid(),
    //   "nombres": "Adrian Alberto",
    //   "apellidos": "Fernández Castro",
    //   "usuario": "adn1217",
    //   "edad": 23,
    //   "correo": "adn1219@hotmail.com",
    //   "password": "11111111",
    //   "role": "user"
    // },
    // {
    //   "id": uuid(),
    //   "nombres": "Esmeregildo",
    //   "apellidos": "Segrera fuentes",
    //   "usuario": "esmese",
    //   "edad": 67,
    //   "correo": "esme.segrera@hotmail.com",
    //   "password": "12345678",
    //   "role": "user"
    // }
  ]


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
    const updatedStudent: users = {...savedStudent, ...updateStudentDto, edad: +updateStudentDto.edad}
    if(!updatedStudent.edad){
        updatedStudent.edad = savedStudent.edad
    }
    const index = this.students.findIndex((student) => student.id = id);
    this.students.splice(index,1, updatedStudent)
    return updatedStudent;
  }

  deleteStudent(id: string): users {
    const savedStudent = this.findById(id);
    const index = this.students.findIndex((student) => student.id = id);
    this.students.splice(index,1)
    return savedStudent
  }

  fillStudentsWithSEED( STUDENTS_SEED: users[]){
    this.students = STUDENTS_SEED;
  }
}
