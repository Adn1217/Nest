import { ParseMongoIdPipe } from "src/common/pipes/parse-mongo-id.pipe";

export type userRol = 'user' | 'admin'
export enum userRoles {
  user = 'user',
  admin = 'admin'
}

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
    id: ParseMongoIdPipe;
  }
export interface studentQueryParams {
  correo: string,
  limit?: number,
  offset?: number
}