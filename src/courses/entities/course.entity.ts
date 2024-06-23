import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Course extends Document {

    // id: string;
    @Prop({
        unique: true,
        index: true,
    })
    curso: string;
    @Prop({
        unique: false,
        index: false,
    })
    creditos: number;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
