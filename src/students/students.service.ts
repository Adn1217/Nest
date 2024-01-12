import { Injectable, NotFoundException } from '@nestjs/common';
export type userRol = 'user' | 'admin' | null

export interface newUser {
    nombres: string;
    apellidos: string;
    usuario: string;
    edad: number;
    correo: string;
    password: string;
    role: userRol
  }
export interface users extends newUser {
    id: number;
  }
@Injectable()
export class StudentsService {

    private students : users [] = [
          {
            "id": 1,
            "nombres": "Adrian Alberto",
            "apellidos": "Fernández Cabrera",
            "usuario": "adn1217",
            "edad": 32,
            "correo": "adn1217@hotmail.com",
            "password": "12345678",
            "role": "admin"
          },
          {
            "id": 2,
            "nombres": "Alejandra Paola",
            "apellidos": "Fernández Castro",
            "usuario": "alu2110",
            "edad": 31,
            "correo": "alufndz_@gmail.com",
            "password": "12345678",
            "role": "user"
          },
          {
            "id": 3,
            "nombres": "Rupertico Adolfo",
            "apellidos": "Herrera Gonzalez",
            "usuario": "ruper12",
            "edad": 33,
            "correo": "raherreraG@gmail.com",
            "password": "12345678",
            "role": "user"
          },
          {
            "id": 1693702085020,
            "nombres": "Keyner Antonio",
            "apellidos": "Fuentes Fontalvo",
            "usuario": "adn1217",
            "edad": 22,
            "correo": "adn1217@hotmail.com",
            "password": "11111111",
            "role": "user"
          },
          {
            "id": 1693794786589,
            "nombres": "Adrian Alberto",
            "apellidos": "Fernández Castro",
            "usuario": "adn1217",
            "edad": 23,
            "correo": "adn1219@hotmail.com",
            "password": "11111111",
            "role": "user"
          },
          {
            "id": 1700950786402,
            "nombres": "Esmeregildo",
            "apellidos": "Segrera fuentes",
            "usuario": "esmese",
            "edad": 67,
            "correo": "esme.segrera@hotmail.com",
            "password": "12345678",
            "role": "user"
          }
        ]


  findAll(){
    return this.students;
  }

  findById(id: number): users | undefined{
    const student = this.students.find((student) => student.id === id);
    if(!student){
        throw new NotFoundException(`Usuario con id: ${id} no encontrado.`);
    }
    return student
  }
}
