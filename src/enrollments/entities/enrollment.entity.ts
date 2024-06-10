import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { ParseMongoIdPipe } from "src/common/pipes/parse-mongo-id.pipe";
import { Course } from "src/courses/models/courses.model";
import { users } from "src/students/models/students.interface";


@Schema()
export class Enrollment extends Document {

    @Prop({
        index: true,
    })
    courseId: ParseMongoIdPipe;

    @Prop({
        index: true,
    })
    userId: string;
}

@Schema()
export class EnrollmentExpanded extends Enrollment {
    user: users;
    course: Course;
}


export const EnrollmentSchema = SchemaFactory.createForClass(Enrollment);
export const EnrollmentExpandedSchema = SchemaFactory.createForClass(EnrollmentExpanded);
