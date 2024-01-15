import { IsEmail, IsString, MinLength } from "class-validator";

export type userRol = 'user' | 'admin' | null

const minChar: number = 8;

export class CreateStudentDto {
    @IsString({message: 'Atributos deben contener "nombres"'})
    public readonly nombres: string;

    @IsString({message: 'Atributos deben contener "apellidos"'})
    public readonly apellidos: string;

    @IsString({message: 'Atributos deben contener "usuario"'})
    public readonly usuario: string;

    @IsString({message: 'Atributos deben contener "edad"'})
    // @IsNumber({maxDecimalPlaces: 0})
    public readonly edad: string;

    @IsString({message: 'Atributos deben contener "correo"'})
    @IsEmail()
    public readonly correo: string;

    @IsString({message: 'Atributos deben contener "password"'})
    @MinLength(minChar, {message: `"password" debe ser mayor o igual a ${minChar} caracteres`})
    public readonly password: string;

    @IsString({message: 'Atributos deben contener "role"'})
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