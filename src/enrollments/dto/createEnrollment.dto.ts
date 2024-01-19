import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateEnrollmentDto {

        @IsString({message: 'Atributos deben contener "courseId"'})
        @IsUUID()
        @IsNotEmpty()
        readonly courseId: string;


        @IsString({message: 'Atributos deben contener "userId"'})
        @IsUUID()
        @IsNotEmpty()
        readonly userId: string;
}



