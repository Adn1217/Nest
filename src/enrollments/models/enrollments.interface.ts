import { ParseMongoIdPipe } from "src/common/pipes/parse-mongo-id.pipe";
import { Course } from "src/courses/models/courses.model";
import { users } from "src/students/models/students.interface";

export interface newEnrollment {
  courseId: ParseMongoIdPipe,
  userId: ParseMongoIdPipe
  }
export interface Enrollment extends newEnrollment {
    id: ParseMongoIdPipe;
  }

export interface enrollmentExpanded extends Enrollment {
  user: users,
  course: Course
}

export interface enrollmentQueryParams {
  _expand: string,
  limit?: number,
  offset?: number
}