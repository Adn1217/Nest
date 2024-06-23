
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { userRol } from "../models/students.interface";

@Schema()
export class Student extends Document {
    @Prop({
        index: true,
    })
    nombres: string;
    @Prop({
        index: true,
    })
    apellidos: string;

    @Prop({
        unique: true,
        index: true,
    })
    usuario: string;

    @Prop()
    edad: number;

    @Prop({
        unique: true,
        index: true,
    })
    correo: string;

    @Prop()
    password: string;
    @Prop({
        index: true,
    })
    role: userRol
}

export const StudentSchema = SchemaFactory.createForClass(Student);
