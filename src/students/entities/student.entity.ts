
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { userRol } from "../models/students.interface";

@Schema()
export class Student extends Document {
    nombres: string;
    apellidos: string;

    @Prop({
        unique: true,
        index: true,
    })
    usuario: string;

    edad: number;

    @Prop({
        unique: true,
        index: true,
    })
    correo: string;

    password: string;
    role: userRol
}

export const StudentSchema = SchemaFactory.createForClass(Student);
