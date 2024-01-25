import { IsEmail, IsEnum, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";
import { userRoles } from "../models/students.interface";

export type userRol = 'user' | 'admin' | null

const minChar: number = 8;

export class UpdateStudentDto {
    @IsString({message: 'Atributos deben contener "nombres"'})
    @IsOptional({message: 'Atributos deben contener "nombres"'})
    public readonly nombres?: string;

    @IsString({message: 'Atributos deben contener "apellidos"'})
    @IsOptional()
    public readonly apellidos?: string;

    @IsString({message: 'Atributos deben contener "usuario"'})
    @IsOptional()
    public readonly usuario?: string;

    // @IsString({message: 'Atributos deben contener "edad"'})
    // @IsNumber()
    @IsInt({message: 'La edad debe ser un entero.'})
    @IsPositive({message: 'La edad debe ser positiva.'})
    @IsOptional()
    // @IsNumber({maxDecimalPlaces: 0})
    public readonly edad?: number;

    @IsString({message: 'Atributos deben contener "correo"'})
    @IsEmail()
    @IsOptional()
    public readonly correo?: string;

    @IsString({message: 'Atributos deben contener "password"'})
    @MinLength(minChar, {message: `"password" debe ser mayor o igual a ${minChar} caracteres`})
    @IsOptional()
    public readonly password?: string;

    @IsString({message: 'Atributos deben contener "role"'})
    @IsEnum(userRoles)
    @IsOptional()
    public readonly role?: userRol

}