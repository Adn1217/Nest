import { Course } from "src/courses/models/courses.model";
import { users } from "src/students/models/students.interface";

export interface newEnrollment {
  courseId: string,
  userId: string
  }
export interface Enrollment extends newEnrollment {
    id: string;
  }

export interface enrollmentExpanded extends Enrollment {
  user: users,
  course: Course
}