import { IsMongoId, IsNotEmpty, IsString, IsUUID } from "class-validator";
import { ParseMongoIdPipe } from "src/common/pipes/parse-mongo-id.pipe";

export class CreateEnrollmentDto {

        // @IsString({message: 'Atributos deben contener "courseId"'})
        // @IsUUID()
        @IsNotEmpty({message: 'Atributos deben contener "courseId"'})
        @IsMongoId({message: 'Atributo debe ser un mongoId'})
        readonly courseId: ParseMongoIdPipe;


        @IsString({message: 'Atributos deben contener "userId"'})
        @IsUUID()
        @IsNotEmpty({message: 'Atributos deben contener "courseId"'})
        // @IsMongoId({message: 'Atributo debe ser un mongoId'})
        readonly userId: string;
}



