import { userRol } from "src/students/models/students.interface"

export interface Teacher {
  id: string 
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