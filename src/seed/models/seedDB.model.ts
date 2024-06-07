import { Course } from "src/courses/models/courses.model"
import { Enrollment } from "src/enrollments/models/enrollments.interface"

export interface seedDB {
    createdCourses: Course[] | [],
    createdEnrollments: Enrollment[] | []
}