import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { userRol } from "src/students/models/students.interface";


@Schema()
export class Teacher extends Document {

    // id: string;
    nombres: string;
    apellidos: string;

    @Prop({
    unique: true,
    index: true
    })
    usuario: string;

    edad:  number;
    nivelAcademico: string;
    materias: string[];

    @Prop({
    unique: true,
    index: true
    })
    correo: string;

    password: string;
    role: userRol;
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);
