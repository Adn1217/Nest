import { IsInt, IsNotEmpty, IsPositive, IsString, Max } from "class-validator";

export class CreateCourseDto {

    @IsString({message: 'Atributos deben contener "curso"'})
    @IsNotEmpty()
    curso: string;

    // @IsString({message: 'Atributos deben contener "creditos"'})
    // @IsNumber()
    @IsInt({message: 'El número de créditos debe ser entero'})
    @IsPositive({message: 'El número de créditos debe ser positivo'})
    @Max(21,{message: 'El número máximmo de créditos es 21'})
    @IsNotEmpty()
    creditos: number; 
}
