import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString, Matches, MinLength, matches } from "class-validator";
import { userRol, userRoles } from "src/students/models/students.interface"

const MinChar: number = 8;

export class CreateTeacherDto {

  @IsString({message: 'Atributos deben contener "nombres"'})
  @IsNotEmpty({message: 'Atributo no debe estar vacío'})
  readonly nombres: string;

  @IsString({message: 'Atributos deben contener "apellidos"'})
  @IsNotEmpty({message: 'Atributo no debe estar vacío'})
  readonly apellidos: string;

  @IsString({message: 'Atributos deben contener "usuario"'})
  @IsNotEmpty({message: 'Atributo no debe estar vacío'})
  readonly usuario: string;

  // @IsString({message: 'Atributos deben contener "edad"'})
  @IsNumber()
  @IsNotEmpty({message: 'Atributo no debe estar vacío'})
  readonly edad:  number;

  @IsString({message: 'Atributos deben contener "nivelAcademico"'})
  @IsNotEmpty({message: 'Atributo no debe estar vacío'})
  readonly nivelAcademico: string;

  // @IsString({message: 'Atributos deben contener "materias"'})
  @IsArray({message: 'Atributos deben contener "materias" como arreglo'})
  @IsNotEmpty({message: 'Atributo no debe estar vacío'})
  readonly materias: string [];

  @IsString({message: 'Atributos deben contener "correo"'})
  @IsEmail()
  readonly correo: string;

  @IsString({message: 'Atributos deben contener "password"'})
  @MinLength(MinChar, {message: `"password" debe ser mayor o igual a ${MinChar} caracteres`})
  readonly password: string;

  @IsString({message: 'Atributos deben contener "role"'})
  @IsNotEmpty({message: 'Atributo no debe estar vacío'})
  @IsEnum(userRoles)
  readonly role: userRol;
}
