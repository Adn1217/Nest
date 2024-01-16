import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCourseDto {

    @IsString({message: 'Atributos deben contener "curso"'})
    @IsNotEmpty()
    curso: string;

    @IsString({message: 'Atributos deben contener "creditos"'})
    // @IsNumber()
    @IsNotEmpty()
    creditos: number; 
}
