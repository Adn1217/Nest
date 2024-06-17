import { newUser, users } from "src/students/models/students.interface"
import { Course } from "src/courses/models/courses.model"
import { Enrollment } from "src/enrollments/models/enrollments.interface"

export interface seedDB {
    createdStudents: users[] | [],
    createdTeachers: users[] | [],
    createdCourses: Course[] | [],
    createdEnrollments: Enrollment[] | []
}