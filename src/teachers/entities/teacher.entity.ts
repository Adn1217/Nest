import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { userRol } from "src/students/models/students.interface";


@Schema()
export class Teacher extends Document {

    @Prop()
    id: string;

    @Prop({
        index: true
    })
    nombres: string;

    @Prop({
        index: true
    })
    apellidos: string;

    @Prop({
    unique: true,
    index: true
    })
    usuario: string;

    @Prop()
    edad:  number;

    @Prop()
    nivelAcademico: string;

    @Prop()
    materias: string[];

    @Prop({
    unique: true,
    index: true
    })
    correo: string;

    @Prop()
    password: string;
    
    @Prop()
    role: userRol;
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);
