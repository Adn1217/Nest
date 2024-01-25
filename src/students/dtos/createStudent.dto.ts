import { IsEmail, IsEnum, IsInt, IsNumber, IsPositive, IsString, MinLength } from "class-validator";
import { userRol, userRoles } from "../models/students.interface";

const MINCHAR: number = 8;

export class CreateStudentDto {
    @IsString({message: 'Atributos deben contener "nombres"'})
    public readonly nombres: string;

    @IsString({message: 'Atributos deben contener "apellidos"'})
    public readonly apellidos: string;

    @IsString({message: 'Atributos deben contener "usuario"'})
    public readonly usuario: string;

    // @IsString({message: 'Atributos deben contener "edad"'})
    // @IsNumber()
    @IsInt({message: 'La edad debe ser un entero.'})
    @IsPositive({message: 'La edad debe ser positiva.'})
    public readonly edad: number;

    @IsString({message: 'Atributos deben contener "correo"'})
    @IsEmail()
    public readonly correo: string;

    @IsString({message: 'Atributos deben contener "password"'})
    @MinLength(MINCHAR, {message: `"password" debe ser mayor o igual a ${MINCHAR} caracteres`})
    public readonly password: string;

    @IsString({message: 'Atributos deben contener "role"'})
    @IsEnum(userRoles)
    public readonly role: userRol

    public getAttributes(){
        const studentDto = {
            'nombres': this.nombres,
            'apellidos': this.apellidos,
            'usuario': this.usuario,
            'edad': Number(this.edad),
            'correo': this.correo,
            'password': this.password,
            'role': this.role
        }
         return studentDto;
    }
}