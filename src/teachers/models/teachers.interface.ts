import { userRol } from "src/students/models/students.interface"

export interface newTeacher {
  nombres: string,
  apellidos: string,
  usuario: string,
  edad:  number,
  nivelAcademico: string
  materias: string[],
  correo: string,
  password: string,
  role: userRol
}

export interface Teacher extends newTeacher {
  id: string 
}